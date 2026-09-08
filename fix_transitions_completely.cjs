const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// When elements animate 'exit', framer motion applies the exit styles immediately.
// If we just want them to drift without jumping, we only animate y, x, rotate, and blur, but NO POSITION ABSOLUTE changes inside the actual animated child.
// BUT because `home-view` changes to absolute on exit, the inner content might collapse or shift if it depended on flex.
// `className="w-full max-w-2xl flex flex-col..."` is still on `home-view`. When it becomes absolute, it might lose its width if not explicitly defined.

code = code.replace(
  /className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto min-h-\[80svh\] py-12"/,
  'className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto min-h-[80svh] py-12 origin-top"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Added origin top");
