const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The safest way to handle parallel cross-fades in CSS flex layouts without jumpiness:
// Put them in a CSS Grid where they occupy the same cell (1 / 1).
// Let's replace the AnimatePresence wrapper.

code = code.replace(
  /<div className="flex flex-col min-h-\[100svh\] items-center px-3\.5 sm:px-6 md:px-12 relative overflow-hidden">/,
  '<div className="grid grid-cols-1 grid-rows-1 min-h-[100svh] px-3.5 sm:px-6 md:px-12 relative overflow-hidden place-items-start justify-items-center">'
);

// We need to remove the absolute position from both home-view and results-view on exit, because CSS grid overlapping handles it!
// Home view:
code = code.replace(
  /exit: \{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none', transition: \{ staggerChildren: 0\.1, staggerDirection: -1, delayChildren: 0 \} \}/,
  "exit: { pointerEvents: 'none', transition: { staggerChildren: 0.1, staggerDirection: -1, delayChildren: 0 } }"
);

// Results view:
code = code.replace(
  /exit=\{deepTransitionsEnabled \? \{ opacity: 0, y: '50vh', filter: 'blur\(20px\)', position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' \} : \{ opacity: 0, y: 20, position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' \}\}/,
  "exit={deepTransitionsEnabled ? { opacity: 0, y: '50vh', filter: 'blur(20px)', pointerEvents: 'none' } : { opacity: 0, y: 20, pointerEvents: 'none' }}"
);

// Now both views need to be placed in the grid cell:
code = code.replace(
  /className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto min-h-\[80svh\] py-12 origin-top motion-container-absolute"/,
  'className="col-start-1 row-start-1 w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto min-h-[80svh] py-12 origin-top"'
);

code = code.replace(
  /className="w-full max-w-4xl flex flex-col items-center justify-start space-y-6 pt-24 sm:pt-28 pb-12 min-h-\[100svh\] relative z-10"/,
  'className="col-start-1 row-start-1 w-full max-w-4xl flex flex-col items-center justify-start space-y-6 pt-24 sm:pt-28 pb-12 min-h-[100svh] relative z-10"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Converted to CSS Grid layout for overlapping!");
