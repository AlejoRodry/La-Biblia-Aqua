const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// The block to replace:
const oldHeaderRegex = /<div className="absolute top-8 left-8 md:top-14 md:left-14 z-50 pointer-events-auto flex flex-col gap-4">[\s\S]*?<div className="w-16 h-1 bg-white\/30 rounded-full ml-1 md:ml-3"><\/div>\s*<\/div>/;

const newHeader = `<div className="absolute top-6 left-6 md:top-8 md:left-8 z-50 pointer-events-auto flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl md:text-5xl font-light text-white/90 tracking-widest uppercase drop-shadow-md">
                      {screen === 'main' ? 'Ajustes' : screen === 'typography' ? 'Tipografía' : 'Efectos'}
                    </h2>
                  </div>
                  <div className="w-16 h-1 bg-white/30 rounded-full ml-1 md:ml-3"></div>
                </div>`;

code = code.replace(oldHeaderRegex, newHeader);

// I also need to make sure the content isn't placed too low or causing a cut.
// If the content top was top-[120px] and md:top-[140px], now the title is higher (top-6/8), maybe we can make the content start slightly higher, e.g. top-[100px] or top-[110px], and make sure it has no abrupt cut.
code = code.replace(
  /'top-\[120px\] md:top-\[140px\] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'/g,
  "'top-[110px] md:top-[130px] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'"
);

fs.writeFileSync('src/components/SystemMenu.tsx', code);
console.log("Patched SystemMenu header!");
