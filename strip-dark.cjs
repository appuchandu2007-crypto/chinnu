const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
// Remove all dark: classes
content = content.replace(/dark:[^\s"']+/g, '');
// Clean up double spaces left behind
content = content.replace(/  +/g, ' ');
// Clean up spaces before quotes
content = content.replace(/ "/g, '"');
fs.writeFileSync('src/App.tsx', content);
