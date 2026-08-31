import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, ChevronRight, Filter, Sparkles, ChevronLeft, ChevronDown, BookCheck, Search, X, Copy, Check, Heart, MessageSquare, Library } from 'lucide-react';
import { SearchResult, Verse } from '../lib/bible';
import { FONT_SIZES, LINE_HEIGHTS, FontSizeKey, LineHeightKey } from '../lib/typography';

interface BibleResultsProps {
  result: SearchResult;
  onSearch: (query: string) => void;
  onBack: () => void;
  showChapters: boolean;
  setShowChapters: (show: boolean) => void;
  readingFontFamily?: string;
  setReadingFontFamily?: (font: string) => void;
  readingFontSize?: FontSizeKey;
  setReadingFontSize?: (size: FontSizeKey) => void;
  readingLineHeight?: LineHeightKey;
  setReadingLineHeight?: (height: LineHeightKey) => void;
  numberFontFamily?: string;
  setNumberFontFamily?: (font: string) => void;
  uiStyle?: 'serene' | 'dynamic';
  annotations?: Record<string, { isBookmarked?: boolean; comment?: string }>;
  onToggleBookmark?: (verseId: string) => void;
  onSaveComment?: (verseId: string, comment: string) => void;
  isChapterCompleted?: boolean;
  onToggleChapterCompleted?: (bookName: string, chapter: number) => void;
}

const OLD_TESTAMENT_BOOKS = new Set([
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut',
  '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras',
  'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
  'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel',
  'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo',
  'Zacarías', 'Malaquías'
]);

