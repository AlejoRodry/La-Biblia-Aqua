const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  /'font-black italic text-black bg-\[#81e6e6\] '/g,
  "'font-black italic text-black bg-[#81e6e6] transform -skew-x-[15deg]'"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Menu pills skewed");
