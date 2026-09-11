const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

// The segmented control
code = code.replace(
  /uiStyle === 'dynamic' \? 'bg-\[#111\] border-\[3px\] border-\[#333\] shadow-\[4px_4px_0_rgba\(0,0,0,0\.8\)\]'/g,
  "uiStyle === 'dynamic' ? 'bg-[#111] border-[3px] border-[#333] shadow-[4px_4px_0_rgba(0,0,0,0.8)] transform -skew-x-[15deg]'"
);

// The font buttons
code = code.replace(
  /className=\{`text-left p-5 md:p-6 transition-all border flex items-center justify-between group \$\{uiStyle === 'dynamic' \? '' : 'rounded-2xl'\}/g,
  "className={`text-left p-5 md:p-6 transition-all border flex items-center justify-between group ${uiStyle === 'dynamic' ? 'transform -skew-x-[15deg]' : 'rounded-2xl'}"
);

// The header pills (bg-[#81e6e6])
code = code.replace(
  /'bg-\[#81e6e6\] text-black font-black italic '/g,
  "'bg-[#81e6e6] text-black font-black italic transform -skew-x-[15deg]'"
);

fs.writeFileSync('src/components/TypographyControl.tsx', code);
console.log("Typo rows skewed");