function highlightKeyword(text: string, keyword: string) {
  if (!keyword) return text;
  const cleanKeyword = keyword.trim();
  const words = cleanKeyword.split(/\s+/).filter(Boolean);
  if (words.length === 0) return text;

  // Build accent-insensitive regex pattern
  const patternParts = words.map(w => {
    return w.split('').map(char => {
      const lower = char.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      switch (lower) {
        case 'a': return '[aáAÁ]';
        case 'e': return '[eéEÉ]';
        case 'i': return '[iíIÍ]';
        case 'o': return '[oóOÓ]';
        case 'u': return '[uúüUÚÜ]';
        case 'n': return '[nñNÑ]';
        default: return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
    }).join('');
  });

  const regex = new RegExp(`(${patternParts.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (regex.test(part)) {
          return (
            <mark
              key={i}
              className="bg-amber-400/30 text-amber-200 font-bold px-1 py-0.5 rounded mx-0.5 border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.35)]"
            >
              {part}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function BibleResults({
  result,
  onSearch,
  onBack,
  showChapters,
  setShowChapters,
  readingFontFamily = "'Lora', Georgia, serif",
  setReadingFontFamily,
  readingFontSize = 'lg',
  setReadingFontSize,
  readingLineHeight = 'relaxed',
  setReadingLineHeight,
  numberFontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  setNumberFontFamily,
  uiStyle = 'serene',
  annotations,
  onToggleBookmark,
  onSaveComment,
  isChapterCompleted = false,
  onToggleChapterCompleted,
}: BibleResultsProps) {
  const isKeywordSearch = result.type === 'keyword';
  const isBookSearch = result.type === 'book';
  const [focusedVerse, setFocusedVerse] = useState<Verse | null>(null);
  
  // State for keyword filtering & pagination
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('all');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'OT' | 'NT'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(30);

  const currentSizeOption = useMemo(() => {
    return FONT_SIZES.find(f => f.key === readingFontSize) || FONT_SIZES[2];
  }, [readingFontSize]);

  const currentLineHeightOption = useMemo(() => {
    return LINE_HEIGHTS.find(h => h.key === readingLineHeight) || LINE_HEIGHTS[1];
  }, [readingLineHeight]);

  // Group keyword verses by book
  const bookCounts = useMemo(() => {
    if (!isKeywordSearch) return {};
    const counts: Record<string, number> = {};
    result.verses.forEach(v => {
      counts[v.book_name] = (counts[v.book_name] || 0) + 1;
    });
    return counts;
  }, [result, isKeywordSearch]);

  // Filter verses based on testament and book filter
  const filteredVerses = useMemo(() => {
    if (!isKeywordSearch) return result.verses;
    return result.verses.filter(v => {
      const isOT = OLD_TESTAMENT_BOOKS.has(v.book_name);
      if (testamentFilter === 'OT' && !isOT) return false;
      if (testamentFilter === 'NT' && isOT) return false;
      if (selectedBookFilter !== 'all' && v.book_name !== selectedBookFilter) return false;
      return true;
    });
  }, [result.verses, isKeywordSearch, testamentFilter, selectedBookFilter]);

  // List of currently displayed verses
  const displayedVerses = useMemo(() => {
    if (!isKeywordSearch) return result.verses;
    return filteredVerses.slice(0, visibleCount);
  }, [filteredVerses, isKeywordSearch, visibleCount]);

  const [copiedVerse, setCopiedVerse] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (focusedVerse && annotations) {
      const vid = `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}`;
      setCommentText(annotations[vid]?.comment || "");
      setIsEditingComment(false);
    }
  }, [focusedVerse, annotations]);

  // Controlled navigation between verses in focus mode
  const currentVersesList = useMemo(() => {
    return isKeywordSearch ? displayedVerses : result.verses;
  }, [isKeywordSearch, displayedVerses, result.verses]);

  const focusedVerseIndex = useMemo(() => {
    if (!focusedVerse) return -1;
    return currentVersesList.findIndex(
      v => v.book_name === focusedVerse.book_name && 
           v.chapter === focusedVerse.chapter && 
           v.verse === focusedVerse.verse
    );
  }, [focusedVerse, currentVersesList]);

  const handleNavigateVerse = (direction: 'next' | 'prev') => {
    if (!focusedVerse || focusedVerseIndex === -1) return;
    const nextIdx = direction === 'next' ? focusedVerseIndex + 1 : focusedVerseIndex - 1;
    if (nextIdx >= 0 && nextIdx < currentVersesList.length) {
      const target = currentVersesList[nextIdx];
      setFocusedVerse(target);
      setTimeout(() => {
        const el = document.querySelector(`[data-verse-id="${target.book_name}-${target.chapter}-${target.verse}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 40);
    }
  };

  const handleCopyFocusedVerse = () => {
    if (!focusedVerse) return;
    const textToCopy = `«${focusedVerse.text}» - ${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse} (${result.translation_name || 'RVR1960'})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(true);
    setTimeout(() => setCopiedVerse(false), 2000);
  };

  // Keyboard navigation when in focus mode: Escape to exit, Arrows to step
  useEffect(() => {
    if (!focusedVerse) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusedVerse(null);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigateVerse('next');
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigateVerse('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedVerse, focusedVerseIndex, currentVersesList]);

  // Helper to extract current chapter number if passage
  const currentChapterNumber = useMemo(() => {
    if (result.type === 'passage' && result.verses.length > 0) {
      return result.verses[0].chapter;
    }
    return null;
  }, [result]);

  const [scrollProgress, setScrollProgress] = useState(0);

  React.useEffect(() => {
    if (result.type !== 'passage') return;
    
    const handleScroll = () => {
      // Calculate how far down the page we've scrolled (0 to 1)
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [result]);

  return (
    <div className="w-full flex flex-col relative pb-16 pt-0">
      {/* SVG Filters for clean text outlines (bypasses font internal overlaps) */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="clean-hollow-outline-2" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="2" />
            <feComposite in="DILATED" in2="SourceAlpha" operator="out" result="OUTLINE" />
            <feFlood floodColor="rgba(255,255,255,0.85)" result="COLOR" />
            <feComposite in="COLOR" in2="OUTLINE" operator="in" />
          </filter>
          <filter id="clean-hollow-outline-3" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="3" />
            <feComposite in="DILATED" in2="SourceAlpha" operator="out" result="OUTLINE" />
            <feFlood floodColor="rgba(255,255,255,0.95)" result="COLOR" />
            <feComposite in="COLOR" in2="OUTLINE" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Background darkener when focused */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[50] transition-opacity duration-300 ${focusedVerse ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setFocusedVerse(null)}
      />

      {/* Unified Chapter Navigation Capsule (Passage Mode) */}
      {result.type === 'passage' && result.bookName && result.totalChapters && (
        <div className={`flex items-center justify-center relative z-[90] mt-0 mb-1.5 sm:mb-2 transition-all duration-300 ${focusedVerse ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
          <div className="relative">
            <div className={`flex items-center backdrop-blur-md rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all p-0.5 sm:p-1 border ${
              uiStyle === 'dynamic'
                ? 'bg-black/80 border-2 border-white/80 transform -skew-x-12'
                : 'bg-black/25 hover:bg-black/35 border-white/20 hover:border-white/35'
            }`}>
              {/* Previous Chapter button */}
              <button
                onClick={() => currentChapterNumber && currentChapterNumber > 1 && onSearch(`${result.bookName} ${currentChapterNumber - 1}`)}
                disabled={!currentChapterNumber || currentChapterNumber <= 1}
                className={`p-1.5 sm:p-2 rounded-full text-white transition-all active:scale-95 flex items-center justify-center ${
                  !currentChapterNumber || currentChapterNumber <= 1
                    ? 'opacity-25 pointer-events-none'
                    : 'hover:bg-white/15 active:bg-white/25'
                }`}
                title={currentChapterNumber && currentChapterNumber > 1 ? `Capítulo anterior: ${result.bookName} ${currentChapterNumber - 1}` : 'No hay capítulo anterior'}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Vertical divider */}
              <div className="w-px h-4 bg-white/20 mx-0.5" />

              {/* Current Book & Chapter Picker Toggle */}
              <button 
                onClick={() => setShowChapters(!showChapters)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-white transition-all text-xs sm:text-sm font-semibold active:scale-95 ${
                  showChapters
                    ? 'bg-white/20 text-cyan-200 shadow-inner'
                    : 'hover:bg-white/15'
                }`}
                title="Seleccionar capítulo"
              >
                <BookOpen size={15} className="text-cyan-300" />
                <span>{result.bookName} {currentChapterNumber}</span>
                <ChevronDown size={14} className={`text-white/60 transition-transform duration-200 ${showChapters ? 'rotate-180 text-cyan-300' : ''}`} />
              </button>

              {/* Vertical divider */}
              <div className="w-px h-4 bg-white/20 mx-0.5" />

              {/* Next Chapter button */}
              <button
                onClick={() => currentChapterNumber && currentChapterNumber < result.totalChapters && onSearch(`${result.bookName} ${currentChapterNumber + 1}`)}
                disabled={!currentChapterNumber || currentChapterNumber >= result.totalChapters}
                className={`p-1.5 sm:p-2 rounded-full text-white transition-all active:scale-95 flex items-center justify-center ${
                  !currentChapterNumber || currentChapterNumber >= result.totalChapters
                    ? 'opacity-25 pointer-events-none'
                    : 'hover:bg-white/15 active:bg-white/25'
                }`}
                title={currentChapterNumber && currentChapterNumber < result.totalChapters ? `Capítulo siguiente: ${result.bookName} ${currentChapterNumber + 1}` : 'No hay capítulo siguiente'}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Chapters Dropdown Modal */}
            <AnimatePresence>
              {showChapters && result.totalChapters && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowChapters(false)} 
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 max-h-80 flex flex-col bg-slate-950/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] ring-1 ring-white/10 z-[150]"
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/15">
                      <span className="text-white font-bold tracking-wide text-base">{result.bookName}</span>
                      <span className="text-xs text-cyan-200/80 font-normal">{result.totalChapters} cap.</span>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar pr-0.5 grid grid-cols-5 gap-2">
                      {Array.from({ length: result.totalChapters }).map((_, i) => {
                        const isCurrent = currentChapterNumber === i + 1;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setShowChapters(false);
                              onSearch(`${result.bookName} ${i + 1}`);
                            }}
                            className={`w-full aspect-square flex items-center justify-center rounded-xl text-sm transition-all font-semibold ${
                              isCurrent 
                                ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_14px_rgba(34,211,238,0.7),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/80 scale-105' 
                                : 'bg-white/[0.08] hover:bg-white/[0.2] active:bg-white/[0.3] backdrop-blur-md border border-white/15 hover:border-cyan-400/50 text-white/90 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95'
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Giant Chapter Number Background (Filling Up) */}
      {result.type === 'passage' && currentChapterNumber && (
        <div 
          className="fixed bottom-[-4rem] right-2 md:right-8 text-[16rem] sm:text-[20rem] md:text-[26rem] leading-none font-black select-none pointer-events-none z-0 blur-[2px] opacity-40 watermark-progress"
          style={{ 
            '--wave-y': `${scrollProgress * 100}%`
          } as React.CSSProperties}
        >
          {currentChapterNumber}
        </div>
      )}

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
        className={`w-full relative ${focusedVerse ? 'z-[60]' : 'z-20'}`}
      >
        {/* ======================= KEYWORD RESULTS VIEW ======================= */}
        {isKeywordSearch ? (
          <div className="w-full space-y-6">
            {/* Header Summary Card */}
            <div className={`bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${focusedVerse ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-300 text-xs md:text-sm font-semibold tracking-wider uppercase mb-1">
                    <Search size={14} />
                    <span>Búsqueda temática en toda la Biblia</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {result.totalCount} versículos con &ldquo;<span className="text-cyan-300">{result.query}</span>&rdquo;
                  </h2>
                </div>
                <div className="text-right self-start md:self-auto">
                  <span className="inline-block bg-white/10 text-white/90 px-3 py-1 rounded-full text-xs border border-white/15">
                    {result.translation_name}
                  </span>
                </div>
              </div>

              {/* Matching Book Direct Shortcuts (e.g. 1 Pedro, 2 Pedro) */}
              {result.bookShortcuts && result.bookShortcuts.length > 0 && (
                <div className="mt-4 pt-2">
                  <div className="text-xs text-white/70 font-medium mb-2 flex items-center gap-1.5">
                    <BookCheck size={14} className="text-amber-300" />
                    <span>Libros con este nombre:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.bookShortcuts.map((book) => (
                      <button
                        key={book.name}
                        onClick={() => onSearch(book.name)}
                        className="group flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-400/40 hover:border-cyan-300 rounded-full text-white text-xs md:text-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)] active:scale-95"
                      >
                        <BookOpen size={14} className="text-cyan-300 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">{book.name}</span>
                        <span className="text-cyan-200/70 text-xs">({book.chapters} cap.)</span>
                        <ChevronRight size={12} className="text-white/60 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters Section */}
              <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                {/* Testament filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-white/60 flex items-center gap-1 mr-1">
                    <Filter size={12} /> Testamento:
                  </span>
                  <button
                    onClick={() => { setTestamentFilter('all'); setSelectedBookFilter('all'); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      testamentFilter === 'all'
                        ? 'bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                        : 'bg-black/30 hover:bg-black/50 text-white/80 border border-white/10'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => { setTestamentFilter('OT'); setSelectedBookFilter('all'); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      testamentFilter === 'OT'
                        ? 'bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                        : 'bg-black/30 hover:bg-black/50 text-white/80 border border-white/10'
                    }`}
                  >
                    Antiguo Testamento
                  </button>
                  <button
                    onClick={() => { setTestamentFilter('NT'); setSelectedBookFilter('all'); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      testamentFilter === 'NT'
                        ? 'bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                        : 'bg-black/30 hover:bg-black/50 text-white/80 border border-white/10'
                    }`}
                  >
                    Nuevo Testamento
                  </button>
                </div>

                {/* Book Pill Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  <span className="text-xs text-white/60 shrink-0 mr-1">Libro:</span>
                  <button
                    onClick={() => setSelectedBookFilter('all')}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedBookFilter === 'all'
                        ? 'bg-white text-black font-bold'
                        : 'bg-black/20 hover:bg-black/40 text-white/80 border border-white/10'
                    }`}
                  >
                    Todos ({filteredVerses.length})
                  </button>
                  {Object.entries(bookCounts).map(([bName, count]) => {
                    const isOT = OLD_TESTAMENT_BOOKS.has(bName);
                    if (testamentFilter === 'OT' && !isOT) return null;
                    if (testamentFilter === 'NT' && isOT) return null;
                    
                    const isSelected = selectedBookFilter === bName;
                    return (
                      <button
                        key={bName}
                        onClick={() => setSelectedBookFilter(isSelected ? 'all' : bName)}
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-400 text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                            : 'bg-black/20 hover:bg-black/40 text-white/80 border border-white/10'
                        }`}
                      >
                        <span>{bName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-cyan-200'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Verses List */}
            <div className="space-y-4">
              {displayedVerses.map((verse: Verse, idx: number) => {
                const isFocused = focusedVerse === verse;
                const isDimmed = focusedVerse && !isFocused;
                
                return (
                <div
                  data-verse-id={`${verse.book_name}-${verse.chapter}-${verse.verse}`}
                  key={`${verse.book_name}-${verse.chapter}-${verse.verse}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedVerse(isFocused ? null : verse);
                  }}
                  className={`group backdrop-blur-md border rounded-2xl p-5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)] cursor-pointer ${
                    isFocused 
                      ? 'bg-blue-900/60 border-cyan-300/60 scale-[1.03] relative z-[70] ring-1 ring-cyan-400/50' 
                      : isDimmed 
                      ? 'bg-black/10 border-white/5 opacity-30 blur-[2px] relative z-[60]'
                      : 'bg-black/25 hover:bg-black/35 border-white/15 hover:border-cyan-300/40'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-cyan-950/70 border border-cyan-400/30 rounded-lg text-cyan-200 font-bold text-sm tracking-wide shadow-sm">
                        {verse.book_name} {verse.chapter}:{verse.verse}
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); onSearch(`${verse.book_name} ${verse.chapter}`); }}
                      className="flex items-center gap-1.5 text-xs text-white/70 hover:text-cyan-300 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-400/30 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                    >
                      <BookOpen size={13} />
                      <span>Leer capítulo completo</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>

                  <p 
                    className="font-normal text-white/95 drop-shadow-sm transition-all"
                    style={{
                      fontFamily: readingFontFamily,
                      fontSize: currentSizeOption.fontSizeRem,
                      lineHeight: currentLineHeightOption.value,
                    }}
                  >
                    {highlightKeyword(verse.text, result.query)}
                  </p>
                </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {filteredVerses.length > visibleCount && (
              <div className={`flex justify-center pt-4 transition-all duration-300 ${focusedVerse ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 30)}
                  className="px-6 py-3 bg-black/30 hover:bg-black/50 border border-cyan-400/40 hover:border-cyan-300 rounded-xl text-white font-medium text-sm transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center gap-2 active:scale-95"
                >
                  <Sparkles size={16} className="text-cyan-300" />
                  <span>Mostrar más versículos ({filteredVerses.length - visibleCount} restantes)</span>
                </button>
              </div>
            )}
          </div>
        ) : isBookSearch ? (
          /* ======================= BOOK CHAPTERS VIEW ======================= */
          <div className="w-full relative px-2 sm:px-4">
            <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center">
              <div className="inline-flex items-center justify-center p-3 md:p-4 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-4 md:mb-6">
                <Library size={24} className="text-cyan-400 md:w-8 md:h-8" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 md:mb-4">
                {result.bookName}
              </h2>
              <p className="text-white/70 text-sm md:text-base mb-6 md:mb-10 max-w-lg mx-auto">
                Selecciona un capítulo para comenzar a leer
              </p>
              
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 md:gap-3 max-w-4xl mx-auto">
                {Array.from({ length: result.totalChapters || 0 }).map((_, i) => {
                  const chapterNum = i + 1;
                  
                  return (
                    <button
                      key={chapterNum}
                      onClick={() => onSearch(`${result.bookName} ${chapterNum}`)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95 group ${
                        uiStyle === 'dynamic' 
                          ? 'bg-black/40 border-2 border-white/10 hover:border-[#ff0066]/50 hover:bg-[#ff0066]/10' 
                          : 'bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/10'
                      }`}
                    >
                      <span className={`text-lg md:text-xl transition-colors ${
                        uiStyle === 'dynamic' ? 'font-black italic' : 'font-light'
                      } text-white group-hover:text-cyan-300`}>
                        {chapterNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ======================= PASSAGE / CHAPTER VIEW ======================= */
          <div className="w-full relative px-2 sm:px-4">
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <div className={`border-b border-white/20 pb-5 sm:pb-6 text-center transition-all duration-300 ${focusedVerse ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                
                {/* Giant Chapter Number with Animated White Waves Inside and Clean Outer Outline */}
                {currentChapterNumber && (
                  <div className={`relative inline-flex items-center justify-center select-none pointer-events-none transform -mt-2 sm:-mt-4 mb-2 sm:mb-4 ${uiStyle === 'dynamic' ? 'italic transform -skew-x-[10deg]' : ''}`}>
                    {/* 1. Outline Layer (Dilated 3px border, interior hollowed out) */}
                    <div 
                      className="absolute text-[6.5rem] min-[360px]:text-[8rem] sm:text-[11.5rem] md:text-[14rem] leading-none font-black whitespace-nowrap"
                      style={{ 
                        color: '#000',
                        filter: 'url(#clean-hollow-outline-3)',
                        fontFamily: numberFontFamily,
                        padding: '0.05em 0.1em',
                      }}
                      aria-hidden="true"
                    >
                      {currentChapterNumber}
                    </div>

                    {/* 2. Wave Fill Layer (Animated white water waves flowing inside the number) */}
                    <div 
                      className="relative text-[6.5rem] min-[360px]:text-[8rem] sm:text-[11.5rem] md:text-[14rem] leading-none font-black whitespace-nowrap chapter-number-wave"
                      style={{ 
                        fontFamily: numberFontFamily,
                        padding: '0.05em 0.1em',
                      }}
                    >
                      {currentChapterNumber}
                    </div>
                  </div>
                )}
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] relative z-10">
                  {result.reference}
                </h2>
                <div className="flex items-center justify-center gap-3 mt-3 relative z-10">
                  <span className="text-cyan-300 font-medium text-sm md:text-base drop-shadow-md">
                    {result.translation_name}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70 text-xs md:text-sm">
                    {result.verses.length} {result.verses.length === 1 ? 'versículo' : 'versículos'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-6 pr-2 sm:pr-4">
                {result.verses.map((verse: Verse, i: number) => {
                  const isFocused = focusedVerse === verse;
                  const isDimmed = focusedVerse && !isFocused;
                  
                  return (
                  <p 
                    data-verse-id={`${verse.book_name}-${verse.chapter}-${verse.verse}`}
                    key={i} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedVerse(isFocused ? null : verse);
                    }}
                    style={{
                      fontFamily: readingFontFamily,
                      fontSize: currentSizeOption.fontSizeRem,
                      lineHeight: currentLineHeightOption.value,
                    }}
                    className={`font-normal drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] cursor-pointer transition-all duration-300 rounded-lg p-3 -mx-3 ${
                      isFocused 
                        ? 'text-cyan-100 bg-white/10 scale-[1.02] relative z-[70] shadow-2xl ring-1 ring-cyan-400/30' 
                        : isDimmed
                        ? 'text-white/30 blur-[2px] relative z-[60]'
                        : 'text-white hover:text-cyan-100 hover:bg-white/5'
                    }`}
                  >
                    <sup className="text-cyan-200 font-bold mr-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none text-[0.7em] align-super">
                      {verse.verse}
                    </sup>
                    {verse.text}
                    {annotations && annotations[`${result.bookName} ${currentChapterNumber}:${verse.verse}`]?.isBookmarked && (
                      <Heart size={14} className="inline-block ml-3 mb-1 text-rose-400 fill-rose-400 opacity-80" />
                    )}
                    {annotations && annotations[`${result.bookName} ${currentChapterNumber}:${verse.verse}`]?.comment && (
                      <MessageSquare size={14} className="inline-block ml-2 mb-1 text-amber-300 opacity-80" />
                    )}
                  </p>
                  );
                })}
              </div>

              {/* Bottom chapter navigation */}
              {result.totalChapters && currentChapterNumber && (
                <div className={`pt-10 border-t border-white/15 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 transition-all duration-300 ${focusedVerse ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                  {/* Previous Chapter button */}
                  <button
                    onClick={() => currentChapterNumber > 1 && onSearch(`${result.bookName} ${currentChapterNumber - 1}`)}
                    disabled={currentChapterNumber <= 1}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                      currentChapterNumber <= 1
                        ? 'opacity-25 pointer-events-none border border-white/10 text-white/50 bg-black/10'
                        : uiStyle === 'dynamic'
                          ? 'bg-black/80 hover:bg-[#ff0066] border-2 border-white/80 text-white transform -skew-x-12'
                          : 'bg-black/25 hover:bg-black/45 border border-white/20 hover:border-cyan-300/50 text-white'
                    }`}
                    title={currentChapterNumber > 1 ? `Capítulo anterior: ${result.bookName} ${currentChapterNumber - 1}` : 'Primer capítulo'}
                  >
                    <ChevronLeft size={16} className={currentChapterNumber > 1 ? "text-cyan-300" : "text-white/40"} />
                    <span>{result.bookName} {Math.max(1, currentChapterNumber - 1)}</span>
                  </button>

                  {/* Mark as read button */}
                  {onToggleChapterCompleted && result.bookName && (
                    <button
                      onClick={() => onToggleChapterCompleted(result.bookName!, currentChapterNumber)}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                        isChapterCompleted
                          ? (uiStyle === 'dynamic'
                              ? 'bg-[#ffea29] text-black border-2 border-black font-black italic shadow-[3px_3px_0_rgba(0,0,0,0.5)] transform -skew-x-12'
                              : 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]')
                          : (uiStyle === 'dynamic'
                              ? 'bg-black/80 text-white/90 border-2 border-white/30 hover:border-[#ffea29] hover:text-[#ffea29] transform -skew-x-12'
                              : 'bg-black/25 hover:bg-black/45 text-white/90 border border-white/20 hover:border-white/40')
                      }`}
                    >
                      <Check size={16} className={isChapterCompleted ? (uiStyle === 'dynamic' ? 'text-black stroke-[3]' : 'text-emerald-300 stroke-[2.5]') : 'opacity-60'} />
                      <span>{isChapterCompleted ? 'Capítulo Leído ✓' : 'Marcar como Leído'}</span>
                    </button>
                  )}

                  {/* Next Chapter button */}
                  <button
                    onClick={() => currentChapterNumber < result.totalChapters && onSearch(`${result.bookName} ${currentChapterNumber + 1}`)}
                    disabled={currentChapterNumber >= result.totalChapters}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                      currentChapterNumber >= result.totalChapters
                        ? 'opacity-25 pointer-events-none border border-white/10 text-white/50 bg-black/10'
                        : uiStyle === 'dynamic'
                          ? 'bg-black/80 hover:bg-[#ff0066] border-2 border-white/80 text-white transform -skew-x-12'
                          : 'bg-black/25 hover:bg-black/45 border border-white/20 hover:border-cyan-300/50 text-white'
                    }`}
                    title={currentChapterNumber < result.totalChapters ? `Capítulo siguiente: ${result.bookName} ${currentChapterNumber + 1}` : 'Último capítulo'}
                  >
                    <span>{result.bookName} {Math.min(result.totalChapters, currentChapterNumber + 1)}</span>
                    <ChevronRight size={16} className={currentChapterNumber < result.totalChapters ? "text-cyan-300" : "text-white/40"} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Floating Focus Mode Bar */}
            <AnimatePresence>
        {focusedVerse && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[120] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col items-stretch max-w-[95vw] sm:max-w-[85vw] md:max-w-[600px] w-full min-w-[320px] ${
              uiStyle === 'dynamic' 
                ? 'bg-black/95 border-2 border-[#ff0066]/50 rounded-xl backdrop-blur-md' 
                : 'bg-black/30 backdrop-blur-md border border-white/20 rounded-[2rem]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
              
              {/* Verse Reference */}
              <div className={`flex items-center gap-2 pr-2 sm:pr-3 border-r ${uiStyle === 'dynamic' ? 'border-[#ff0066]/30' : 'border-white/15'}`}>
                <span className={`text-xs sm:text-sm whitespace-nowrap ${
                  uiStyle === 'dynamic' ? 'text-[#00e5ff] font-black uppercase tracking-wider' : 'text-cyan-200 font-semibold tracking-wide'
                }`}>
                  {focusedVerse.book_name} {focusedVerse.chapter}:{focusedVerse.verse}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                <button
                  type="button"
                  onClick={() => handleNavigateVerse('prev')}
                  disabled={focusedVerseIndex <= 0}
                  className={`p-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                    uiStyle === 'dynamic'
                      ? 'rounded-md border-2 bg-black hover:bg-[#ff0066]/20 border-white/10 hover:border-[#ff0066]/50 text-white'
                      : 'rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white'
                  }`}
                  title="Versículo anterior (↑ / ←)"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <button
                  type="button"
                  onClick={() => handleNavigateVerse('next')}
                  disabled={focusedVerseIndex >= currentVersesList.length - 1}
                  className={`p-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                    uiStyle === 'dynamic'
                      ? 'rounded-md border-2 bg-black hover:bg-[#ff0066]/20 border-white/10 hover:border-[#ff0066]/50 text-white'
                      : 'rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white'
                  }`}
                  title="Siguiente versículo (↓ / →)"
                >
                  <ChevronRight size={16} />
                </button>
                
                <div className={`h-6 w-px mx-1 ${uiStyle === 'dynamic' ? 'bg-[#ff0066]/30' : 'bg-white/15'}`} />

                <button
                  type="button"
                  onClick={() => onToggleBookmark && focusedVerse && onToggleBookmark(`${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}`)}
                  className={`p-2 transition-all active:scale-95 ${
                    uiStyle === 'dynamic'
                      ? `rounded-md border-2 ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.isBookmarked ? 'bg-[#ff0066]/20 text-[#ff0066] border-[#ff0066]' : 'bg-black hover:bg-[#ff0066]/20 border-white/10 hover:border-[#ff0066]/50 text-white/80'}`
                      : `rounded-full border ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.isBookmarked ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-black/30 hover:bg-black/50 text-white/90 border-white/10'}`
                  }`}
                  title="Favorito"
                >
                  <Heart size={16} className={annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.isBookmarked ? 'fill-current' : ''} />
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsEditingComment(!isEditingComment)}
                  className={`p-2 transition-all active:scale-95 ${
                    uiStyle === 'dynamic'
                      ? `rounded-md border-2 ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.comment ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]' : 'bg-black hover:bg-[#00e5ff]/20 border-white/10 hover:border-[#00e5ff]/50 text-white/80'}`
                      : `rounded-full border ${annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.comment ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-black/30 hover:bg-black/50 text-white/90 border-white/10'}`
                  }`}
                  title="Añadir nota"
                >
                  <MessageSquare size={16} className={annotations?.[focusedVerse ? `${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}` : '']?.comment ? 'fill-current' : ''} />
                </button>

                <button
                  type="button"
                  onClick={handleCopyFocusedVerse}
                  className={`flex items-center gap-1.5 px-3 py-1.5 transition-all active:scale-95 text-xs font-medium ${
                    uiStyle === 'dynamic'
                      ? 'rounded-md border-2 bg-black hover:bg-white/10 border-white/10 text-white/90'
                      : 'rounded-full border border-white/10 bg-black/30 hover:bg-black/50 text-white/90'
                  }`}
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

                <div className={`h-6 w-px mx-1 ${uiStyle === 'dynamic' ? 'bg-[#ff0066]/30' : 'bg-white/15'}`} />

                <button
                  type="button"
                  onClick={() => setFocusedVerse(null)}
                  className={`p-2 transition-all active:scale-95 font-bold ${
                    uiStyle === 'dynamic'
                      ? 'rounded-md bg-[#ff0066] hover:bg-[#ff0066]/80 text-white border-2 border-transparent'
                      : 'rounded-full bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                  }`}
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
                className={`w-full border-t mt-3 pt-3 flex flex-col sm:flex-row gap-2 ${
                  uiStyle === 'dynamic' ? 'border-[#ff0066]/30' : 'border-white/15'
                }`}
              >
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Añade tu comentario o reflexión sobre este pasaje..."
                  className={`flex-1 px-4 py-2 text-sm focus:outline-none resize-none h-[4.5rem] sm:h-12 transition-all ${
                    uiStyle === 'dynamic'
                      ? 'bg-[#111] border-2 border-white/10 focus:border-[#00e5ff] rounded-lg text-white placeholder-white/30 font-mono text-xs'
                      : 'bg-black/30 border border-white/10 focus:border-cyan-400/50 rounded-2xl text-white placeholder-white/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (onSaveComment && focusedVerse) {
                      onSaveComment(`${focusedVerse.book_name} ${focusedVerse.chapter}:${focusedVerse.verse}`, commentText);
                      setIsEditingComment(false);
                    }
                  }}
                  className={`px-5 py-2 text-sm font-semibold transition-all active:scale-95 ${
                    uiStyle === 'dynamic'
                      ? 'bg-[#00e5ff] hover:bg-[#00e5ff]/80 text-black rounded-lg border-2 border-transparent uppercase tracking-wider'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 rounded-2xl sm:rounded-full backdrop-blur-md'
                  }`}
                >
                  Guardar
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
