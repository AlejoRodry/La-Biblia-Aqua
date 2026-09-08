const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The user mentioned "esos si los elementos deben ser pequeños y salir de arriba de la pantalla para caer luego en la pantalla principal."
// This means the entry animation (which I already made start from -100vh with scale 0.4) is correct and they want to KEEP it.

fs.writeFileSync('src/App.tsx', code);
console.log("Confirmed entry animation");
