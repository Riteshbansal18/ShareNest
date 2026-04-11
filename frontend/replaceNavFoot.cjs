const fs = require('fs');
const path = require('path');

const pagesDir = path.join('d:\\ShareNest', 'frontend', 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let hasChanges = false;

    // Replace header/nav
    // Find The TopNavBar comment and the following tag until it closes
    const topNavRegex = /{\/\*\s*TopNavBar\s*\*\/}\s*<(header|nav)[\s\S]*?<\/\1>/i;
    if (topNavRegex.test(content)) {
        content = content.replace(topNavRegex, '<Navbar />');
        hasChanges = true;
    } else if (!content.includes('<Navbar />')) {
        // Fallback or previously missed
        const fallbackRegex = /<(header|nav)\s+className="fixed top-0[\s\S]*?<\/\1>/g;
        if (fallbackRegex.test(content)) {
            content = content.replace(fallbackRegex, '<Navbar />');
            hasChanges = true;
        }
    }

    // Insert <Navbar /> right after <> if missing
    if (!content.includes('<Navbar />') && content.includes('<>')) {
        content = content.replace(/(<>\s*)/, '$1<Navbar />\n');
        hasChanges = true;
    }

    // Replace footer
    const footerRegex = /{\/\*\s*Footer\s*\*\/}\s*<footer[\s\S]*?<\/footer>/i;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, '<Footer />');
        hasChanges = true;
    } else if (!content.includes('<Footer />')) {
        const fallbackFooterRegex = /<footer\s+className="bg-slate-100[\s\S]*?<\/footer>/g;
        if (fallbackFooterRegex.test(content)) {
            content = content.replace(fallbackFooterRegex, '<Footer />');
            hasChanges = true;
        }
    }

    // Insert <Footer /> right before </> if missing
    if (!content.includes('<Footer />') && content.includes('</>')) {
        content = content.replace(/(\n\s*<\/>)/, '\n<Footer />$1');
        hasChanges = true;
    }

    // Add imports
    if (content.includes('<Navbar />') && !content.includes('import Navbar')) {
        content = content.replace(/(import React[^;]*;)/, "$1\nimport Navbar from '../components/Navbar';");
        hasChanges = true;
    }

    if (content.includes('<Footer />') && !content.includes('import Footer')) {
        content = content.replace(/(import React[^;]*;)/, "$1\nimport Footer from '../components/Footer';");
        hasChanges = true;
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
});
