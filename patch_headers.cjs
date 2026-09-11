const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  /<div className={`text-sm uppercase tracking-widest \$\{uiStyle === 'dynamic' \? 'font-black italic text-\[#81e6e6\]\/80' : 'font-medium text-white\/50'\}`}>\s*Personalidad Visual\s*<\/div>/g,
  `<div className={\`text-sm uppercase tracking-widest inline-block px-3 py-1 mb-2 \${uiStyle === 'dynamic' ? 'font-black italic text-black bg-[#81e6e6] skew-x-[-10deg]' : 'font-medium text-white/50'}\`}>
    <span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>Personalidad Visual</span>
  </div>`
);

code = code.replace(
  /<div className={`text-sm uppercase tracking-widest \$\{uiStyle === 'dynamic' \? 'font-black italic text-\[#81e6e6\]\/80' : 'font-medium text-white\/50'\}`}>\s*Elementos\s*<\/div>/g,
  `<div className={\`text-sm uppercase tracking-widest inline-block px-3 py-1 mb-2 \${uiStyle === 'dynamic' ? 'font-black italic text-black bg-[#81e6e6] skew-x-[-10deg]' : 'font-medium text-white/50'}\`}>
    <span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>Elementos</span>
  </div>`
);

// Tono del Fondo was already replaced, but let's make sure there are no other headers.
// Check if "Tipo de Letra" or "Tamaño" are there.

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Headers patched");
