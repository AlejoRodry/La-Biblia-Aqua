const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I need to ensure the children don't have position: absolute in their exit variants
const variantsToFix = [
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '40vh', x: '-15vw', rotate: -8, scale: 0\.8, filter: 'blur\(20px\)', transition:/,
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '60vh', x: '10vw', rotate: 4, scale: 0\.9, filter: 'blur\(15px\)', transition:/,
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '70vh', x: '-8vw', rotate: -6, filter: 'blur\(12px\)', transition:/,
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '80vh', x: '-5vw', rotate: -12, scale: 0\.9, filter: 'blur\(18px\)', transition:/,
  /exit: deepTransitionsEnabled \? \{ opacity: 0, y: '65vh', x: '15vw', rotate: 10, scale: 0\.85, filter: 'blur\(14px\)', transition:/
];

let allFound = true;
variantsToFix.forEach(regex => {
  if (!code.match(regex)) {
    allFound = false;
    console.log("Missing regex:", regex);
  }
});

if (allFound) {
    console.log("All variants are correct, no absolute in children exit.");
}
