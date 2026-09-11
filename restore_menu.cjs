const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Restore motion.div skewX
code = code.replace(/skewX: 0/g, "skewX: uiStyle === 'dynamic' ? -15 : 0");

// Restore motion.div classNames to have bg and border
code = code.replace(
  /className=\{`absolute flex flex-col \$\{uiStyle === 'dynamic' \? 'top-1\/2 -translate-y-1\/2 right-\[-2%\] md:right-\[2%\] w-\[95vw\] md:w-\[600px\] lg:w-\[750px\] max-h-\[95vh\] p-8 md:p-10' : 'top-\[110px\] md:top-\[130px\] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'\}`\}/g,
  "className={`absolute flex flex-col ${uiStyle === 'dynamic' ? 'top-1/2 -translate-y-1/2 right-[2%] w-[95vw] md:w-[600px] lg:w-[750px] max-h-[95vh] p-8 md:p-12 bg-[#111] border-l-[12px] border-[#81e6e6] shadow-[15px_15px_0_rgba(0,0,0,0.7)]' : 'top-[110px] md:top-[130px] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'}`}"
);

// Remove the absolute backgrounds
code = code.replace(/\{uiStyle === 'dynamic' && \(\s*<div className="absolute inset-0 -z-10 bg-\[#111\] border-l-\[12px\] border-\[#81e6e6\] shadow-\[15px_15px_0_rgba\(0,0,0,0\.7\)\] transform -skew-x-\[15deg\]"><\/div>\s*\)\}\s*/g, '');

// Remove transform -skew-x-[15deg] from rows
code = code.replace(/ transform -skew-x-\[15deg\]/g, '');

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Menu restored");
