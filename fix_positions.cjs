const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Header Title
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '40vh', x: '-15vw', rotate: -8, scale: 0\.8, filter: 'blur\(20px\)', position: 'absolute', top: 0, left: 0, right: 0, transition: \{ duration: 2\.2, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0, position: 'absolute' \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '40vh', x: '-15vw', rotate: -8, scale: 0.8, filter: 'blur(20px)', transition: { duration: 2.2, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// Search Bar
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '60vh', x: '10vw', rotate: 4, scale: 0\.9, filter: 'blur\(15px\)', position: 'absolute', top: '150px', left: 0, right: 0, transition: \{ duration: 2\.5, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0, position: 'absolute' \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '60vh', x: '10vw', rotate: 4, scale: 0.9, filter: 'blur(15px)', transition: { duration: 2.5, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// Verse of the Day
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '70vh', x: '-8vw', rotate: -6, filter: 'blur\(12px\)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, transition: \{ duration: 2\.8, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '70vh', x: '-8vw', rotate: -6, filter: 'blur(12px)', transition: { duration: 2.8, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// History
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '80vh', x: '-5vw', rotate: -12, scale: 0\.9, filter: 'blur\(18px\)', position: 'absolute', top: 0, left: 0, width: 'calc\(50% - 12px\)', transition: \{ duration: 3\.2, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '80vh', x: '-5vw', rotate: -12, scale: 0.9, filter: 'blur(18px)', transition: { duration: 3.2, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// Recommendations
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '65vh', x: '15vw', rotate: 10, scale: 0\.85, filter: 'blur\(14px\)', position: 'absolute', top: 0, right: 0, width: 'calc\(50% - 12px\)', transition: \{ duration: 2\.9, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 0, y: '65vh', x: '15vw', rotate: 10, scale: 0.85, filter: 'blur(14px)', transition: { duration: 2.9, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// Fix the grid inline style which was using absolute
code = code.replace(
  /<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative" style=\{!result && deepTransitionsEnabled \? \{ position: 'absolute', top: '160px', left: 0, right: 0 \} : \{\}\}>/,
  '<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">'
);

// Also the parent container inline style
code = code.replace(
  /<div className="w-full max-w-3xl mt-8 mb-8 flex flex-col gap-6 relative" style=\{!result && deepTransitionsEnabled \? \{ height: "500px" \} : \{\}\}>/,
  '<div className="w-full max-w-3xl mt-8 mb-8 flex flex-col gap-6 relative">'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed jumpy exits by removing absolute from children");
