const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

// Add uiStyle to interface
code = code.replace(
  /layout\?: 'vertical' \| 'grid';/,
  "layout?: 'vertical' | 'grid';\n  uiStyle?: 'dynamic' | 'serene';"
);

// Add to props destructuring
code = code.replace(
  /layout = 'vertical'/,
  "layout = 'vertical',\n  uiStyle = 'serene'"
);

// Replace font selection button styles
code = code.replace(
  /className=\{`text-left p-3\.5 rounded-2xl transition-all border flex items-center justify-between group \$\{/g,
  "className={`text-left p-3.5 transition-all border flex items-center justify-between group ${uiStyle === 'dynamic' ? 'skew-x-[-10deg]' : 'rounded-2xl'} ${"
);

code = code.replace(
  /isSelected \? 'bg-white\/20 border-white text-white shadow-\[0_2px_8px_rgba\(255,255,255,0\.15\)\]' : 'bg-black\/20 border-white\/10 text-white\/70 hover:bg-black\/40 hover:border-white\/30 hover:text-white'/g,
  "isSelected ? (uiStyle === 'dynamic' ? 'bg-[#1a1a1a] border-[3px] border-[#81e6e6] text-[#81e6e6] shadow-[4px_4px_0_rgba(129,230,230,0.5)]' : 'bg-white/20 border-white text-white shadow-[0_2px_8px_rgba(255,255,255,0.15)]') : (uiStyle === 'dynamic' ? 'bg-[#111] border-[3px] border-[#333] text-white/50 hover:border-[#81e6e6]/50 hover:text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]' : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/40 hover:border-white/30 hover:text-white')"
);

code = code.replace(
  /<div className=\{`text-\[10px\] mt-0\.5 transition-colors \$\{isSelected \? 'text-white\/70' : 'text-white\/40 group-hover:text-white\/60'\}`\}>/g,
  `<div className={\`text-[10px] mt-0.5 transition-colors \${isSelected ? (uiStyle === 'dynamic' ? 'text-[#81e6e6]/70' : 'text-white/70') : 'text-white/40 group-hover:text-white/60'}\`}>`
);

// Replace selected icon wrapper
code = code.replace(
  /<span className="shrink-0 p-1 bg-white text-black rounded-full shadow-sm">/g,
  `<span className={\`shrink-0 p-1 \${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black' : 'bg-white text-black rounded-full'} shadow-sm\`}>`
);

// Replace headings
code = code.replace(
  /<div className="text-\[11px\] font-medium text-white\/50 uppercase tracking-widest">/g,
  `<div className={\`text-[11px] uppercase tracking-widest inline-block px-2 py-0.5 mb-2 \${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic skew-x-[-10deg]' : 'font-medium text-white/50'}\`}><span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>`
);

code = code.replace(
  /<\/div>\s*<div className={`grid grid-cols-1/g,
  `</span></div>\n      <div className={\`grid grid-cols-1`
);

// Font size stepper wrappers
code = code.replace(
  /<div className="flex items-center gap-1\.5 p-1\.5 bg-black\/20 rounded-2xl border border-white\/10">/g,
  `<div className={\`flex items-center gap-1.5 p-1.5 border \${uiStyle === 'dynamic' ? 'bg-[#111] border-[3px] border-[#333] skew-x-[-10deg] shadow-[4px_4px_0_rgba(0,0,0,0.8)]' : 'bg-black/20 rounded-2xl border-white/10'}\`}>`
);

code = code.replace(
  /className="p-3 hover:bg-white\/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-white transition-all active:scale-95 flex items-center justify-center shrink-0"/g,
  `className={\`p-3 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all active:scale-95 flex items-center justify-center shrink-0 \${uiStyle === 'dynamic' ? '' : 'rounded-xl'}\`}`
);

// Font size tag in stepper
code = code.replace(
  /className=\{`py-2 px-1 rounded-xl text-xs transition-all text-center flex flex-col items-center justify-center \$\{/g,
  "className={`py-2 px-1 text-xs transition-all text-center flex flex-col items-center justify-center ${uiStyle === 'dynamic' ? '' : 'rounded-xl'} ${"
);

code = code.replace(
  /isSelected \? 'bg-white\/20 text-white font-bold shadow-sm' : 'text-white\/40'/g,
  "isSelected ? (uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic' : 'bg-white/20 text-white font-bold shadow-sm') : 'text-white/40'"
);

// Need to fix the title in font size which uses a slightly different HTML structure
code = code.replace(
  /<span className="text-\[11px\] font-medium text-white\/50 uppercase tracking-widest">/g,
  `<span className={\`text-[11px] uppercase tracking-widest inline-block px-2 py-0.5 \${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic skew-x-[-10deg]' : 'font-medium text-white/50'}\`}><span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>`
);
// Make sure to close the inner span for font size title
code = code.replace(
  /Tamaño de Letra\s*<\/span>/,
  `Tamaño de Letra\n        </span></span>`
);


fs.writeFileSync('src/components/TypographyControl.tsx', code);
console.log("Updated TypographyControl");
