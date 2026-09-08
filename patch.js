const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the main wrapper div and motion.div structure
code = code.replace(
  /<div className={`flex flex-col min-h-\[100svh\] items-center px-3\.5 sm:px-6 md:px-12 \$\{!\w+ \? 'justify-center py-12' : 'justify-start pt-24 sm:pt-28 pb-12'\}s*`}>[\s\S]*?(?={<PersonaBibleMenu)/m,
  function(match) {
    console.log("Found match!");
    return "MATCHED";
  }
);
