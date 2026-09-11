const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// The toggle labels are currently:
// <span className={uiStyle === 'dynamic' ? 'skew-x-[15deg] font-black italic uppercase tracking-wide' : 'font-light tracking-widest uppercase'}>Agua Animada</span>
code = code.replace(
  /'skew-x-\[15deg\] font-black italic uppercase tracking-wide'/g,
  "'skew-x-[15deg] font-black italic uppercase tracking-wide text-base md:text-lg'"
);

// The 'ON' / 'OFF' text is `text-sm`. Make it `text-base`.
code = code.replace(
  /font-black italic text-sm/g,
  "font-black italic text-base md:text-lg"
);

// Make the toggle boxes a bit bigger (w-14 h-8 to w-16 h-10)
code = code.replace(
  /w-14 h-8/g,
  "w-16 md:w-20 h-10 md:h-12"
);

// Make the section headers bigger
code = code.replace(
  /text-\[11px\] uppercase tracking-widest inline-block px-3 py-1 mb-2/g,
  "text-xs md:text-sm uppercase tracking-widest inline-block px-4 py-1.5 mb-4"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);

// Same for TypographyControl
let typoCode = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

typoCode = typoCode.replace(
  /text-\[11px\] uppercase tracking-widest inline-block px-2 py-0\.5 mb-2/g,
  "text-xs md:text-sm uppercase tracking-widest inline-block px-4 py-1.5 mb-4"
);

typoCode = typoCode.replace(
  /text-\[11px\] uppercase tracking-widest inline-block px-2 py-0\.5 \$/g,
  "text-xs md:text-sm uppercase tracking-widest inline-block px-4 py-1.5 $"
);

fs.writeFileSync('src/components/TypographyControl.tsx', typoCode);

console.log("Fonts and hitboxes enlarged");
