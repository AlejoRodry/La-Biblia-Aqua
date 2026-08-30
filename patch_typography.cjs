const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

// Remove the nested scroll and max-h constraint that causes the abrupt cut
code = code.replace(
  'className={`grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar ${layout === "grid" ? "max-h-64 md:max-h-[350px]" : "max-h-56"}`}',
  'className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${layout === "grid" ? "" : "overflow-y-auto pr-1 custom-scrollbar max-h-56"}`}'
);

fs.writeFileSync('src/components/TypographyControl.tsx', code);
console.log("Patched TypographyControl");
