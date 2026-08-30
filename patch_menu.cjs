const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// 1. Modify the global Serene header to show the current screen and a Back button
code = code.replace(
  '<div className="absolute top-6 left-6 md:top-12 md:left-12">',
  `<div className="absolute top-6 left-6 md:top-12 md:left-12 pointer-events-auto">
                  {screen !== 'main' && (
                    <button
                      onClick={() => setScreen('main')}
                      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-2 text-sm uppercase tracking-widest font-medium"
                    >
                      <span>← VOLVER</span>
                    </button>
                  )}`
);

code = code.replace(
  '<h2 className="text-4xl font-light text-white/90 tracking-widest uppercase">Ajustes</h2>',
  '<h2 className="text-4xl font-light text-white/90 tracking-widest uppercase">\n                    {screen === \'main\' ? \'Ajustes\' : screen === \'typography\' ? \'Tipografía\' : \'Efectos\'}\n                  </h2>'
);

// 2. Remove bounding box for Serene in Typography panel
code = code.replace(
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px] bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl'}`}",
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px]'}`}"
);

// 3. Remove bounding box for Serene in Visuals panel
code = code.replace(
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px] bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl'}`}",
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px]'}`}"
);

// 4. Hide inner title and back button in Serene theme (Typography)
code = code.replace(
  `<div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-4 shrink-0">
                      <h2 className={\`text-3xl \${uiStyle === 'dynamic' ? 'font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md' : 'font-light tracking-widest text-white'} uppercase\`}>Tipografía</h2>
                      <button 
                        onClick={() => setScreen('main')} 
                        className={uiStyle === 'dynamic' ? "bg-[#e52b22] text-white px-4 py-2 font-black italic uppercase skew-x-[-15deg] hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-lg" : "px-4 py-2 text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm"}
                      >
                        <span className={\`block \${uiStyle === 'dynamic' ? 'skew-x-[15deg]' : ''}\`}>Volver</span>
                      </button>
                    </div>`,
  `{uiStyle === 'dynamic' && (
                      <div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-4 shrink-0">
                        <h2 className="text-3xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Tipografía</h2>
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-4 py-2 font-black italic uppercase skew-x-[-15deg] hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-lg"
                        >
                          <span className="block skew-x-[15deg]">Volver</span>
                        </button>
                      </div>
                    )}`
);

// 5. Hide inner title and back button in Serene theme (Visuals)
code = code.replace(
  `<div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-4 shrink-0">
                      <h2 className={\`text-3xl \${uiStyle === 'dynamic' ? 'font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md' : 'font-light tracking-widest text-white'} uppercase\`}>Efectos</h2>
                      <button 
                        onClick={() => setScreen('main')} 
                        className={uiStyle === 'dynamic' ? "bg-[#e52b22] text-white px-4 py-2 font-black italic uppercase skew-x-[-15deg] hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-lg" : "px-4 py-2 text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm"}
                      >
                        <span className={\`block \${uiStyle === 'dynamic' ? 'skew-x-[15deg]' : ''}\`}>Volver</span>
                      </button>
                    </div>`,
  `{uiStyle === 'dynamic' && (
                      <div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-4 shrink-0">
                        <h2 className="text-3xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Efectos</h2>
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-4 py-2 font-black italic uppercase skew-x-[-15deg] hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-lg"
                        >
                          <span className="block skew-x-[15deg]">Volver</span>
                        </button>
                      </div>
                    )}`
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched menu styling!");
