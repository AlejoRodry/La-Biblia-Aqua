const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Change from xl blur to md blur so the water is more visible
code = code.replace(
  'className="absolute inset-0 z-10 bg-black/40 backdrop-blur-xl pointer-events-auto"',
  'className="absolute inset-0 z-10 bg-black/20 backdrop-blur-md pointer-events-auto"'
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched blur!");
