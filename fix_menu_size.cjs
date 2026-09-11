const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// For Typography and Visual panels (currently w-[90vw] md:w-[450px])
code = code.replace(
  /right-\[5%\] md:right-\[10%\] w-\[90vw\] md:w-\[450px\] max-h-\[90vh\] p-6/g,
  "right-[-2%] md:right-[2%] w-[95vw] md:w-[600px] lg:w-[750px] max-h-[95vh] p-8 md:p-10"
);

// For Offline panel (currently w-[92vw] md:w-[480px])
code = code.replace(
  /right-\[5%\] md:right-\[10%\] w-\[92vw\] md:w-\[480px\] max-h-\[90vh\] p-6/g,
  "right-[-2%] md:right-[2%] w-[95vw] md:w-[600px] lg:w-[750px] max-h-[95vh] p-8 md:p-10"
);

// We should also increase the padding on the inner container if needed, but p-8 md:p-10 on the wrapper is good.

// To make it look proportional, we might want to increase the font sizes of the options slightly?
// The labels are `text-sm`, we can make them `text-base md:text-lg`.
// Wait, the user just said "aprovechar más el espacio". Let's see if increasing the panel size and padding is enough.

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Size patched");
