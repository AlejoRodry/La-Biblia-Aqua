const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /exit: \{ opacity: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transition: \{ staggerChildren: 0\.05, staggerDirection: -1, duration: deepTransitionsEnabled \? 0\.8 : 0\.3 \} \}/,
  "exit: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transition: { staggerChildren: 0.1, staggerDirection: -1, delayChildren: 0 } }"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed parent exit");
