const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

code = code.replace(/ transform -skew-x-\[15deg\]/g, '');

fs.writeFileSync('src/components/TypographyControl.tsx', code);
console.log("Typo restored");
