const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// 1. Add ChevronLeft import
code = code.replace(
  "import { Sparkles, Sun, Moon, Sunrise, Sunset, Palette, Type, X } from 'lucide-react';",
  "import { Sparkles, Sun, Moon, Sunrise, Sunset, Palette, Type, X, ChevronLeft } from 'lucide-react';"
);

// 2. Fix the header
const regex = /<div className="absolute top-6 left-6 md:top-12 md:left-12 z-50 pointer-events-auto">[\s\S]*?<div className="w-16 h-1 bg-cyan-400\/50 mt-4 rounded-full"><\/div>\s*<\/div>/;

const newHeader = `<div className="absolute top-8 left-8 md:top-14 md:left-14 z-50 pointer-events-auto flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {screen !== 'main' && (
                      <button
                        onClick={() => setScreen('main')}
                        className="p-3 bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-full transition-all text-white active:scale-95 shadow-lg"
                        title="Volver"
                      >
                        <ChevronLeft size={24} strokeWidth={1.5} />
                      </button>
                    )}
                    <h2 className="text-3xl md:text-5xl font-light text-white/90 tracking-widest uppercase drop-shadow-md">
                      {screen === 'main' ? 'Ajustes' : screen === 'typography' ? 'Tipografía' : 'Efectos'}
                    </h2>
                  </div>
                  <div className="w-16 h-1 bg-white/30 rounded-full ml-1 md:ml-3"></div>
                </div>`;

code = code.replace(regex, newHeader);

// 3. Remove cyan tones from Visuals panel
code = code.replace(/bg-cyan-500\/20 border-cyan-400 text-white shadow-\[0_0_15px_rgba\(34,211,238,0\.2\)\]/g, "bg-white/15 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]");
code = code.replace(/text-cyan-300/g, "text-white");

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched SystemMenu successfully");
