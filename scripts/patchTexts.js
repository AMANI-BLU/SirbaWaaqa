const fs = require('fs');
const files = [
    'd:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx',
    'd:\\SirbaWaaqaProject\\app\\+not-found.tsx.tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\index.tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\favorites.tsx',
    'd:\\SirbaWaaqaProject\\app\\(tabs)\\about.tsx',
    'd:\\SirbaWaaqaProject\\components\\HymnCard.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('import { ThemedText }')) return;
    let newContent = content.replace(/<Text/g, '<ThemedText').replace(/<\/Text>/g, '</ThemedText>');
    if (newContent !== content) {
        newContent = "import { ThemedText } from '@/components/ThemedText';\n" + newContent;
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Patched ' + file);
    }
});
