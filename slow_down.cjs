const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Slow down individual items in home-view exit
code = code.replace(/transition: \{ duration: 0\.7 \} \}/g, 'transition: { duration: 1.8, ease: "easeIn" } }');
code = code.replace(/transition: \{ duration: 0\.6 \} \}/g, 'transition: { duration: 1.5, ease: "easeIn" } }');
code = code.replace(/transition: \{ duration: 0\.5 \} \}/g, 'transition: { duration: 1.2, ease: "easeIn" } }');

// Slow down the appearance of the new results view to match the deeper feel
code = code.replace(/transition=\{\{ duration: deepTransitionsEnabled \? 0\.6 : 0\.3, ease: \[0\.22, 1, 0\.36, 1\] \}\}/g, 'transition={{ duration: deepTransitionsEnabled ? 1.2 : 0.3, ease: [0.22, 1, 0.36, 1] }}');

// Increase stagger in parent container
code = code.replace(/staggerChildren: 0\.1,/g, 'staggerChildren: 0.15,');

fs.writeFileSync('src/App.tsx', code);
console.log("Slowed down transitions");
