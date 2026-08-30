const fs = require('fs');
let code = fs.readFileSync('src/components/PersonaBibleMenu.tsx', 'utf8');

// I will extract the sections and piece them together.
const importsAndStart = code.substring(0, code.indexOf('{/* 2. Top Left Header'));

const middlePart = `        {/* 2. Top Left Header (Smaller) */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 z-20 pointer-events-none">
          <div className="relative">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-white drop-shadow-md mb-0 leading-none uppercase">
              {selectedBook.name}
            </h1>
            <div className="text-white/80 font-black italic tracking-[0.4em] text-xs md:text-sm ml-1 mt-1">
              {isSelectedOT ? 'ANTIGUO T.' : 'NUEVO T.'}
            </div>

            {/* "SCREENSHOT" Banner -> "CAPÍTULOS" (Moved to left) */}
            <div className="relative mt-6 ml-1 w-[280px] lg:w-[320px] h-14 lg:h-16 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
               {/* Base Red Layer (Left side) */}
               <div className="absolute inset-0 bg-[#8b1a1a]" />
               
               {/* Left Icons (Sun & Moon) */}
               <div className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 flex items-center z-10">
                  <Sun fill="#ffea29" className="text-[#ffea29] w-6 h-6 lg:w-8 lg:h-8" />
                  <Moon fill="rgba(255,255,255,0.2)" strokeWidth={1} className="text-transparent w-6 h-6 lg:w-8 lg:h-8 -ml-2.5" />
               </div>

               {/* Right Dark Layer */}
               <div 
                  className="absolute right-0 top-0 bottom-0 w-[75%] bg-[#2a2a2a] z-20 flex flex-col items-end justify-center pr-4 lg:pr-5"
                  style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
               >
                  <span className="text-white font-black italic tracking-wide text-xl lg:text-2xl leading-none" style={{ transform: 'scaleY(1.1) skewX(-5deg)', transformOrigin: 'bottom' }}>
                    CAPÍTULOS
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                     <span className="bg-white text-black text-[9px] lg:text-[10px] font-black px-1.5 py-0.5 leading-none uppercase">
                       Total
                     </span>
                     <span className="text-white font-bold text-xs lg:text-sm leading-none">
                       {selectedBook.chapters}
                     </span>
                  </div>
               </div>
            </div>
            
            {/* Giant Number Positioned Top-Middle like P3 */}
            <div className="fixed top-[5%] md:top-[-5%] left-[10%] md:left-[15%] lg:left-[20%] transform text-[15rem] md:text-[30rem] lg:text-[40rem] font-black italic text-[#021157] leading-none select-none pointer-events-none -z-10 opacity-30 drop-shadow-2xl">
              {bookNumberDisplay}
            </div>
          </div>
        </div>

        {/* 3. Top Right Banners (P3 'Part-Time JOBS' style) */}
        <div className="absolute top-0 right-0 w-full max-w-[480px] lg:max-w-[580px] h-[250px] flex flex-col items-end z-20 hidden md:flex pointer-events-none overflow-hidden">
          {/* Yellow Triangle Background */}
          <div 
            className="absolute top-0 right-0 w-full h-[120%] bg-[#ffea29] shadow-2xl drop-shadow-2xl"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
          />
          
          {/* "Part-Time JOBS" -> "Menú BIBLIOTECA" */}
          <div className="relative mt-6 mr-6 flex items-baseline gap-2 text-[#0b1040]">
             <span className="font-extrabold text-lg lg:text-xl leading-none self-start mt-2">Menú</span>
             <span 
                className="font-black text-4xl lg:text-[4.5rem] tracking-tighter leading-none uppercase" 
                style={{ transform: 'scaleY(1.15)', transformOrigin: 'bottom' }}
             >
               BIBLIOTECA
             </span>
          </div>
        </div>
`;

const restOfCode = code.substring(code.indexOf('{/* 4. Close Button */}'));

fs.writeFileSync('src/components/PersonaBibleMenu.tsx', importsAndStart + middlePart + '\n' + restOfCode);
