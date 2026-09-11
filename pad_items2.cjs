const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

// Font cards padding
// p-3.5
code = code.replace(
  /p-3\.5/g,
  "p-5 md:p-6"
);

// Font titles
// text-[15px]
code = code.replace(
  /text-\[15px\]/g,
  "text-lg md:text-xl"
);
// text-[10px]
code = code.replace(
  /text-\[10px\] mt-0\.5/g,
  "text-xs md:text-sm mt-1"
);

// Font sizes (preview)
// text-[9px]
code = code.replace(
  /text-\[9px\] block/g,
  "text-[10px] md:text-xs block mt-1"
);
// (12) 
code = code.replace(
  /block text-lg/g,
  "block text-xl md:text-2xl"
);


fs.writeFileSync('src/components/TypographyControl.tsx', code);
