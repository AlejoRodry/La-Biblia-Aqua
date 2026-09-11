const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  /className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-4 \[mask-image:linear-gradient\(to_bottom,transparent,black_15px,black_calc\(100%-15px\),transparent\)\] -my-3 py-3"/g,
  "className=\"flex-1 space-y-4\""
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Offline fixed");
