const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf-8');

code = code.replace(
  /'w-12 h-12 md:w-14 md:h-14 bg-\[\#111\] hover:bg-\[\#ff0066\] text-white border-2 md:border-4 border-white transform -skew-x-12 shadow-\[4px_4px_0_rgba\(0,0,0,0\.3\)\] active:translate-y-1 active:shadow-\[2px_2px_0_rgba\(0,0,0,0\.3\)\]'/g,
  "'w-12 h-12 md:w-14 md:h-14 bg-[#111] hover:bg-[#ff0066] text-white border-[4px] border-[#81e6e6] skew-x-[-15deg] shadow-[6px_6px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.8)]'"
);

code = code.replace(
  /<X size=\{28\} className=\{uiStyle === 'dynamic' \? 'skew-x-\[12deg\]' : ''\} \/>/g,
  "<X size={28} className={uiStyle === 'dynamic' ? 'skew-x-[15deg] font-black' : ''} />"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log('done');
