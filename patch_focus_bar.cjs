const fs = require('fs');

let code = fs.readFileSync('src/components/BibleResults.tsx', 'utf8');

// Replace the entire <AnimatePresence> block for the Floating Focus Mode Bar
const newFloatingBar = `      <AnimatePresence>
        {focusedVerse && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={\`fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[120] backdrop-blur-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col items-stretch max-w-[95vw] sm:max-w-[85vw] md:max-w-[600px] w-full min-w-[320px] \${
              uiStyle === 'dynamic' 
                ? 'bg-black/95 border-2 border-[#ff0066]/50 rounded-xl' 
                : 'bg-[#0f172a]/70 border border-white/20 rounded-[2rem]'
            }\`}
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
              
              {/* Verse Reference */}
              <div className={\`flex items-center gap-2 pr-2 sm:pr-3 border-r \${uiStyle === 'dynamic' ? 'border-[#ff0066]/30' : 'border-white/15'}\`}>
                <span className={\`text-xs sm:text-sm whitespace-nowrap \${
                  uiStyle === 'dynamic' ? 'text-[#00e5ff] font-black uppercase tracking-wider' : 'text-cyan-200 font-semibold tracking-wide'
                }\`}>
                  {focusedVerse.book_name} {focusedVerse.chapter}:{focusedVerse.verse}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                <button
                  type="button"
                  onClick={() => handleNavigateVerse('prev')}
                  disabled={focusedVerseIndex <= 0}
                  className={\`p-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed \${
                    uiStyle === 'dynamic'
                      ? 'rounded-md border-2 bg-black hover:bg-[#ff0066]/20 border-white/10 hover:border-[#ff0066]/50 text-white'
                      : 'rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white'
                  }\`}
                  title="Versículo anterior (↑ / ←)"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <button
                  type="button"
                  onClick={() => handleNavigateVerse('next')}
                  disabled={focusedVerseIndex >= currentVersesList.length - 1}
                  className={\`p-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed \${
                    uiStyle === 'dynamic'
                      ? 'rounded-md border-2 bg-black hover:bg-[#ff0066]/20 border-white/10 hover:border-[#ff0066]/50 text-white'
                      : 'rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white'
                  }\`}
                  title="Siguiente versículo (↓ / →)"
                >
                  <ChevronRight size={16} />
                </button>
                
                <div className={\`h-6 w-px mx-1 \${uiStyle === 'dynamic' ? 'bg-[#ff0066]/30' : 'bg-white/15'}\`} />

                <button
                  type="button"
                  onClick={() => onToggleBookmark && focusedVerse && onToggleBookmark(\`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\`)}
                  className={\`p-2 transition-all active:scale-95 \${
                    uiStyle === 'dynamic'
                      ? \`rounded-md border-2 \${annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.isBookmarked ? 'bg-[#ff0066]/20 text-[#ff0066] border-[#ff0066]' : 'bg-black hover:bg-[#ff0066]/20 border-white/10 hover:border-[#ff0066]/50 text-white/80'}\`
                      : \`rounded-full border \${annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.isBookmarked ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 hover:bg-white/20 text-white/90 border-white/10'}\`
                  }\`}
                  title="Favorito"
                >
                  <Heart size={16} className={annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.isBookmarked ? 'fill-current' : ''} />
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsEditingComment(!isEditingComment)}
                  className={\`p-2 transition-all active:scale-95 \${
                    uiStyle === 'dynamic'
                      ? \`rounded-md border-2 \${annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.comment ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]' : 'bg-black hover:bg-[#00e5ff]/20 border-white/10 hover:border-[#00e5ff]/50 text-white/80'}\`
                      : \`rounded-full border \${annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.comment ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/5 hover:bg-white/20 text-white/90 border-white/10'}\`
                  }\`}
                  title="Añadir nota"
                >
                  <MessageSquare size={16} className={annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.comment ? 'fill-current' : ''} />
                </button>

                <button
                  type="button"
                  onClick={handleCopyFocusedVerse}
                  className={\`flex items-center gap-1.5 px-3 py-1.5 transition-all active:scale-95 text-xs font-medium \${
                    uiStyle === 'dynamic'
                      ? 'rounded-md border-2 bg-black hover:bg-white/10 border-white/10 text-white/90'
                      : 'rounded-full border border-white/10 bg-white/5 hover:bg-white/20 text-white/90'
                  }\`}
                  title="Copiar texto del versículo"
                >
                  {copiedVerse ? (
                    <>
                      <Check size={14} className={uiStyle === 'dynamic' ? 'text-[#00e5ff]' : 'text-emerald-400'} />
                      <span className={uiStyle === 'dynamic' ? 'text-[#00e5ff]' : 'text-emerald-300'}>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className={uiStyle === 'dynamic' ? 'text-white/60' : 'text-white/70'} />
                      <span className="hidden sm:inline">Copiar</span>
                    </>
                  )}
                </button>

                <div className={\`h-6 w-px mx-1 \${uiStyle === 'dynamic' ? 'bg-[#ff0066]/30' : 'bg-white/15'}\`} />

                <button
                  type="button"
                  onClick={() => setFocusedVerse(null)}
                  className={\`p-2 transition-all active:scale-95 font-bold \${
                    uiStyle === 'dynamic'
                      ? 'rounded-md bg-[#ff0066] hover:bg-[#ff0066]/80 text-white border-2 border-transparent'
                      : 'rounded-full bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                  }\`}
                  title="Salir del modo concentración (Esc)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {isEditingComment && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={\`w-full border-t mt-3 pt-3 flex flex-col sm:flex-row gap-2 \${
                  uiStyle === 'dynamic' ? 'border-[#ff0066]/30' : 'border-white/15'
                }\`}
              >
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Añade tu comentario o reflexión sobre este pasaje..."
                  className={\`flex-1 px-4 py-2 text-sm focus:outline-none resize-none h-[4.5rem] sm:h-12 transition-all \${
                    uiStyle === 'dynamic'
                      ? 'bg-[#111] border-2 border-white/10 focus:border-[#00e5ff] rounded-lg text-white placeholder-white/30 font-mono text-xs'
                      : 'bg-black/30 border border-white/10 focus:border-cyan-400/50 rounded-2xl text-white placeholder-white/40'
                  }\`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (onSaveComment && focusedVerse) {
                      onSaveComment(\`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\`, commentText);
                      setIsEditingComment(false);
                    }
                  }}
                  className={\`px-5 py-2 text-sm font-semibold transition-all active:scale-95 \${
                    uiStyle === 'dynamic'
                      ? 'bg-[#00e5ff] hover:bg-[#00e5ff]/80 text-black rounded-lg border-2 border-transparent uppercase tracking-wider'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 rounded-2xl sm:rounded-full backdrop-blur-md'
                  }\`}
                >
                  Guardar
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>`;

const startIndex = code.indexOf('<AnimatePresence>\n        {focusedVerse && (\n          <motion.div');
const endIndex = code.indexOf('</AnimatePresence>') + '</AnimatePresence>'.length;

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find AnimatePresence block");
  process.exit(1);
}

const before = code.substring(0, startIndex);
const after = code.substring(endIndex);

fs.writeFileSync('src/components/BibleResults.tsx', before + newFloatingBar + after);
console.log("Patched floating bar!");
