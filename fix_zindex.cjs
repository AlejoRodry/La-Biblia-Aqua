const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure home-view exit stays in background
code = code.replace(
  /exit: \{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transition:/,
  "exit: { position: 'absolute', zIndex: 0, top: 0, left: 0, right: 0, bottom: 0, transition:"
);

// Ensure results-view enters in foreground
code = code.replace(
  /className="w-full max-w-4xl flex flex-col items-center justify-start space-y-6 pt-24 sm:pt-28 pb-12 min-h-\[100svh\]"/,
  'className="w-full max-w-4xl flex flex-col items-center justify-start space-y-6 pt-24 sm:pt-28 pb-12 min-h-[100svh] relative z-10"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("z-index fixed");
