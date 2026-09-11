const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Update the dynamic panel container across all screens
// The original is: `bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]`
// Let's replace it everywhere.
code = code.replace(/bg-blue-950\/95 border-4 border-\[#81e6e6\] rounded-2xl shadow-\[15px_15px_0_rgba\(0,0,0,0\.6\)\]/g, 
"bg-[#111] border-l-[12px] border-[#81e6e6] shadow-[15px_15px_0_rgba(0,0,0,0.7)]");

// Also there is another one for the main screen which has its own string.
code = code.replace(/max-w-xl' : 'max-w-2xl bg-black\/40 backdrop-blur-xl border border-white\/20 rounded-2xl md:rounded-3xl p-6 md:p-10'\}/g,
"max-w-xl bg-[#111] border-l-[12px] border-[#81e6e6] shadow-[15px_15px_0_rgba(0,0,0,0.7)] p-6' : 'max-w-2xl bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-10'}");

function replaceCheckbox(labelName, stateName, setterName) {
  let searchStr = `<span className={uiStyle === 'dynamic' ? 'skew-x-[10deg] font-black italic uppercase tracking-wide' : 'font-light tracking-widest uppercase'}>${labelName}</span>
                            <input 
                              type="checkbox" 
                              checked={${stateName}} 
                              onChange={() => ${setterName}(!${stateName})}
                              className={\`accent-[#e52b22] w-5 h-5 cursor-pointer \${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''}\`}
                            />`;
                            
  let replaceStr = `<span className={uiStyle === 'dynamic' ? 'skew-x-[10deg] font-black italic uppercase tracking-wide' : 'font-light tracking-widest uppercase'}>${labelName}</span>
                            {uiStyle === 'dynamic' ? (
                              <div onClick={(e) => { e.preventDefault(); ${setterName}(!${stateName}); }} className="flex items-center justify-center skew-x-[10deg] border-2 border-[#555] bg-black w-14 h-8 transition-colors group-hover:border-[#81e6e6]">
                                <span className={\`font-black italic text-sm \${${stateName} ? 'text-[#81e6e6]' : 'text-white/30'}\`}>{${stateName} ? 'ON' : 'OFF'}</span>
                              </div>
                            ) : (
                              <input 
                                type="checkbox" 
                                checked={${stateName}} 
                                onChange={() => ${setterName}(!${stateName})}
                                className="accent-[#e52b22] w-5 h-5 cursor-pointer"
                              />
                            )}`;
                            
  code = code.replace(searchStr, replaceStr);
}

replaceCheckbox('Agua Animada', 'bgEnabled', 'setBgEnabled');
replaceCheckbox('Partículas', 'particlesEnabled', 'setParticlesEnabled');
replaceCheckbox('Movimiento Acuático', 'motionEffectsEnabled', 'setMotionEffectsEnabled');
replaceCheckbox('Transiciones Profundas', 'deepTransitionsEnabled', 'setDeepTransitionsEnabled');

// Change the section titles in 'visual'
code = code.replace(
  /<h3 className={`text-xs mb-3 \$\{uiStyle === 'dynamic' \? 'font-black italic tracking-widest text-\[#81e6e6\] uppercase' : 'font-semibold tracking-wider text-white\/50 uppercase'\}`}>\s*Personalidad Visual\s*<\/h3>/,
  `<h3 className={\`text-xs mb-3 inline-block px-3 py-1 \${uiStyle === 'dynamic' ? 'font-black italic tracking-widest text-black bg-[#81e6e6] uppercase skew-x-[-10deg]' : 'font-semibold tracking-wider text-white/50 uppercase'}\`}>
    <span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>Personalidad Visual</span>
  </h3>`
);

code = code.replace(
  /<h3 className={`text-xs mb-3 \$\{uiStyle === 'dynamic' \? 'font-black italic tracking-widest text-\[#81e6e6\] uppercase' : 'font-semibold tracking-wider text-white\/50 uppercase'\}`}>\s*Elementos\s*<\/h3>/,
  `<h3 className={\`text-xs mb-3 inline-block px-3 py-1 \${uiStyle === 'dynamic' ? 'font-black italic tracking-widest text-black bg-[#81e6e6] uppercase skew-x-[-10deg]' : 'font-semibold tracking-wider text-white/50 uppercase'}\`}>
    <span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>Elementos</span>
  </h3>`
);

code = code.replace(
  /<div className={`text-sm uppercase tracking-widest \$\{uiStyle === 'dynamic' \? 'font-black italic text-\[#81e6e6\]\/80' : 'font-medium text-white\/50'\}`}>\s*Tono del Fondo\s*<\/div>/,
  `<div className={\`text-sm uppercase tracking-widest inline-block px-3 py-1 mb-2 \${uiStyle === 'dynamic' ? 'font-black italic text-black bg-[#81e6e6] skew-x-[-10deg]' : 'font-medium text-white/50'}\`}>
    <span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>Tono del Fondo</span>
  </div>`
);

// We need to make the label backgrounds for toggles sharper and have a white outline instead of transparent.
code = code.replace(
  /uiStyle === 'dynamic' \? 'bg-black\/40 hover:bg-black\/60 border-2 border-transparent hover:border-white\/20 skew-x-\[-10deg\] text-white\/90'/g,
  "uiStyle === 'dynamic' ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border-[3px] border-[#333] hover:border-[#81e6e6] skew-x-[-10deg] text-white/90 shadow-[4px_4px_0_rgba(0,0,0,0.8)]'"
);


fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched checkboxes and section headers.");
