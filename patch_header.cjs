const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

code = code.replace(
  '<div className="absolute top-8 left-6 md:top-12 md:left-12 hidden md:block">',
  `<div className="absolute top-6 left-6 md:top-12 md:left-12 z-50 pointer-events-auto">
                  {screen !== 'main' && (
                    <button
                      onClick={() => setScreen('main')}
                      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-2 text-sm uppercase tracking-widest font-medium"
                    >
                      <span>← VOLVER</span>
                    </button>
                  )}`
);

// We should also remove the pointer-events-none from the parent motion.div because it prevents clicking the back button
code = code.replace(
  'className="absolute inset-0 z-10 bg-black/40 backdrop-blur-xl pointer-events-none"',
  'className="absolute inset-0 z-10 bg-black/40 backdrop-blur-xl pointer-events-auto"'
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched header!");
