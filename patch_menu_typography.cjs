const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  /<TypographyControl/g,
  "<TypographyControl\n                        uiStyle={uiStyle}"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Passed uiStyle");
