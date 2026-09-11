const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Replace Typography header
code = code.replace(
  /<div className="flex items-center justify-between mb-6 border-b-2 border-white\/20 pb-4 shrink-0">\s*<h2 className="text-3xl font-black italic tracking-tighter text-\[#81e6e6\] drop-shadow-md uppercase">Tipografía<\/h2>\s*<button[\s\S]*?<\/button>\s*<\/div>/,
  `<div className="mb-6 border-b-2 border-white/20 pb-4 shrink-0 mt-4 md:mt-0">
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Tipografía</h2>
                      </div>`
);

// Append Typography Volver to the bottom of the panel
code = code.replace(
  /(\s*)<TypographyControl[\s\S]*?\/>\s*<\/div>\s*<\/div>/,
  `$1<TypographyControl
                        layout={uiStyle === 'dynamic' ? 'vertical' : 'grid'}
                        uiStyle={uiStyle}
                        readingFontFamily={readingFontFamily}
                        setReadingFontFamily={setReadingFontFamily}
                        readingFontSize={readingFontSize}
                        setReadingFontSize={setReadingFontSize}
                        readingLineHeight={readingLineHeight}
                        setReadingLineHeight={setReadingLineHeight}
                        numberFontFamily={numberFontFamily}
                        setNumberFontFamily={setNumberFontFamily}
                        showNumberFont={true}
                        showPreview={true}
                      />
                    </div>
                    {uiStyle === 'dynamic' && (
                      <div className="mt-6 pt-2 shrink-0 flex justify-end">
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-8 py-3 md:px-10 md:py-4 md:text-xl font-black italic uppercase hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-[6px_6px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
                        >
                          <span className="block skew-x-[15deg]">Volver al Menú</span>
                        </button>
                      </div>
                    )}
                  </div>`
);

// Replace Visual header
code = code.replace(
  /<div className="flex items-center justify-between mb-6 border-b-2 border-white\/20 pb-4 shrink-0">\s*<h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-\[#81e6e6\] drop-shadow-md uppercase">Efectos<\/h2>\s*<button[\s\S]*?<\/button>\s*<\/div>/,
  `<div className="mb-6 border-b-2 border-white/20 pb-4 shrink-0 mt-4 md:mt-0">
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Efectos</h2>
                      </div>`
);

// Append Visual Volver to the bottom of the panel
// The end of visual panel has `</div>\n                  </div>\n                </motion.div>\n              )}`
// We need to inject before `</div>\n                  </div>\n                </motion.div>\n              )}` but after the main scroll area.
// The scroll area ends with `</div>` (the `overflow-y-auto` div).
code = code.replace(
  /(\s*)<\/div>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*\{\/\* PANEL DE MODO SIN INTERNET \(OFFLINE\) \*\/\}/,
  `$1</div>
                    {uiStyle === 'dynamic' && (
                      <div className="mt-6 pt-2 shrink-0 flex justify-end">
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-8 py-3 md:px-10 md:py-4 md:text-xl font-black italic uppercase hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-[6px_6px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
                        >
                          <span className="block skew-x-[15deg]">Volver al Menú</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* PANEL DE MODO SIN INTERNET (OFFLINE) */}`
);

// Replace Offline header
code = code.replace(
  /<div className="flex items-center justify-between mb-5 border-b-2 border-white\/20 pb-4 shrink-0">\s*<h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-\[#81e6e6\] drop-shadow-md uppercase">Sin Internet \(Offline\)<\/h2>\s*<button[\s\S]*?<\/button>\s*<\/div>/,
  `<div className="mb-6 border-b-2 border-white/20 pb-4 shrink-0 mt-4 md:mt-0">
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Modo Offline</h2>
                      </div>`
);

// Append Offline Volver to the bottom of the panel
code = code.replace(
  /(\s*)<\/div>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*\);\s*}/,
  `$1</div>
                    {uiStyle === 'dynamic' && (
                      <div className="mt-6 pt-2 shrink-0 flex justify-end">
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-8 py-3 md:px-10 md:py-4 md:text-xl font-black italic uppercase hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-[6px_6px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
                        >
                          <span className="block skew-x-[15deg]">Volver al Menú</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}`
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Restructured layout");
