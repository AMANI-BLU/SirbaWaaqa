const fs = require('fs');
const files = [
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\about.tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\favorites.tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\index.tsx',
    'd:\\SirbaWaaqaProject\\app\\+not-found.tsx.tsx',
    'd:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx',
    'd:\\SirbaWaaqaProject\\components\\HymnCard.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(/<ThemedTextInput/g, '<TextInput');
    content = content.replace(/<\/ThemedTextInput>/g, '</TextInput>');

    // Clean up unused 'Text' in react-native literal imports
    content = content.replace(/\bText,\s*/g, '');
    content = content.replace(/,\s*Text\b/g, '');
    content = content.replace(/\{\s*Text\s*\}/g, '{}');
    fs.writeFileSync(file, content, 'utf8');
});
