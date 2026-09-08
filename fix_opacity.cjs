const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Title
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '40vh', x: '-15vw', rotate: -8,( {0,2})filter: 'blur\(20px\)', transition: \{ duration: 2\.2, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '130vh', x: '-15vw', rotate: -8, filter: 'blur(20px)', transition: { duration: 2.2, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// Search Bar
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '60vh', x: '10vw', rotate: 4,( {0,2})filter: 'blur\(15px\)', transition: \{ duration: 2\.5, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '140vh', x: '10vw', rotate: 4, filter: 'blur(15px)', transition: { duration: 2.5, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// Verse of the Day
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '70vh', x: '-8vw', rotate: -6,( {0,2})filter: 'blur\(12px\)', transition: \{ duration: 2\.8, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '150vh', x: '-8vw', rotate: -6, filter: 'blur(12px)', transition: { duration: 2.8, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// History
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '80vh', x: '-5vw', rotate: -12,( {0,2})filter: 'blur\(18px\)', transition: \{ duration: 3\.2, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '160vh', x: '-5vw', rotate: -12, filter: 'blur(18px)', transition: { duration: 3.2, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

// Recommendations
code = code.replace(
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '65vh', x: '15vw', rotate: 10,( {0,2})filter: 'blur\(14px\)', transition: \{ duration: 2\.9, ease: \[0\.32, 0, 0\.67, 0\] \} \} : \{ opacity: 0 \}/,
  "exit: deepTransitionsEnabled ? { opacity: 1, y: '145vh', x: '15vw', rotate: 10, filter: 'blur(14px)', transition: { duration: 2.9, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed opacity and drop height");
