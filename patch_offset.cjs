const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  'offset="mr-0"',
  'offset={uiStyle === "dynamic" ? "mr-0" : ""}'
);

code = code.replace(
  'offset="mr-8 sm:mr-16"',
  'offset={uiStyle === "dynamic" ? "mr-8 sm:mr-16" : ""}'
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched offset!");
