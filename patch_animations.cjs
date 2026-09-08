const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Container variants (staggering the entry so they fall one by one)
code = code.replace(
  /variants=\{\{\s*initial: \{ opacity: 0 \},\s*animate: \{ opacity: 1, transition: \{ staggerChildren: 0\.1 \} \},\s*exit: \{ pointerEvents: 'none', transition: \{ staggerChildren: 0\.1, staggerDirection: -1, delayChildren: 0 \} \}\s*\}\}/,
  `variants={{
                  initial: { opacity: 1 },
                  animate: { opacity: 1, transition: { staggerChildren: 0.15 } },
                  exit: { pointerEvents: 'none', transition: { staggerChildren: 0.1, staggerDirection: -1, delayChildren: 0 } }
                }}`
);

// Title
code = code.replace(
  /variants=\{\{\s*initial: \{ opacity: 0, y: -20 \},\s*animate: \{ opacity: 1, y: 0, filter: 'blur\(0px\)' \},\s*exit: deepTransitionsEnabled \? \{ opacity: 1, y: '130vh', x: '-15vw', rotate: -8, filter: 'blur\(20px\)', transition: \{ duration: 2\.2, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}\s*\}\}/,
  `variants={{
                    initial: deepTransitionsEnabled ? { opacity: 1, y: '-100vh', scale: 0.4 } : { opacity: 0, y: -20 },
                    animate: deepTransitionsEnabled ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.5, type: 'spring', bounce: 0.3 } } : { opacity: 1, y: 0, filter: 'blur(0px)' },
                    exit: deepTransitionsEnabled ? { opacity: 1, y: '130vh', x: '-15vw', rotate: -8, filter: 'blur(0px)', transition: { duration: 5.5, ease: 'linear' } } : { opacity: 0 }
                  }}`
);

// Search Bar
code = code.replace(
  /variants=\{\{\s*initial: \{ opacity: 0, y: 20 \},\s*animate: \{ opacity: 1, y: 0, filter: 'blur\(0px\)' \},\s*exit: deepTransitionsEnabled \? \{ opacity: 1, y: '140vh', x: '10vw', rotate: 4, filter: 'blur\(15px\)', transition: \{ duration: 2\.5, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}\s*\}\}/,
  `variants={{
                    initial: deepTransitionsEnabled ? { opacity: 1, y: '-100vh', scale: 0.4 } : { opacity: 0, y: 20 },
                    animate: deepTransitionsEnabled ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.5, type: 'spring', bounce: 0.3 } } : { opacity: 1, y: 0, filter: 'blur(0px)' },
                    exit: deepTransitionsEnabled ? { opacity: 1, y: '140vh', x: '10vw', rotate: 4, filter: 'blur(0px)', transition: { duration: 6.0, ease: 'linear' } } : { opacity: 0 }
                  }}`
);

// Verse of the Day
code = code.replace(
  /variants=\{\{\s*initial: \{ opacity: 0, y: 30 \},\s*animate: \{ opacity: 1, y: 0 \},\s*exit: deepTransitionsEnabled \? \{ opacity: 1, y: '150vh', x: '-8vw', rotate: -6, filter: 'blur\(12px\)', transition: \{ duration: 2\.8, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}\s*\}\}/,
  `variants={{
                      initial: deepTransitionsEnabled ? { opacity: 1, y: '-100vh', scale: 0.4 } : { opacity: 0, y: 30 },
                      animate: deepTransitionsEnabled ? { opacity: 1, y: 0, scale: 1, transition: { duration: 1.5, type: 'spring', bounce: 0.3 } } : { opacity: 1, y: 0 },
                      exit: deepTransitionsEnabled ? { opacity: 1, y: '150vh', x: '-8vw', rotate: -6, filter: 'blur(0px)', transition: { duration: 6.5, ease: 'linear' } } : { opacity: 0 }
                    }}`
);

// History
code = code.replace(
  /variants=\{\{\s*initial: \{ opacity: 0, y: 30 \},\s*animate: \{ opacity: 1, y: 0 \},\s*exit: deepTransitionsEnabled \? \{ opacity: 1, y: '160vh', x: '-5vw', rotate: -12, filter: 'blur\(18px\)', transition: \{ duration: 3\.2, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}\s*\}\}/,
  `variants={{
                      initial: deepTransitionsEnabled ? { opacity: 1, y: '-100vh', scale: 0.4 } : { opacity: 0, y: 30 },
                      animate: deepTransitionsEnabled ? { opacity: 1, y: 0, scale: 1, transition: { duration: 1.5, type: 'spring', bounce: 0.3 } } : { opacity: 1, y: 0 },
                      exit: deepTransitionsEnabled ? { opacity: 1, y: '160vh', x: '-5vw', rotate: -12, filter: 'blur(0px)', transition: { duration: 7.0, ease: 'linear' } } : { opacity: 0 }
                    }}`
);

// Recommendations
code = code.replace(
  /variants=\{\{\s*initial: \{ opacity: 0, y: 30 \},\s*animate: \{ opacity: 1, y: 0 \},\s*exit: deepTransitionsEnabled \? \{ opacity: 1, y: '145vh', x: '15vw', rotate: 10, filter: 'blur\(14px\)', transition: \{ duration: 2\.9, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}\s*\}\}/,
  `variants={{
                      initial: deepTransitionsEnabled ? { opacity: 1, y: '-100vh', scale: 0.4 } : { opacity: 0, y: 30 },
                      animate: deepTransitionsEnabled ? { opacity: 1, y: 0, scale: 1, transition: { duration: 1.5, type: 'spring', bounce: 0.3 } } : { opacity: 1, y: 0 },
                      exit: deepTransitionsEnabled ? { opacity: 1, y: '145vh', x: '15vw', rotate: 10, filter: 'blur(0px)', transition: { duration: 5.8, ease: 'linear' } } : { opacity: 0 }
                    }}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx with new initial and exit variants");
