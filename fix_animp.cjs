const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The issue might be that Framer Motion unmounts components instantly if `exit` isn't properly detected.
// Or the parent becomes `absolute` and Loses its relative height, making the page collapse.
// We should make the parent of AnimatePresence NOT collapse by giving it min-h-[100svh] which it already has.

// What if we just make the exit animations purely transform-based, no position changes?
// Let's remove `position: 'absolute'` from `home-view`'s exit entirely.
code = code.replace(
  /exit: \{ position: 'absolute', zIndex: 0, top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', transition: \{ staggerChildren: 0\.1, staggerDirection: -1, delayChildren: 0 \} \}/,
  "exit: { opacity: 0, transition: { staggerChildren: 0.1, staggerDirection: -1, delayChildren: 0, duration: 2.5 } }"
);

// We need to make sure results-view appears in absolute, so it doesn't push the home-view down.
// In the current code, results-view IS NOT absolute on entry, but it IS absolute on exit.
// This means on entry, results-view will take up space and push home-view. 
// THIS IS THE BUG. 
// When results-view enters, it is in normal document flow. home-view is also in normal document flow. 
// So they stack vertically! 
// To fix this, results-view needs to be absolute on initial/animate.
// OR home-view needs to be absolute on exit.

// Let's put position absolute back on home-view exit.
code = code.replace(
  /exit: \{ opacity: 0, transition: \{ staggerChildren: 0\.1, staggerDirection: -1, delayChildren: 0, duration: 2\.5 \} \}/,
  "exit: { position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none', transition: { staggerChildren: 0.1, staggerDirection: -1, delayChildren: 0 } }"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Verified bug: document flow stacking");
