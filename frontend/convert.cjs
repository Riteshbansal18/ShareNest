const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\ShareNest';
const outDir = path.join(rootDir, 'frontend', 'src', 'pages');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Ensure components folder exists for common components
const compDir = path.join(rootDir, 'frontend', 'src', 'components');
if (!fs.existsSync(compDir)) {
    fs.mkdirSync(compDir, { recursive: true });
}

const files = [
    'CreatePost.html',
    'FindHomes.html',
    'Home.html',
    'Login.html',
    'PropertyDetails.html',
    'RoommateListing.html',
    'UserDashboard.html',
    'ViewRommate.html',
    'signUp.html'
];

function convertHtmlToJsx(html) {
    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let body = bodyMatch ? bodyMatch[1] : html;

    // We do have script tags in the body in some cases, let's remove them
    body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Replace class= with className=
    body = body.replace(/class=/g, 'className=');

    // Replace inline styles (very naive approach, but usually enough for standard tailwind templates that barely use them)
    // body = body.replace(/style="([^"]*)"/g, (match, p1) => {
    //     // convert "color: red; font-size: 12px" to {{ color: 'red', fontSize: '12px' }}
    //     // This is hard to do perfectly with regex, leaving it for manual fix for now or simple replacements
    // });
    body = body.replace(/style="font-variation-settings: 'FILL' 1;"/g, `style={{ fontVariationSettings: "'FILL' 1" }}`);
    // Home.html has: style="font-variation-settings: 'FILL' 1;"
    // We can also just ignore the rest or replace specifically.
    body = body.replace(/style="([^"]*)"/g, "style={{}}"); // remove for now to avoid errors unless it's critical, or let's try to convert simple ones

    // Close input, img, hr, br tags
    body = body.replace(/<(input|img|hr|br)([^>]*?)>/gi, (match, tag, rest) => {
        if (rest.endsWith('/')) return match;
        return `<${tag}${rest} />`;
    });

    // Some tags might look like <img ... />. The above regex might double add / if not careful. Let's do a safer one:
    body = body.replace(/<img(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<img${p1} />`;
    });
    body = body.replace(/<input(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<input${p1} />`;
    });
    body = body.replace(/<hr(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<hr${p1} />`;
    });
    body = body.replace(/<br(.*?)>/g, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<br${p1} />`;
    });

    // Fix other attributes
    body = body.replace(/for=/g, 'htmlFor=');
    body = body.replace(/tabindex=/g, 'tabIndex=');
    body = body.replace(/onclick=/g, 'onClick=');
    body = body.replace(/stroke-width=/g, 'strokeWidth=');
    body = body.replace(/stroke-linecap=/g, 'strokeLinecap=');
    body = body.replace(/stroke-linejoin=/g, 'strokeLinejoin=');

    // Fix HTML comments -> JSX comments
    body = body.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    // Quick fix for selected attribute in options
    body = body.replace(/selected /g, 'defaultValue ');

    // Remove standalone 'selected'
    body = body.replace(/<option([^>]*)selected([^>]*)>/g, '<option$1defaultValue$2>');

    // Remove standard html closing tags that might be wrong
    return body;
}

files.forEach(file => {
    let name = file.replace('.html', '');
    name = name.charAt(0).toUpperCase() + name.slice(1);

    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
        const html = fs.readFileSync(filePath, 'utf-8');
        let jsx = convertHtmlToJsx(html);

        let componentCode = `import React from 'react';
import { Link } from 'react-router-dom';

export default function ${name}() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;

        // Let's replace 'href="#"' with 'to="#"' where applicable if we use Link component
        componentCode = componentCode.replace(/<a([^>]*)href="([^"]*)"/g, '<Link$1to="$2"');
        componentCode = componentCode.replace(/<\/a>/g, '</Link>');

        fs.writeFileSync(path.join(outDir, `${name}.jsx`), componentCode, 'utf-8');
        console.log(`Converted ${file} to ${name}.jsx`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
