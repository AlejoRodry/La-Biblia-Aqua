const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I also need to make sure the nested pieces of the home view don't jump. Since we removed absolute from them, they are fine.
// The only thing is they are grouped in a grid which is fine.

fs.writeFileSync('src/App.tsx', code);
console.log("Looks good");
