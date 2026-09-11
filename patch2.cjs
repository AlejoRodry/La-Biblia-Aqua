const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf-8');

// For serene button (inactive when dynamic is active)
code = code.replace(
  /uiStyle === 'serene' \n\s*\? 'bg-white\/20 border-white text-white shadow-\[0_0_15px_rgba\(255,255,255,0\.2\)\]'\n\s*: 'bg-black\/20 hover:bg-black\/40 border-white\/10 text-white\/70 hover:text-white hover:border-white\/30'/g,
  "uiStyle === 'serene' \n                                  ? 'bg-white/20 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'\n                                  : (uiStyle === 'dynamic' ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border-[#333] hover:border-[#81e6e6] text-white/70 hover:text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]' : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30')"
);

// For dynamic button (active state)
code = code.replace(
  /uiStyle === 'dynamic' \n\s*\? 'bg-\[\#81e6e6\]\/25 border-\[\#81e6e6\] text-\[\#81e6e6\] shadow-\[0_0_15px_rgba\(129,230,230,0\.3\)\]' \n\s*: 'bg-black\/20 hover:bg-black\/40 border-white\/10 text-white\/70 hover:text-white hover:border-white\/30'/g,
  "uiStyle === 'dynamic' \n                                  ? 'bg-[#81e6e6]/20 border-[#81e6e6] text-[#81e6e6] shadow-[4px_4px_0_rgba(129,230,230,0.4)]' \n                                  : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30'"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log('done');
