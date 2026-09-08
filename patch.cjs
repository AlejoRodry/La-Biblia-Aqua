const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className=\{`flex flex-col min-h-\[100svh\] items-center px-3\.5 sm:px-6 md:px-12 \$\{\!result \? 'justify-center py-12' : 'justify-start pt-24 sm:pt-28 pb-12'\}\`\}>([\s\S]*?)<\/div>\s*<\/motion\.div>\s*(?=\{\/\* Global Persona 3 Style Calendar)/m;

const match = code.match(regex);
if (!match) {
    console.log("No match");
    process.exit(1);
}

// Ensure AnimatePresence is imported
if (!code.includes('AnimatePresence')) {
    code = code.replace("import { motion", "import { motion, AnimatePresence");
}

const replacement = `<div className="flex flex-col min-h-[100svh] items-center px-3.5 sm:px-6 md:px-12 relative overflow-hidden justify-start pt-24 sm:pt-28 pb-12">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="home-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={deepTransitionsEnabled ? { opacity: 0, y: '50vh', filter: 'blur(20px)', position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' } : { opacity: 0 }}
                transition={{ duration: deepTransitionsEnabled ? 0.6 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 absolute inset-x-0 mx-auto"
                style={{ top: '25%' }}
              >
                {/* Header & Search Bar */}
                <div className="relative flex items-center justify-center my-2 sm:my-4 max-w-full overflow-visible">
                  {/* 1. True Outline Layer */}
                  <h1 className={\`absolute text-6xl min-[360px]:text-[4.2rem] min-[400px]:text-7xl sm:text-8xl md:text-9xl tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em] uppercase leading-[1.1] font-black whitespace-nowrap select-none \${uiStyle === 'dynamic' ? 'italic transform -skew-x-[10deg]' : ''}\`}
                      style={{ 
                        color: 'white',
                        filter: 'url(#true-outline)',
                        WebkitTextStroke: '0px',
                        fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        padding: '0.05em 0.15em',
                      }}
                      aria-hidden="true">
                    BIBLIA
                  </h1>
                  
                  {/* 2. Fill Layer */}
                  <h1 className={\`relative text-6xl min-[360px]:text-[4.2rem] min-[400px]:text-7xl sm:text-8xl md:text-9xl tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em] title-outline font-black whitespace-nowrap select-none \${uiStyle === 'dynamic' ? 'italic transform -skew-x-[10deg]' : ''}\`}>
                    BIBLIA
                  </h1>
                </div>

                <div className="w-full flex flex-col space-y-4 sm:space-y-5">
                  <form onSubmit={handleSearch} className="w-full relative group underwater-float">
                      <input
                        type="text"
                        placeholder={\`Buscar pasaje (p. ej. \${CURATED_PASSAGES_POOL[exampleIndex]})\`}
                        className={\`w-full pl-5 sm:pl-6 pr-14 sm:pr-16 py-3.5 sm:py-4 text-base sm:text-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] \${
                          uiStyle === 'dynamic' 
                            ? 'bg-black/60 border-b-4 border-cyan-400 font-bold italic transform -skew-x-6 rounded-none focus:bg-black/80' 
                            : 'bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl focus:bg-black/30'
                        }\`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button 
                        type="submit"
                        disabled={loading}
                        className="absolute inset-y-1.5 sm:inset-y-2 right-1.5 sm:right-2 w-11 sm:w-12 flex items-center justify-center bg-black/20 hover:bg-black/40 border border-white/20 backdrop-blur-md rounded-xl text-white transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] disabled:opacity-50"
                      >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Search size={20} />
                        </motion.div>
                      ) : (
                        <Search size={20} />
                      )}
                    </button>
                  </form>

                  {/* Continue Last Read Chapter Button */}
                  {lastRead && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-center pt-0.5">
                      <button 
                        onClick={() => handleSearch(undefined, lastRead)}
                        className={\`group flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border shadow-lg transition-all active:scale-95 underwater-float-delayed \${
                          uiStyle === 'dynamic' 
                            ? 'bg-[#111] hover:bg-[#ff0066] border-[#ff0066]/50 text-white transform -skew-x-6' 
                            : 'bg-black/30 hover:bg-black/50 border-cyan-400/30 text-white backdrop-blur-md'
                        }\`}
                      >
                        <BookOpen size={17} className={uiStyle === 'dynamic' ? 'text-white' : 'text-cyan-300'} />
                        <span className="font-semibold text-xs sm:text-sm">Continuar: {lastRead}</span>
                        <ChevronRight size={17} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}

                  {/* Quick Exploration */}
                  <div className="w-full flex flex-col items-center mt-4 sm:mt-6 underwater-float">
                    <span className="text-white/50 text-[11px] font-medium mb-3 uppercase tracking-widest text-center w-full">Descubrir:</span>
                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5">
                      {activeEmotions.map((emotion) => (
                        <button
                          key={emotion.id}
                          onClick={() => handleSearch(undefined, emotion.id)}
                          className={\`group px-3.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md border rounded-full text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 active:scale-95 \${emotion.classes}\`}
                        >
                          <span className={emotion.iconClass}>{emotion.icon}</span> {emotion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full p-4 bg-red-900/30 backdrop-blur-md border border-red-400/30 rounded-2xl text-red-100 text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                  >
                    {error}
                  </motion.div>
                )}

                {/* History & Recommendations */}
                <div className="w-full max-w-3xl mt-8 mb-8 flex flex-col gap-6">
                  {/* Verse of the Day */}
                  <div 
                    onClick={() => handleSearch(undefined, verseOfTheDay.ref)}
                    className="group cursor-pointer bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/20 hover:border-cyan-400/50 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all overflow-hidden relative underwater-float"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-3xl rounded-full -mt-10 -mr-10 pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={16} className="text-cyan-300" />
                          <span className="text-xs font-bold tracking-widest text-cyan-200 uppercase">Versículo del Día</span>
                        </div>
                        <p className="text-white text-lg sm:text-xl font-medium leading-relaxed mb-3 drop-shadow-md">"{verseOfTheDay.text}"</p>
                        <p className="text-white/60 font-semibold text-sm">— {verseOfTheDay.ref}</p>
                      </div>
                      <div className="hidden sm:flex shrink-0 bg-white/10 group-hover:bg-cyan-500/20 p-3 rounded-full transition-colors">
                        <ArrowRight size={20} className="text-white group-hover:text-cyan-300 transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* History */}
                    <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] underwater-float-delayed">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium flex items-center drop-shadow-md">
                          <History size={18} className="mr-2 text-cyan-300" /> Búsquedas Recientes
                        </h3>
                        {recentSearches.length > 0 && (
                          <button
                            onClick={() => {
                              setRecentSearches([]);
                              localStorage.removeItem('bible_recent_searches');
                            }}
                            className="underwater-float-delayed text-xs text-white/50 hover:text-white/80 transition-colors"
                          >
                            Limpiar
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {recentSearches.length > 0 ? recentSearches.slice(0, 5).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearch(undefined, item)}
                            className={\`w-full text-left px-4 py-3 bg-black/20 hover:bg-black/40 rounded-xl text-white text-sm transition-colors border border-white/10 hover:border-white/30 flex justify-between items-center group \${idx % 2 === 0 ? 'underwater-float' : 'underwater-float-delayed'}\`}
                          >
                            <span>{item}</span>
                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300" />
                          </button>
                        )) : (
                          <p className="text-white/60 text-sm italic px-2">No hay búsquedas recientes aún.</p>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] underwater-float">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium flex items-center drop-shadow-md">
                          <Sparkles size={18} className="mr-2 text-amber-300" /> Recomendaciones
                        </h3>
                        <button
                          onClick={shuffleSuggestions}
                          className="underwater-float-slow text-xs text-cyan-300/80 hover:text-cyan-200 flex items-center gap-1 transition-colors"
                        >
                          <RotateCw size={12} /> Variar
                        </button>
                      </div>
                      <div className="space-y-2">
                        {suggestedPassages.slice(0, 5).map((item, idx) => (
                          <button
                            key={\`\${item}-\${idx}\`}
                            onClick={() => handleSearch(undefined, item)}
                            className={\`w-full text-left px-4 py-3 bg-black/20 hover:bg-black/40 rounded-xl text-white text-sm transition-colors border border-white/10 hover:border-white/30 flex justify-between items-center group \${idx % 2 === 0 ? 'underwater-float-delayed' : 'underwater-float'}\`}
                          >
                            <span>{item}</span>
                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results-view"
                initial={deepTransitionsEnabled ? { opacity: 0, y: '-20vh', filter: 'blur(10px)' } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={deepTransitionsEnabled ? { opacity: 0, y: '50vh', filter: 'blur(20px)', position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none' } : { opacity: 0, y: 20 }}
                transition={{ duration: deepTransitionsEnabled ? 0.6 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-4xl flex flex-col items-center justify-start space-y-6"
              >
                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full p-4 bg-red-900/30 backdrop-blur-md border border-red-400/30 rounded-2xl text-red-100 text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                  >
                    {error}
                  </motion.div>
                )}

                {!loading && result && (
                  <BibleResults
                    result={result}
                    annotations={annotations}
                    onToggleBookmark={handleToggleBookmark}
                    onSaveComment={handleSaveComment}
                    onSaveHighlight={handleSaveHighlight}
                    onSearch={(targetQuery) => handleSearch(undefined, targetQuery)}
                    onBack={handleBack}
                    showChapters={showChapters}
                    setShowChapters={setShowChapters}
                    readingFontFamily={readingFontFamily}
                    setReadingFontFamily={setReadingFontFamily}
                    readingFontSize={readingFontSize}
                    setReadingFontSize={setReadingFontSize}
                    readingLineHeight={readingLineHeight}
                    setReadingLineHeight={setReadingLineHeight}
                    numberFontFamily={numberFontFamily}
                    setNumberFontFamily={setNumberFontFamily}
                    uiStyle={uiStyle}
                    isChapterCompleted={
                      result.bookName && result.verses?.[0]
                        ? !!progressData.completedChapters[\`\${result.bookName} \${result.verses[0].chapter}\`]
                        : false
                    }
                    onToggleChapterCompleted={handleToggleChapterCompleted}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Replaced successfully.");
