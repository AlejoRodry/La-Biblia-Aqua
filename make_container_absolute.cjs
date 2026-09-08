const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need the `home-view` itself to be absolute when exiting, otherwise it takes up space and pushes `results-view` down until the animation finishes.
// Or we need `mode="wait"`. But we want them in parallel.
// So `home-view` container MUST be absolute on exit, BUT its children MUST NOT be absolute (which we fixed previously).

code = code.replace(
  /exit: \{ position: 'absolute', zIndex: 0, top: 0, left: 0, right: 0, bottom: 0, transition: \{ staggerChildren: 0\.15, staggerDirection: -1, delayChildren: 0 \} \}/,
  "exit: { position: 'absolute', zIndex: 0, top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', transition: { staggerChildren: 0.1, staggerDirection: -1, delayChildren: 0 } }"
);

// We should also make sure the `results-view` does NOT have an absolute start if it's supposed to take over the document flow.
// Wait, if home-view becomes absolute, results-view will automatically jump to top: 0 and be the new document flow.
// Let's check results-view exit.
code = code.replace(
  /exit=\{deepTransitionsEnabled \? \{ opacity: 0, y: '50vh', filter: 'blur\(20px\)', position: 'absolute', top: 0, left: 0, right: 0 \} : \{ opacity: 0, y: 20, position: 'absolute', top: 0, left: 0, right: 0 \}\}/,
  "exit={deepTransitionsEnabled ? { opacity: 0, y: '50vh', filter: 'blur(20px)', position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' } : { opacity: 0, y: 20, position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' }}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Made container absolute on exit and pointerEvents none");
