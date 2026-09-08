const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const matches = code.match(/variants=\{\{[\s\S]*?\}\}/g);
console.log(matches.slice(0, 6).join('\n\n'));
