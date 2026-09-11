const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf-8');

// 1. Fix modal positioning and border
code = code.replace(/right-\[2\%\] w-\[95vw\]/g, 'left-1/2 -translate-x-1/2 w-[90vw]');
code = code.replace(/border-l-\[12px\] border-\[\#81e6e6\]/g, 'border-[4px] border-[#81e6e6]');

// 2. Fix inactive states for "Tono del Fondo"
code = code.replace(
  /uiStyle === 'dynamic' \? 'bg-black\/40 hover:bg-black\/80 border-transparent text-white\/70 hover:text-white hover:border-\[\#81e6e6\]\/50'/g,
  "uiStyle === 'dynamic' ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border-[#333] hover:border-[#81e6e6] text-white/70 hover:text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]'"
);

// Fix the active state for "Tono del Fondo" so the border matches width
code = code.replace(
  /uiStyle === 'dynamic' \? 'bg-\[\#81e6e6\]\/20 border-\[\#81e6e6\] text-white shadow-\[0_0_15px_rgba\(129,230,230,0\.3\)\]'/g,
  "uiStyle === 'dynamic' ? 'bg-[#81e6e6]/20 border-[#81e6e6] text-white shadow-[4px_4px_0_rgba(129,230,230,0.4)]'"
);

// Ensure the border thickness is [3px] for Tono del Fondo in dynamic
code = code.replace(
  /className=\{`flex items-center space-x-3 w-full px-5 py-4 md:px-6 md:py-5 text-base md:text-lg transition-all group \$\{\n\s*uiStyle === 'dynamic' \? 'border-2' : 'border rounded-xl'/g,
  "className={`flex items-center space-x-3 w-full px-5 py-4 md:px-6 md:py-5 text-base md:text-lg transition-all group ${\n                                uiStyle === 'dynamic' ? 'border-[3px]' : 'border rounded-xl'"
);

// Fix inactive state for "Personalidad Visual"
code = code.replace(
  /uiStyle === 'dynamic' \? 'bg-\[\#81e6e6\]\/25 border-\[\#81e6e6\] text-\[\#81e6e6\] shadow-\[0_0_15px_rgba\(129,230,230,0\.3\)\]'/g,
  "uiStyle === 'dynamic' ? 'bg-[#81e6e6]/20 border-[#81e6e6] text-[#81e6e6] shadow-[4px_4px_0_rgba(129,230,230,0.4)]'"
);

// Ensure the border thickness is [3px] for Personalidad Visual
code = code.replace(
  /className=\{`flex flex-col items-center justify-center p-5 md:p-6 text-base transition-all group \$\{\n\s*uiStyle === 'dynamic' \? 'border-2' : 'border rounded-xl'/g,
  "className={`flex flex-col items-center justify-center p-5 md:p-6 text-base transition-all group ${\n                                uiStyle === 'dynamic' ? 'border-[3px]' : 'border rounded-xl'"
);

// Fix Personalidad Visual inactive
code = code.replace(
  /bg-black\/20 hover:bg-black\/40 border-white\/10 text-white\/70 hover:text-white hover:border-white\/30/g,
  "bg-black/20 hover:bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30" // this is for serene
);
// We need to target the serene fallback but change it only for dynamic. Wait, it's hard to regex this. I'll use multi_edit_file later for complex ones.

// 3. Fix ON/OFF button text alignment
code = code.replace(/<span className=\{`font-black italic text-base md:text-lg \$\{bgEnabled \? 'text-\[\#81e6e6\]' : 'text-white\/30'\}`\}>/g, 
  "<span className={`font-black italic text-base md:text-lg pr-1 ${bgEnabled ? 'text-[#81e6e6]' : 'text-white/30'}`}>");
code = code.replace(/<span className=\{`font-black italic text-base md:text-lg \$\{particlesEnabled \? 'text-\[\#81e6e6\]' : 'text-white\/30'\}`\}>/g, 
  "<span className={`font-black italic text-base md:text-lg pr-1 ${particlesEnabled ? 'text-[#81e6e6]' : 'text-white/30'}`}>");
code = code.replace(/<span className=\{`font-black italic text-base md:text-lg \$\{motionEffectsEnabled \? 'text-\[\#81e6e6\]' : 'text-white\/30'\}`\}>/g, 
  "<span className={`font-black italic text-base md:text-lg pr-1 ${motionEffectsEnabled ? 'text-[#81e6e6]' : 'text-white/30'}`}>");
code = code.replace(/<span className=\{`font-black italic text-base md:text-lg \$\{deepTransitionsEnabled \? 'text-\[\#81e6e6\]' : 'text-white\/30'\}`\}>/g, 
  "<span className={`font-black italic text-base md:text-lg pr-1 ${deepTransitionsEnabled ? 'text-[#81e6e6]' : 'text-white/30'}`}>");


fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log('done');
