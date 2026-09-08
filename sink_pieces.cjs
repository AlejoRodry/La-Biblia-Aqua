const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Header Title: Drift up slightly then sink left
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '60vh', filter: 'blur\(25px\)', position: 'absolute', top: 0, left: 0, right: 0, transition: \{ duration: 1\.8, ease: "easeIn" \} \} : \{ opacity: 0, position: 'absolute' \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '40vh', x: '-15vw', rotate: -8, scale: 0.8, filter: 'blur(20px)', position: 'absolute', top: 0, left: 0, right: 0, transition: { duration: 2.2, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0, position: 'absolute' }"
);

// 2. Search Bar: Drift right and sink
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '45vh', filter: 'blur\(15px\)', position: 'absolute', top: '150px', left: 0, right: 0, transition: \{ duration: 1\.5, ease: "easeIn" \} \} : \{ opacity: 0, position: 'absolute' \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '60vh', x: '10vw', rotate: 4, scale: 0.9, filter: 'blur(15px)', position: 'absolute', top: '150px', left: 0, right: 0, transition: { duration: 2.5, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0, position: 'absolute' }"
);

// 3. To break apart the History & Recommendations, let's first remove the variants from its parent motion.div 
// and make the parent a regular div.
code = code.replace(
  /<motion\.div \s*variants=\{\{\s*initial: \{ opacity: 0, y: 30 \},\s*animate: \{ opacity: 1, y: 0, filter: 'blur\(0px\)' \},\s*exit: deepTransitionsEnabled \? \{ opacity: 0, y: '30vh', filter: 'blur\(10px\)', position: 'absolute', top: '350px', left: 0, right: 0, transition: \{ duration: 1\.2, ease: "easeIn" \} \} : \{ opacity: 0, position: 'absolute' \}\s*\}\}\s*className="w-full max-w-3xl mt-8 mb-8 flex flex-col gap-6"\s*>/m,
  '<div className="w-full max-w-3xl mt-8 mb-8 flex flex-col gap-6 relative" style={!result && deepTransitionsEnabled ? { height: "500px" } : {}}>'
);

code = code.replace(
  /<\/div>\s*<\/motion\.div>\s*<\/motion\.div>\s*\) : \(/,
  '</div>\n                </div>\n              </motion.div>\n            ) : ('
);

// 4. Now convert Verse of the Day, History, and Recommendations to motion.divs with their own initial/animate/exit.
// Verse of the Day
code = code.replace(
  /<div \s*onClick=\{\(\) => handleSearch\(undefined, verseOfTheDay\.ref\)\}\s*className="group cursor-pointer bg-gradient-to-br/,
  `<motion.div
                    variants={{
                      initial: { opacity: 0, y: 30 },
                      animate: { opacity: 1, y: 0 },
                      exit: deepTransitionsEnabled ? { opacity: 0, y: '70vh', x: '-8vw', rotate: -6, filter: 'blur(12px)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, transition: { duration: 2.8, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }
                    }}
                    onClick={() => handleSearch(undefined, verseOfTheDay.ref)}
                    className="group cursor-pointer bg-gradient-to-br`
);

// Close Verse of the Day tag
code = code.replace(
  /<\/div>\s*<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">/,
  `</motion.div>\n\n                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative" style={!result && deepTransitionsEnabled ? { position: 'absolute', top: '160px', left: 0, right: 0 } : {}}>`
);

// History
code = code.replace(
  /<div className="bg-black\/20 backdrop-blur-md border border-white\/20 rounded-2xl p-6 shadow-\[0_8px_32px_rgba\(0,0,0,0\.3\)\] underwater-float-delayed">/,
  `<motion.div variants={{
                      initial: { opacity: 0, y: 30 },
                      animate: { opacity: 1, y: 0 },
                      exit: deepTransitionsEnabled ? { opacity: 0, y: '80vh', x: '-5vw', rotate: -12, scale: 0.9, filter: 'blur(18px)', position: 'absolute', top: 0, left: 0, width: 'calc(50% - 12px)', transition: { duration: 3.2, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }
                    }} className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] underwater-float-delayed">`
);

// Close History tag (the one right before Recommendations)
code = code.replace(
  /<\/div>\s*\{\/\* Recommendations \*\/\}/,
  `</motion.div>\n\n                    {/* Recommendations */}`
);

// Recommendations
code = code.replace(
  /<div className="bg-black\/20 backdrop-blur-md border border-white\/20 rounded-2xl p-6 shadow-\[0_8px_32px_rgba\(0,0,0,0\.3\)\] underwater-float">/,
  `<motion.div variants={{
                      initial: { opacity: 0, y: 30 },
                      animate: { opacity: 1, y: 0 },
                      exit: deepTransitionsEnabled ? { opacity: 0, y: '65vh', x: '15vw', rotate: 10, scale: 0.85, filter: 'blur(14px)', position: 'absolute', top: 0, right: 0, width: 'calc(50% - 12px)', transition: { duration: 2.9, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }
                    }} className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] underwater-float">`
);

// Close Recommendations tag (it's the last child in the grid)
code = code.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/motion\.div>\s*\) : \(/,
  `</motion.div>\n                  </div>\n                </div>\n              </motion.div>\n            ) : (`
);


fs.writeFileSync('src/App.tsx', code);
console.log("Made elements drift apart");
