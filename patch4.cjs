const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the home-view motion.div to not fall down globally
code = code.replace(
  /<motion\.div \s*key="home-view"[\s\S]*?className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto"\s*>/m,
  `<motion.div 
                key="home-view"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
                  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, duration: deepTransitionsEnabled ? 0.8 : 0.3 } }
                }}
                className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto"
              >`
);

// We need to wrap the internal elements with motion.divs that have exit variants.
// Or just add variants to existing divs.
