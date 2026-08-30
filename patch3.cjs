const fs = require('fs');
let code = fs.readFileSync('src/components/PersonaBibleMenu.tsx', 'utf8');

// 1. Remove the "CAPÍTULOS" banner from the left side
const capitulosBannerRegex = /\s*\{\/\* "SCREENSHOT" Banner -> "CAPÍTULOS" \(Moved to left\) \*\/\}.*?<\/div>\s*<\/div>/s;
code = code.replace(capitulosBannerRegex, '');

// 2. Replace the plain search bar with the stylized banner search bar
const oldSearchRegex = /\s*\{\/\* Search \*\/\}\s*<div className="relative mb-4">\s*<Search size=\{18\}.*?<\/div>/s;

const newSearchBar = `
            {/* Styled Search Bar (Replacing plain search & old capitulos banner) */}
            <div className="relative mb-4 w-full h-14 lg:h-16 shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex-shrink-0 cursor-text group" onClick={() => document.getElementById('search-input')?.focus()}>
               {/* Base Red Layer (Left side) */}
               <div className="absolute inset-0 bg-[#8b1a1a] transition-colors group-focus-within:bg-[#ff0066]" />
               
               {/* Left Icons */}
               <div className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none">
                  <Search className="text-[#ffea29] w-6 h-6 lg:w-7 lg:h-7" />
               </div>

               {/* Right Dark Layer */}
               <div 
                  className="absolute right-0 top-0 bottom-0 w-[82%] bg-[#2a2a2a] z-20 flex flex-col justify-center pl-8 lg:pl-10 pr-4 lg:pr-5 transition-colors group-focus-within:bg-[#111]"
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
               >
                  <input
                    id="search-input"
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="BUSCAR LIBRO..."
                    className="w-full bg-transparent text-white font-black italic tracking-wide text-lg lg:text-xl placeholder-white/40 focus:outline-none"
                    style={{ transform: 'skewX(-5deg)' }}
                  />
               </div>
               
               {searchFilter && (
                <button onClick={(e) => { e.stopPropagation(); setSearchFilter(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-[#ff0066] transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>`;

code = code.replace(oldSearchRegex, newSearchBar);

fs.writeFileSync('src/components/PersonaBibleMenu.tsx', code);
