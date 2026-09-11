const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

code = code.replace(/skew-x-\[-10deg\]/g, "");
code = code.replace(/skew-x-\[10deg\]/g, "skew-x-[15deg]");

fs.writeFileSync('src/components/TypographyControl.tsx', code);
console.log("Typo skew patched");
