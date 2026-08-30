const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

// 1. Add layout prop to TypographyControlProps
code = code.replace(
  "  showPreview?: boolean;\n}",
  "  showPreview?: boolean;\n  layout?: 'vertical' | 'grid';\n}"
);

// 2. Add layout='vertical' to destructured props
code = code.replace(
  "  showPreview = true,\n}: TypographyControlProps) {",
  "  showPreview = true,\n  layout = 'vertical',\n}: TypographyControlProps) {"
);

// 3. Restructure the return statement to use the layout prop
code = code.replace(
  'return (\n    <div className="space-y-4">',
  'return (\n    <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" : "space-y-4"}>'
);

// 4. Wrap Preview
code = code.replace(
  "{/* 5. VISTA PREVIA EN VIVO */}\n      {showPreview && (\n        <div className=\"p-3.5 bg-black/40 border border-cyan-400/20 rounded-2xl space-y-1.5 shadow-inner\">",
  "{/* 5. VISTA PREVIA EN VIVO */}\n      {showPreview && (\n        <div className={`p-3.5 bg-black/40 border border-cyan-400/20 rounded-2xl space-y-1.5 shadow-inner ${layout === \"grid\" ? \"md:col-span-2\" : \"\"}`}>"
);

// 5. Scroll height for Type
code = code.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar"',
  'className={`grid grid-cols-1 sm:grid-cols-2 gap-1.5 overflow-y-auto pr-1 custom-scrollbar ${layout === "grid" ? "max-h-56 md:max-h-[200px]" : "max-h-56"}`}'
);

fs.writeFileSync('src/components/TypographyControl.tsx', code);
console.log("Patched TypographyControl!");
