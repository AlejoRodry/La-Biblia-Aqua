const fs = require('fs');
let code = fs.readFileSync('src/components/PersonaBibleMenu.tsx', 'utf8');

// Remove remaining underwater-float from small elements in PersonaBibleMenu to fix the "floating bits" issue,
// and instead, we can apply one single gentle float to the whole container if desired, but for now just removing them is safer to stop the bug.
code = code.replace(/underwater-float-delayed/g, '');
code = code.replace(/underwater-float-slow/g, '');
code = code.replace(/underwater-float-sway/g, '');
code = code.replace(/underwater-float/g, '');

fs.writeFileSync('src/components/PersonaBibleMenu.tsx', code);
console.log("Cleaned all float classes from PersonaBibleMenu.");
