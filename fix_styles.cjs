const fs = require('fs');
let code = fs.readFileSync('src/components/BibleResults.tsx', 'utf8');

// 1. Fix the main floating bar wrapper background and blur
code = code.replace(
  "className={`fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[120] backdrop-blur-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col items-stretch max-w-[95vw] sm:max-w-[85vw] md:max-w-[600px] w-full min-w-[320px] ${\n              uiStyle === 'dynamic' \n                ? 'bg-black/95 border-2 border-[#ff0066]/50 rounded-xl' \n                : 'bg-[#0f172a]/70 border border-white/20 rounded-[2rem]'\n            }`}",
  "className={`fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[120] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col items-stretch max-w-[95vw] sm:max-w-[85vw] md:max-w-[600px] w-full min-w-[320px] ${\n              uiStyle === 'dynamic' \n                ? 'bg-black/95 border-2 border-[#ff0066]/50 rounded-xl backdrop-blur-md' \n                : 'bg-black/30 backdrop-blur-md border border-white/20 rounded-[2rem]'\n            }`}"
);

// 2. Fix the buttons in serene to match the glassmorphism (from bg-white/5 to bg-black/20 or bg-white/10)
// Prev button
code = code.replace(
  "'rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white'",
  "'rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white'"
);
// Next button
code = code.replace(
  "'rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-white'",
  "'rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white'"
);
// Bookmark button
code = code.replace(
  "`rounded-full border ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.isBookmarked ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 hover:bg-white/20 text-white/90 border-white/10'}`",
  "`rounded-full border ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.isBookmarked ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-black/30 hover:bg-black/50 text-white/90 border-white/10'}`"
);
// Add Note button
code = code.replace(
  "`rounded-full border ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.comment ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/5 hover:bg-white/20 text-white/90 border-white/10'}`",
  "`rounded-full border ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.comment ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-black/30 hover:bg-black/50 text-white/90 border-white/10'}`"
);
// Copy button
code = code.replace(
  "'rounded-full border border-white/10 bg-white/5 hover:bg-white/20 text-white/90'",
  "'rounded-full border border-white/10 bg-black/30 hover:bg-black/50 text-white/90'"
);

fs.writeFileSync('src/components/BibleResults.tsx', code);
console.log("Fixed styles successfully");
