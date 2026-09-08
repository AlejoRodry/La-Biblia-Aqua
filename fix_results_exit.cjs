const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /exit=\{deepTransitionsEnabled \? \{ opacity: 0, y: '50vh', filter: 'blur\(20px\)' \} : \{ opacity: 0, y: 20 \}\}/,
  "exit={deepTransitionsEnabled ? { opacity: 0, y: '50vh', filter: 'blur(20px)', position: 'absolute', top: '6rem', left: 0, right: 0 } : { opacity: 0, y: 20, position: 'absolute', top: '6rem', left: 0, right: 0 }}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed results exit");
