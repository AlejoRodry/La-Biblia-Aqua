const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  "\\\\'dynamic\\\\'",
  "'dynamic'"
);
code = code.replace(
  "\\'dynamic\\'",
  "'dynamic'"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched syntax error!");
