const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(/uiStyle === 'dynamic' \? 'bg-black\/40 border-2 border-white\/20 skew-x-\[-10deg\]' : 'rounded-xl border border-white\/15 bg-black\/20'/g, 
"uiStyle === 'dynamic' ? 'bg-[#1a1a1a] border-[3px] border-[#333] skew-x-[-10deg] shadow-[4px_4px_0_rgba(0,0,0,0.8)]' : 'rounded-xl border border-white/15 bg-black/20'");

// Update "Estado de conectividad actual" card in offline
code = code.replace(/uiStyle === 'dynamic' \? 'bg-black\/50 border-2 skew-x-\[-10deg\]'/g, 
"uiStyle === 'dynamic' ? 'bg-[#1a1a1a] border-[3px] border-[#333] skew-x-[-10deg] shadow-[4px_4px_0_rgba(0,0,0,0.8)]'");

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Offline cards patched");
