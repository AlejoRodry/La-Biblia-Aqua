import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Compass, Check, Sun, Moon } from 'lucide-react';

interface BookInfo {
  name: string;
  chapters: number;
}

interface PersonaBibleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  toc: BookInfo[];
  currentBookName?: string;
  onSelectChapter: (book: string, chapter: number) => void;
  uiStyle: 'serene' | 'dynamic';
  completedChapters?: Record<string, boolean>;
}

const OLD_TESTAMENT_COUNT = 39;

export default function PersonaBibleMenu({
  isOpen,
  onClose,
  toc,
  currentBookName,
  onSelectChapter,
  uiStyle,
  completedChapters = {},
}: PersonaBibleMenuProps) {
  const [selectedBookName, setSelectedBookName] = useState<string>(() => {
    return currentBookName || (toc.length > 0 ? toc[0].name : 'Génesis');
  });

  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ot' | 'nt'>('all');
  const [mobileView, setMobileView] = useState<'list' | 'calendar'>('list');

  React.useEffect(() => {
    if (toc.length > 0 && !toc.find(b => b.name === selectedBookName)) {
      setSelectedBookName(currentBookName || toc[0].name);
    }
  }, [toc, currentBookName, selectedBookName]);

  const selectedBookIndex = useMemo(() => {
    return toc.findIndex(b => b.name === selectedBookName);
  }, [toc, selectedBookName]);

  const selectedBook = useMemo(() => {
    return toc[selectedBookIndex] || toc[0] || { name: 'Génesis', chapters: 50 };
  }, [toc, selectedBookIndex]);

  const filteredBooks = useMemo(() => {
    return toc.filter((book, index) => {
      const isOT = index < OLD_TESTAMENT_COUNT;
      if (testamentFilter === 'ot' && !isOT) return false;
      if (testamentFilter === 'nt' && isOT) return false;
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase().trim();
        return book.name.toLowerCase().includes(query) || `${index + 1}` === query;
      }
      return true;
    });
  }, [toc, testamentFilter, searchFilter]);

  const handleReadChapter = (chapterNum: number) => {
    onSelectChapter(selectedBook.name, chapterNum);
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.15 }
    }
  };

  const itemLeft = {
    hidden: { opacity: 0, x: 50, skewX: -10 },
    visible: { opacity: 1, x: 0, skewX: 0, transition: { type: "spring", damping: 15, stiffness: 200 } }
  };

  const popIn = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 200 } }
  };

  const isSelectedOT = selectedBookIndex < OLD_TESTAMENT_COUNT;
  const bookNumberDisplay = selectedBookIndex >= 0 ? selectedBookIndex + 1 : 1;

  // Start chapters uniformly from the first column (no offset)
  const emptyDaysOffset = 0;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className={`fixed inset-0 z-[200] w-screen h-screen overflow-hidden font-sans text-white ${uiStyle === 'dynamic' ? 'bg-black/40 selection:bg-[#ff0066] selection:text-white' : 'bg-black/40 selection:bg-cyan-500/50 backdrop-blur-xl'}`}
        >
          {uiStyle === 'dynamic' ? (
            <>
              {/* 1. Giant White Sweep (Right side curve matching Persona 3) */}
              <motion.div 
                initial={{ scale: 0, x: "50%", opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                exit={{ scale: 0.8, x: "50%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 100 }}
                className="absolute top-1/2 left-[15vw] md:left-[50vw] lg:left-[55vw] w-[200vw] h-[200vw] md:w-[250vh] md:h-[250vh] bg-white rounded-full shadow-[-20px_0_80px_rgba(0,0,0,0.3)] z-0 pointer-events-none -translate-y-1/2" 
              />
              {/* 3. Top Right Banners (P3 'Part-Time JOBS' style) */}
              <motion.div 
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ type: "spring", damping: 15, delay: 0.15 }}
                className="absolute top-0 right-0 w-full max-w-[480px] lg:max-w-[650px] h-[250px] flex flex-col items-end z-20 hidden md:flex pointer-events-none overflow-hidden"
              >
                {/* Yellow Triangle Background */}
                <div 
                  className="absolute top-0 right-0 w-full h-[120%] bg-[#ffea29] shadow-2xl drop-shadow-2xl"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                />
                
                {/* "Part-Time JOBS" -> "Menú BIBLIOTECA" */}
                <div className="relative mt-8 mr-28 lg:mr-32 flex items-baseline gap-2 text-[#0b1040]">
                   <span className="font-extrabold text-lg lg:text-xl leading-none self-start mt-2">Menú</span>
                   <span 
                      className="font-black text-4xl lg:text-[4.5rem] tracking-tighter leading-none uppercase" 
                      style={{ transform: 'scaleY(1.15)', transformOrigin: 'bottom' }}
                   >
                     BIBLIOTECA
                   </span>
                </div>
              </motion.div>
            </>
          ) : (
             <div className="absolute top-10 right-28 lg:right-32 z-20 pointer-events-none hidden md:block">
               <h2 className="text-4xl font-light text-white/90 tracking-widest uppercase">Biblioteca</h2>
               <div className="w-16 h-1 bg-cyan-400/50 mt-4 rounded-full ml-auto"></div>
             </div>
          )}

        {/* 2. Top Left Header (Smaller) */}
        <motion.div 
          initial={{ opacity: 0, x: -100, skewX: -10 }}
          animate={{ opacity: 1, x: 0, skewX: 0 }}
          exit={{ opacity: 0, x: -100, skewX: -10 }}
          transition={{ type: "spring", damping: 20, delay: 0.1 }}
          className="absolute top-4 md:top-8 left-4 md:left-8 z-20 pointer-events-none"
        >
          <div className="relative">
            <h1 className={`text-3xl md:text-5xl lg:text-6xl ${uiStyle === 'dynamic' ? 'font-black italic tracking-tighter' : 'font-light tracking-widest'} text-white drop-shadow-md mb-0 leading-none uppercase`}>
              <span className="md:hidden">{mobileView === 'list' ? 'Biblioteca' : selectedBook.name}</span>
              <span className="hidden md:inline">{selectedBook.name}</span>
            </h1>
            <div className={`text-white/80 ${uiStyle === 'dynamic' ? 'font-black italic tracking-[0.4em]' : 'font-light tracking-[0.3em]'} text-xs md:text-sm ml-1 mt-1`}>
              <span className="md:hidden">{mobileView === 'list' ? (uiStyle === 'dynamic' ? 'MENÚ' : 'LIBROS') : (isSelectedOT ? 'ANTIGUO T.' : 'NUEVO T.')}</span>
              <span className="hidden md:inline">{isSelectedOT ? 'ANTIGUO T.' : 'NUEVO T.'}</span>
            </div>
            
            {/* Giant Number Positioned Top-Middle like P3 (Dynamic only) */}
            {uiStyle === 'dynamic' && (
              <div className="fixed top-[5%] md:top-[-5%] left-[10%] md:left-[15%] lg:left-[20%] transform text-[15rem] md:text-[30rem] lg:text-[40rem] font-black italic text-[#021157] leading-none select-none pointer-events-none -z-10 opacity-30 drop-shadow-2xl">
                {bookNumberDisplay}
              </div>
            )}
          </div>
        </motion.div>

{/* 4. Close Button */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, delay: 0.2 }}
          onClick={onClose} 
          className={`absolute top-6 right-6 md:top-8 md:right-8 z-50 flex items-center justify-center transition-all ${
            uiStyle === 'dynamic' 
              ? 'w-12 h-12 md:w-14 md:h-14 bg-[#111] hover:bg-[#ff0066] text-white border-2 md:border-4 border-white transform -skew-x-12 shadow-[4px_4px_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.3)]' 
              : 'w-12 h-12 md:w-14 md:h-14 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:border-white/50 text-white shadow-lg'
          }`}
        >
          <X size={28} className={uiStyle === 'dynamic' ? 'skew-x-[12deg]' : ''} />
        </motion.button>

        {/* 5. Main Content Area */}
        <motion.div 
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="absolute inset-0 pt-28 md:pt-40 pb-6 md:pb-6 z-30 overflow-hidden md:overflow-visible"
        >
          {/* Slider Track for Mobile */}
          <div className={`w-[200vw] md:w-full h-full flex flex-row md:flex-row-reverse justify-between md:gap-8 md:px-12 transition-transform duration-500 ease-in-out ${
            mobileView === 'calendar' ? '-translate-x-[100vw] md:translate-x-0' : 'translate-x-0'
          }`}>
          
          {/* Column: Book Selector */}
          <div className="w-[100vw] md:w-[24rem] lg:w-[28rem] xl:w-[32rem] shrink-0 h-full flex flex-col px-6 md:px-0 md:-mr-2 lg:-mr-4 xl:-mr-6">
            {/* Styled Search Bar (Replacing plain search & old capitulos banner) */}
            <motion.div variants={itemLeft} className={`relative mb-4 w-full h-14 lg:h-16 flex-shrink-0 cursor-text group ${uiStyle === 'dynamic' ? 'shadow-[0_10px_20px_rgba(0,0,0,0.5)]' : 'bg-black/20 backdrop-blur-md rounded-xl border border-white/20'}`} onClick={() => document.getElementById('search-input')?.focus()}>
               {uiStyle === 'dynamic' ? (
                 <>
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
                 </>
               ) : (
                 <>
                   {/* Serene Search Bar */}
                   <div className="absolute inset-0 flex items-center px-4">
                     <Search className="text-cyan-300/80 w-5 h-5 mr-3" />
                     <input
                        id="search-input"
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Buscar libro..."
                        className="w-full bg-transparent text-white font-light tracking-wide text-lg placeholder-white/40 focus:outline-none"
                      />
                   </div>
                 </>
               )}
               
               {searchFilter && (
                <button onClick={(e) => { e.stopPropagation(); setSearchFilter(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-[#ff0066] transition-colors">
                  <X size={20} />
                </button>
              )}
            </motion.div>

            {/* Filter Tabs */}
            <motion.div variants={itemLeft} className={`flex gap-2 mb-4 text-xs tracking-wider ${uiStyle === 'dynamic' ? 'font-black italic transform -skew-x-3' : 'font-medium uppercase'}`}>
              <button
                onClick={() => setTestamentFilter('all')}
                className={`flex-1 py-2 transition-all ${
                  testamentFilter === 'all' 
                    ? (uiStyle === 'dynamic' ? 'bg-[#ffcc00] text-black border border-[#ffcc00] shadow-[4px_4px_0_rgba(0,0,0,0.2)]' : 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/50 rounded-lg') 
                    : (uiStyle === 'dynamic' ? 'bg-black/5 text-black/60 border border-black/20 hover:border-black/40' : 'bg-black/20 text-white/60 border border-white/10 hover:border-white/30 rounded-lg')
                }`}
              >
                TODOS
              </button>
              <button
                onClick={() => setTestamentFilter('ot')}
                className={`flex-1 py-2 transition-all ${
                  testamentFilter === 'ot' 
                    ? (uiStyle === 'dynamic' ? 'bg-[#ff0066] text-white border border-[#ff0066] shadow-[4px_4px_0_rgba(0,0,0,0.2)]' : 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/50 rounded-lg') 
                    : (uiStyle === 'dynamic' ? 'bg-black/5 text-black/60 border border-black/20 hover:border-black/40' : 'bg-black/20 text-white/60 border border-white/10 hover:border-white/30 rounded-lg')
                }`}
              >
                A.T.
              </button>
              <button
                onClick={() => setTestamentFilter('nt')}
                className={`flex-1 py-2 transition-all ${
                  testamentFilter === 'nt' 
                    ? (uiStyle === 'dynamic' ? 'bg-cyan-400 text-black border border-cyan-400 shadow-[4px_4px_0_rgba(0,0,0,0.2)]' : 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/50 rounded-lg') 
                    : (uiStyle === 'dynamic' ? 'bg-black/5 text-black/60 border border-black/20 hover:border-black/40' : 'bg-black/20 text-white/60 border border-white/10 hover:border-white/30 rounded-lg')
                }`}
              >
                N.T.
              </button>
            </motion.div>

            {/* Books List */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-2 space-y-2 pb-10">
              {filteredBooks.map((book, idx) => {
                const isSelected = book.name === selectedBookName;
                // Calculate completed chapters for this book
                let bookDoneCount = 0;
                for (let c = 1; c <= book.chapters; c++) {
                  if (completedChapters[`${book.name} ${c}`]) {
                    bookDoneCount++;
                  }
                }
                const isBookFinished = bookDoneCount === book.chapters && book.chapters > 0;

                return (
                  <motion.button
                    variants={itemLeft}
                    key={book.name}
                    onClick={() => {
                      setSelectedBookName(book.name);
                      setSelectedChapter(1);
                      if (window.innerWidth < 768) setMobileView('calendar');
                    }}
                    className={`w-full group text-left px-6 py-4 mb-2 flex items-center justify-between transition-all relative ${
                      uiStyle === 'dynamic' ? 'transform' : 'rounded-xl border border-white/10'
                    } ${
                      isSelected
                        ? (uiStyle === 'dynamic' ? 'bg-[#ffcc00] text-black font-black -skew-x-6 shadow-[6px_6px_0_rgba(0,0,0,0.2)] ml-2' : 'bg-cyan-500/20 text-white border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] ml-2')
                        : (uiStyle === 'dynamic' ? 'bg-black/5 text-black/80 hover:bg-black/10 hover:-skew-x-3' : 'bg-black/20 text-white/80 hover:bg-black/40 hover:border-white/30')
                    }`}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <span className={`text-lg md:text-xl tracking-wide ${uiStyle === 'dynamic' ? 'italic' : 'font-light'} ${isSelected ? (uiStyle === 'dynamic' ? 'text-black font-black' : 'text-white font-medium') : (uiStyle === 'dynamic' ? 'group-hover:text-black font-bold' : 'group-hover:text-white')}`}>
                        {book.name}
                      </span>
                      {isBookFinished && (
                        <span className="text-emerald-400 text-xs font-bold flex items-center" title="Libro completado">
                          <Check size={14} className="stroke-[3]" />
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 relative z-10">
                      {bookDoneCount > 0 && !isBookFinished && (
                        <span className="text-[10px] md:text-xs text-white/60 font-mono">
                          {bookDoneCount}/{book.chapters}
                        </span>
                      )}
                      <div className={`${
                        uiStyle === 'dynamic' 
                          ? 'bg-[#42f5e8] text-[#0b1040] font-black italic transform -skew-x-12 shadow-[2px_2px_0_rgba(0,0,0,0.15)]' 
                          : 'bg-white/10 text-white/80 font-medium rounded-full border border-white/20'
                      } text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1`}>
                        {book.chapters} CAP.
                      </div>
                    </div>
                  </motion.button>
                );
              })}
              {/* Bottom spacer for books list */}
              <div className="h-28 md:h-36 pointer-events-none" />
            </div>
          </div>

          {/* Calendar Grid (Now visually on the Left) */}
          <div className="w-[100vw] md:w-auto shrink-0 md:flex-1 h-full flex flex-col max-w-full md:max-w-xl md:mr-auto overflow-hidden px-6 md:px-0">
            
            <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
              <div className="md:hidden flex justify-between items-center mb-6 shrink-0">
                <span className={`text-2xl ${uiStyle === 'dynamic' ? 'font-black italic text-[#ffcc00]' : 'font-light text-cyan-300 tracking-wider uppercase'}`}>{selectedBook.name}</span>
                <button onClick={() => setMobileView('list')} className={`text-sm bg-black/40 px-4 py-2 ${uiStyle === 'dynamic' ? 'font-black italic rounded' : 'font-medium rounded-full border border-white/20'}`}>
                  VOLVER A LIBROS
                </button>
              </div>

              {/* Day Headers (Removed per request) */}
              
              {/* Grid Body */}
              <div className="grid grid-cols-7 gap-y-2 md:gap-y-4 gap-x-2 md:gap-x-4 flex-1 content-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 pb-16 pt-2">
                {/* Empty Offset Days */}
                {Array.from({ length: emptyDaysOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Actual Chapters */}
                {Array.from({ length: selectedBook.chapters }).map((_, i) => {
                  const chapterNum = i + 1;
                  const isSelected = selectedChapter === chapterNum;
                  const isHovered = hoveredChapter === chapterNum;
                  // DOM is red, SAB is cyan
                  const colIndex = (emptyDaysOffset + i) % 7;
                  const isSunday = colIndex === 0;
                  const isSaturday = colIndex === 6;

                  const isRead = !!completedChapters[`${selectedBook.name} ${chapterNum}`];

                  return (
                    <motion.button
                      key={chapterNum}
                      variants={popIn}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredChapter(chapterNum)}
                      onMouseLeave={() => setHoveredChapter(null)}
                      onClick={() => handleReadChapter(chapterNum)}
                      className="relative aspect-square flex items-center justify-center cursor-pointer group"
                    >
                      {/* Read chapter completion dot or check */}
                      {isRead && (
                        <div className={`absolute top-0.5 right-0.5 z-20 flex items-center justify-center ${
                          uiStyle === 'dynamic'
                            ? 'w-3 h-3 bg-[#ffea29] text-black text-[8px] font-black rounded-sm shadow-[1px_1px_0_rgba(0,0,0,0.5)]'
                            : 'w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                        }`} title="Capítulo leído">
                          {uiStyle === 'dynamic' ? '✓' : null}
                        </div>
                      )}

                      {/* Hover Pink Accent or Serene Glass */}
                      {isHovered && !isSelected && (
                        uiStyle === 'dynamic' ? (
                          <div 
                            className="absolute -left-2 top-1 w-6 h-6 bg-[#ff0066] z-0" 
                            style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} 
                          />
                        ) : (
                          <div className="absolute inset-1 bg-white/10 rounded-full z-0" />
                        )
                      )}
                      
                      {/* Selected Backdrop */}
                      {isSelected && (
                        uiStyle === 'dynamic' ? (
                          <motion.div 
                            layoutId="selected-ring"
                            className="absolute inset-[-10%] rounded-full border-4 border-[#ffcc00] z-0 opacity-80 mix-blend-screen"
                          />
                        ) : (
                          <motion.div 
                            layoutId="selected-ring-serene"
                            className="absolute inset-0 rounded-full border border-cyan-400 bg-cyan-500/20 z-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          />
                        )
                      )}
                      {isSelected && uiStyle === 'dynamic' && (
                        <div className="absolute inset-0 rounded-full bg-[#ffcc00]/20 blur-md z-0" />
                      )}

                      {/* Number */}
                      <span
                        className={`text-xl md:text-3xl lg:text-4xl drop-shadow-lg z-10 transition-colors ${
                          uiStyle === 'dynamic' ? 'font-black italic tracking-tighter' : 'font-light'
                        } ${
                          isSelected
                            ? (uiStyle === 'dynamic' ? 'text-[#ffcc00] drop-shadow-[0_0_10px_rgba(255,204,0,0.8)]' : 'text-white font-medium')
                            : (uiStyle === 'dynamic' && isSunday)
                              ? 'text-[#ff0033]'
                              : (uiStyle === 'dynamic' && isSaturday)
                                ? 'text-cyan-300'
                                : 'text-white'
                        }`}
                      >
                        {chapterNum}
                      </span>
                    </motion.button>
                  );
                })}
                {/* Generous bottom scroll spacer so last chapter row has full clearance */}
                <div className="col-span-7 h-28 md:h-36 pointer-events-none" />
              </div>
            </div>

          </div>
          </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
