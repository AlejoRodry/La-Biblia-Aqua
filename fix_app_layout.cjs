const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The main wrapper is:
// <div className={`flex flex-col min-h-[100svh] items-center px-3.5 sm:px-6 md:px-12 relative overflow-hidden ${!result ? 'justify-center py-12' : 'justify-start pt-24 sm:pt-28 pb-12'}`}>
// We should change it to just a container that holds both, and let the inner divs handle their own padding.

code = code.replace(
  /<div className=\{`flex flex-col min-h-\[100svh\] items-center px-3\.5 sm:px-6 md:px-12 relative overflow-hidden \$\{\!result \? 'justify-center py-12' : 'justify-start pt-24 sm:pt-28 pb-12'\}\`\}>/,
  `<div className="flex flex-col min-h-[100svh] items-center px-3.5 sm:px-6 md:px-12 relative overflow-hidden">`
);

// We need to add the padding/justify to the home-view and results-view individually.
code = code.replace(
  /className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto"/,
  `className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto min-h-[80svh] py-12"`
);

// We need to modify the home-view exit so it doesn't jump. If we use position: absolute, we can just use top: 0, left: 0, right: 0, bottom: 0, or just width/height full.
code = code.replace(
  /exit: \{ opacity: 0, position: 'absolute', top: '6rem', left: 0, right: 0, transition: \{ staggerChildren: 0\.05, staggerDirection: -1, duration: deepTransitionsEnabled \? 0\.8 : 0\.3 \} \}/,
  `exit: { opacity: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, duration: deepTransitionsEnabled ? 0.8 : 0.3 } }`
);

// Also the results-view needs padding.
code = code.replace(
  /className="w-full max-w-4xl flex flex-col items-center justify-start space-y-6"/,
  `className="w-full max-w-4xl flex flex-col items-center justify-start space-y-6 pt-24 sm:pt-28 pb-12 min-h-[100svh]"`
);

// Fix results exit absolute positioning
code = code.replace(
  /exit=\{deepTransitionsEnabled \? \{ opacity: 0, y: '50vh', filter: 'blur\(20px\)', position: 'absolute', top: '6rem', left: 0, right: 0 \} : \{ opacity: 0, y: 20, position: 'absolute', top: '6rem', left: 0, right: 0 \}\}/,
  "exit={deepTransitionsEnabled ? { opacity: 0, y: '50vh', filter: 'blur(20px)', position: 'absolute', top: 0, left: 0, right: 0 } : { opacity: 0, y: 20, position: 'absolute', top: 0, left: 0, right: 0 }}"
);


fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx layout fixed");
