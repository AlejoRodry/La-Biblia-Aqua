const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const matches = code.match(/exit: deepTransitionsEnabled \? \{[\s\S]*?\}/g);
console.log(matches);
