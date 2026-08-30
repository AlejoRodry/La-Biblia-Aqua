const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  '<div className="overflow-y-auto custom-scrollbar pr-2 flex-1">',
  '<div className="overflow-y-auto custom-scrollbar pr-2 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)] -my-4 py-4">'
);
// Make sure both typography and visual panels get it.
code = code.replace(
  /className={`overflow-y-auto custom-scrollbar pr-2 flex-1 \${uiStyle === 'dynamic'/g,
  'className={`overflow-y-auto custom-scrollbar pr-2 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)] -my-4 py-4 ${uiStyle === \\\'dynamic\\\''
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched mask!");
