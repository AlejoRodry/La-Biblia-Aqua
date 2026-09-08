const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove mode="wait"
code = code.replace(/<AnimatePresence mode="wait">/, '<AnimatePresence>');

// 2. Add position: absolute to exit animations for home view elements so they overlap with the results view
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '60vh', filter: 'blur\(25px\)', transition: \{ duration: 0\.7 \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '60vh', filter: 'blur(25px)', position: 'absolute', top: 0, left: 0, right: 0, transition: { duration: 0.7 } } : { opacity: 0, position: 'absolute' }"
);

code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '45vh', filter: 'blur\(15px\)', transition: \{ duration: 0\.6 \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '45vh', filter: 'blur(15px)', position: 'absolute', top: '150px', left: 0, right: 0, transition: { duration: 0.6 } } : { opacity: 0, position: 'absolute' }"
);

code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '30vh', filter: 'blur\(10px\)', transition: \{ duration: 0\.5 \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '30vh', filter: 'blur(10px)', position: 'absolute', top: '350px', left: 0, right: 0, transition: { duration: 0.5 } } : { opacity: 0, position: 'absolute' }"
);

// We need to also make sure the container for `key="home-view"` is properly absolute when exiting, 
// OR just make the `home-view` container itself absolute on exit.
// Currently the container exit is: exit={{ opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, duration: deepTransitionsEnabled ? 0.8 : 0.3 } }}
// Let's modify the `home-view` container's exit to be absolute so we don't have to fiddle with child tops if we do it right, but child tops are already set.
// Better yet, just make the home-view container absolute on exit.

code = code.replace(
  /exit: \{ opacity: 0, transition: \{ staggerChildren: 0\.05, staggerDirection: -1, duration: deepTransitionsEnabled \? 0\.8 : 0\.3 \} \}/,
  "exit: { opacity: 0, position: 'absolute', top: '6rem', left: 0, right: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, duration: deepTransitionsEnabled ? 0.8 : 0.3 } }"
);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx fixed");
