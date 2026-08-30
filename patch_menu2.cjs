const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// For serene, instead of absolute centering, let's use flex layout filling the space, or absolute positioning below the header.
code = code.replace(
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px]'}`}",
  "className={`absolute flex flex-col ${uiStyle === 'dynamic' ? 'top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] w-[90vw] md:w-[450px] max-h-[90vh] p-6 bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'top-[120px] md:top-[140px] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'}`}"
);

// Second replacement for the Visuals panel
code = code.replace(
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px]'}`}",
  "className={`absolute flex flex-col ${uiStyle === 'dynamic' ? 'top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] w-[90vw] md:w-[450px] max-h-[90vh] p-6 bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'top-[120px] md:top-[140px] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'}`}"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched positioning!");
