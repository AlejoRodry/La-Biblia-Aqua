const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// 1. Remove the un-skew from the inner wrapper for all three panels (typography, visual, offline)
code = code.replace(/<div className=\{`flex flex-col h-full \$\{uiStyle === 'dynamic' \? 'transform skew-x-\[15deg\]' : ''\}`\}>/g, 
  '<div className="flex flex-col h-full">');

// 2. Fix the header buttons 'Volver' - they currently have `skew-x-[-15deg]` which would double-skew.
code = code.replace(/skew-x-\[-15deg\]/g, "");
// The text inside 'Volver' has `skew-x-[15deg]` which is correct to un-skew the text! Let's make sure it un-skews correctly.
// Original: `<span className="block skew-x-[15deg]">Volver</span>`
// That's perfect. The parent `button` will be slanted -15deg (from main container), and the text will be +15deg.

// 3. Fix the headers (Personalidad Visual, Elementos, Tono del Fondo)
code = code.replace(/skew-x-\[-10deg\]/g, ""); // Remove all individual -10deg skews
code = code.replace(/skew-x-\[10deg\]/g, "skew-x-[15deg]"); // Update counter-skews from 10 to 15 to match the -15 container skew

// 4. Update the labels (bg-[#1a1a1a] hover:bg-[#2a2a2a] ...)
// They currently have `skew-x-[-10deg]` which was removed by step 3. 
// But let's check if the checkboxes have their own `skew-x-[10deg]`. Yes, they do.

// Wait, the main panels (visual, typography, offline) have this Framer Motion:
// initial={{ opacity: 0, x: 100, skewX: uiStyle === 'dynamic' ? -15 : 0 }}

// By removing the inner `skew-x-[15deg]`, the entire content flows perfectly within the bounding box of the slanted container. 
// There will be no overflow!

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Skew patched");
