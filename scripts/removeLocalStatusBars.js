const fs = require('fs');
const files = [
    'd:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\index.tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\favorites.tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\about.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<StatusBar\s+barStyle=[^>]+>\s*/g, '');
    content = content.replace(/<StatusBar\s+[^>]*\/>\s*/g, '');
    content = content.replace(/<StatusBar([^>]*)>\s*/g, '');

    content = content.replace(/\bStatusBar,\s*/g, '');
    content = content.replace(/,\s*StatusBar\b/g, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Processed ' + file);
});
