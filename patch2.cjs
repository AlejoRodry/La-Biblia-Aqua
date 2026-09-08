const fs = require('fs');
let code = fs.readFileSync('src/components/PersonaBibleMenu.tsx', 'utf8');

// Remove bookFloatClass definition
code = code.replace(/const bookFloatClass = [\s\S]*?'underwater-float-sway';\s*/, '');
// Remove bookFloatClass usage
code = code.replace(/\$\{bookFloatClass\}\s*/g, '');

// Remove chapterFloatClass definition
code = code.replace(/const chapterFloatClass = [\s\S]*?'underwater-float-sway';\s*/, '');
// Remove chapterFloatClass usage
code = code.replace(/\$\{chapterFloatClass\}/g, '');

fs.writeFileSync('src/components/PersonaBibleMenu.tsx', code);
console.log("Patched.");
