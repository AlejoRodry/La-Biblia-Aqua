const fs = require('fs');
let code = fs.readFileSync('src/components/BibleResults.tsx', 'utf8');

// Remove floatCls definition and usage
code = code.replace(/const floatCls = [\s\S]*?'underwater-float-sway';\s*/, '');
code = code.replace(/\$\{floatCls\}/g, '');

// Remove underwater-float from verses
code = code.replace(/\$\{!\w+ \? \(i % 2 === 0 \? 'underwater-float' : 'underwater-float-delayed'\) : ''\}/g, '');

// Just a general sweep of underwater-float inside the BibleResults file since we want a stable view
code = code.replace(/underwater-float-delayed/g, '');
code = code.replace(/underwater-float-slow/g, '');
code = code.replace(/underwater-float-sway/g, '');
code = code.replace(/underwater-float/g, '');

fs.writeFileSync('src/components/BibleResults.tsx', code);
console.log("Fixed BibleResults.tsx");
