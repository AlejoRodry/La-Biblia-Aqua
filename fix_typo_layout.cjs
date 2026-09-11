const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  /layout=\{uiStyle === 'dynamic' \? 'vertical' : 'grid'\}/g,
  "layout=\"grid\""
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Typo layout fixed");
