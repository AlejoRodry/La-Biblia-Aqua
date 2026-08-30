const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Update Typography Modal Width
code = code.replace(
  "className={`absolute top-1/2 -translate-y-1/2 w-[85vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[550px] bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl'}`}",
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px] bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl'}`}"
);

// Update Visual Modal Width (it replaces the second occurrence automatically if we replace globally or run it again)
code = code.replace(
  "className={`absolute top-1/2 -translate-y-1/2 w-[85vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[550px] bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl'}`}",
  "className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-h-[90vh] p-6 flex flex-col ${uiStyle === 'dynamic' ? 'right-[5%] md:right-[10%] md:w-[450px] bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'left-1/2 -translate-x-1/2 md:w-[850px] lg:w-[900px] bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl'}`}"
);

// Add layout prop to TypographyControl
code = code.replace(
  "<TypographyControl\n                        readingFontFamily={readingFontFamily}",
  "<TypographyControl\n                        layout={uiStyle === 'dynamic' ? 'vertical' : 'grid'}\n                        readingFontFamily={readingFontFamily}"
);

// Update Visual Layout to Grid
code = code.replace(
  "<div className=\"space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1\">",
  "<div className={`overflow-y-auto custom-scrollbar pr-2 flex-1 ${uiStyle === 'dynamic' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'}`}>"
);

// Remove the `pt-4 border-t-2 border-white/10` from Elementos if it's serene
code = code.replace(
  "className=\"pt-4 border-t-2 border-white/10 space-y-3\"",
  "className={`space-y-3 ${uiStyle === 'dynamic' ? 'pt-4 border-t-2 border-white/10' : ''}`}"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched system menu layout!");
