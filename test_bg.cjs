const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Replace the animation props to remove skewX
code = code.replace(/skewX: uiStyle === 'dynamic' \? -15 : 0/g, 'skewX: 0');

// Replace the classNames of the motion.divs to remove bg and border from the main container in dynamic mode
code = code.replace(
  /w-\[95vw\] md:w-\[600px\] lg:w-\[750px\] max-h-\[95vh\] p-8 md:p-10 bg-\[#111\] border-l-\[12px\] border-\[#81e6e6\] shadow-\[15px_15px_0_rgba\(0,0,0,0\.7\)\]/g,
  'w-[95vw] md:w-[600px] lg:w-[750px] max-h-[95vh] p-8 md:p-10'
);

// Inject the absolute background inside the motion.div
code = code.replace(
  /<div className="flex flex-col h-full">/g,
  `{uiStyle === 'dynamic' && (
    <div className="absolute inset-0 -z-10 bg-[#111] border-l-[12px] border-[#81e6e6] shadow-[15px_15px_0_rgba(0,0,0,0.7)] transform -skew-x-[15deg]"></div>
  )}
  <div className="flex flex-col h-full relative z-10">`
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Background applied");
