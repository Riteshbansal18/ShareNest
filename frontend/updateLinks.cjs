const fs = require('fs');
const path = require('path');

const outDir = path.join('d:\\ShareNest', 'frontend', 'src', 'pages');

const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(outDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace "Find Homes"
    content = content.replace(/to="#"(>Find Homes<\/Link>)/g, 'to="/find-homes"$1');
    content = content.replace(/to="#"(>Find Roommates<\/Link>)/g, 'to="/roommate-listing"$1');
    content = content.replace(/to="#"(>List Property<\/Link>)/g, 'to="/create-post"$1');

    // Replace buttons for Sign In and Sign Up to wrap in Links
    content = content.replace(/<button([^>]*)>Sign In<\/button>/g, '<Link to="/login"><button$1>Sign In</button></Link>');
    content = content.replace(/<button([^>]*)>Sign Up<\/button>/g, '<Link to="/sign-up"><button$1>Sign Up</button></Link>');

    // RoommateMatch logo link to home (depends on how it's formatted. It's normally just text, let's wrap it)
    content = content.replace(/<div className="([^"]*)">RoomieMatch<\/div>/g, '<Link to="/"><div className="$1">RoomieMatch</div></Link>');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated links in ${file}`);
});
