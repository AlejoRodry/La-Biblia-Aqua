const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// For the label rows (Agua animada, Partículas, etc.)
code = code.replace(
  /uiStyle === 'dynamic' \? 'bg-\[#1a1a1a\] hover:bg-\[#2a2a2a\] border-\[3px\] border-\[#333\] hover:border-\[#81e6e6\]  text-white\/90 shadow-\[4px_4px_0_rgba\(0,0,0,0\.8\)\]'/g,
  "uiStyle === 'dynamic' ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border-[3px] border-[#333] hover:border-[#81e6e6] text-white/90 shadow-[4px_4px_0_rgba(0,0,0,0.8)] transform -skew-x-[15deg]'"
);

// For the Style select buttons (Sereno / Dinamico)
code = code.replace(
  /uiStyle === 'dynamic' \? 'border-2 ' : 'border rounded-xl'/g,
  "uiStyle === 'dynamic' ? 'border-2 transform -skew-x-[15deg]' : 'border rounded-xl'"
);

// For the Tono del fondo buttons
code = code.replace(
  /uiStyle === 'dynamic' \? 'border-\[3px\] ' : 'border border-white\/10 rounded-xl '/g,
  "uiStyle === 'dynamic' ? 'border-[3px] transform -skew-x-[15deg]' : 'border border-white/10 rounded-xl '"
);

// The Volver button:
// className="bg-[#e52b22] text-white px-8 py-3 md:px-10 md:py-4 md:text-xl font-black italic uppercase hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-[6px_6px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
// I will add `transform -skew-x-[15deg]` to it.
code = code.replace(
  /className="bg-\[#e52b22\] text-white px-8 py-3 md:px-10 md:py-4 md:text-xl font-black italic uppercase hover:bg-\[#e0e0e0\] hover:text-\[#e52b22\] transition-colors shadow-\[6px_6px_0_rgba\(0,0,0,0\.5\)\] active:translate-y-1 active:shadow-\[2px_2px_0_rgba\(0,0,0,0\.5\)\]"/g,
  'className="bg-[#e52b22] text-white px-8 py-3 md:px-10 md:py-4 md:text-xl font-black italic uppercase hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-[6px_6px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.5)] transform -skew-x-[15deg]"'
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Rows skewed");
