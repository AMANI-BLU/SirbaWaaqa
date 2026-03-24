const fs = require('fs');
let c = fs.readFileSync('d:\\SirbaWaaqaProject\\app\\(tabs)\\index.tsx', 'utf8');
c = c.replace(/<ThemedText style=\{\[styles\.headerDescription[^>]*>\s*\{t\('appDescription'\)\}\s*<\/ThemedText>/, '');
fs.writeFileSync('d:\\SirbaWaaqaProject\\app\\(tabs)\\index.tsx', c, 'utf8');
