const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Remove overflow-y-auto, custom-scrollbar, mask-image from the inner container
code = code.replace(
  /className=\{`overflow-y-auto custom-scrollbar pr-2 flex-1 \[mask-image:linear-gradient\(to_bottom,transparent,black_20px,black_calc\(100%-20px\),transparent\)\] -my-4 py-4 \$\{uiStyle === 'dynamic' \? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'\}`\}/g,
  "className={`flex-1 ${uiStyle === 'dynamic' ? 'flex flex-col gap-8' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'}`}"
);

// Wait, if we use flex flex-col gap-8, it will still be a single column and might be too tall.
// Let's use grid for dynamic mode too!
code = code.replace(
  /className=\{`flex-1 \$\{uiStyle === 'dynamic' \? 'flex flex-col gap-8' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'\}`\}/g,
  "className=\"flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8\""
);

// If it's already grid in the previous replace, let's just do a generic replace:
code = code.replace(/overflow-y-auto custom-scrollbar pr-2 flex-1 \[mask-image:linear-gradient\(to_bottom,transparent,black_20px,black_calc\(100%-20px\),transparent\)\] -my-4 py-4/g, "flex-1");
code = code.replace(/\$\{uiStyle === 'dynamic' \? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'\}/g, "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8");

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Grid applied");
