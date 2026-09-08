const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Title (Bottom Left)
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 1, y: '130vh', x: '-15vw', rotate: -8, filter: 'blur\(0px\)', transition: \{ duration: 5\.5, ease: 'linear' \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '150vh', x: '-60vw', rotate: -25, filter: 'blur(30px)', transition: { duration: 6.0, ease: 'linear' } } : { opacity: 0 }"
);

// Search Bar (Bottom Right)
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 1, y: '140vh', x: '10vw', rotate: 4, filter: 'blur\(0px\)', transition: \{ duration: 6\.0, ease: 'linear' \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '150vh', x: '60vw', rotate: 20, filter: 'blur(25px)', transition: { duration: 6.5, ease: 'linear' } } : { opacity: 0 }"
);

// Verse of the Day (Bottom Left)
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 1, y: '150vh', x: '-8vw', rotate: -6, filter: 'blur\(0px\)', transition: \{ duration: 6\.5, ease: 'linear' \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '160vh', x: '-70vw', rotate: -15, filter: 'blur(35px)', transition: { duration: 7.0, ease: 'linear' } } : { opacity: 0 }"
);

// History (Bottom Left corner)
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 1, y: '160vh', x: '-5vw', rotate: -12, filter: 'blur\(0px\)', transition: \{ duration: 7\.0, ease: 'linear' \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '160vh', x: '-50vw', rotate: -30, filter: 'blur(20px)', transition: { duration: 7.5, ease: 'linear' } } : { opacity: 0 }"
);

// Recommendations (Bottom Right corner)
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 1, y: '145vh', x: '15vw', rotate: 10, filter: 'blur\(0px\)', transition: \{ duration: 5\.8, ease: 'linear' \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '160vh', x: '70vw', rotate: 35, filter: 'blur(25px)', transition: { duration: 6.2, ease: 'linear' } } : { opacity: 0 }"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated elements to fall into corners with blur");
