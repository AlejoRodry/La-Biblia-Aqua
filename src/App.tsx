/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, History, Sparkles, Settings, Sun, Moon, Sunrise, Sunset, BookOpen, Library, X, RotateCw, Type, Palette, Flame, BarChart2, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import WaterBackground, { WaterTheme } from './components/WaterBackground';
import PersonaBibleMenu from './components/PersonaBibleMenu';
import BibleResults from './components/BibleResults';
import SystemMenu from './components/SystemMenu';
import TypographyControl from './components/TypographyControl';
import ReadingGuideModal from './components/ReadingGuideModal';
import { FontSizeKey, LineHeightKey } from './lib/typography';
import { 
  loadReadingProgress, 
  recordChapterRead, 
  toggleChapterCompleted, 
  calculateStreak, 
  ReadingProgressData 
} from './lib/readingProgress';

import { searchBible, getTableOfContents, SearchResult } from './lib/bible';

const CURATED_PASSAGES_POOL = [
  'Juan 3:16',
  'Salmos 23:1',
  'Filipenses 4:13',
  'Jeremías 29:11',
  'Romanos 8:28',
  'Proverbios 3:5-6',
  'Isaías 40:31',
  'Mateo 6:33',
  'Josué 1:9',
  '1 Corintios 13:4-7',
  'Salmos 91:1-2',
  'Génesis 1:1-3',
  'Gálatas 5:22-23',
  'Hebreos 11:1',
  'Apocalipsis 21:4',
  'Salmos 121:1-2',
  'Juan 14:6',
  'Mateo 11:28-30',
  'Romanos 12:2',
  'Efesios 2:8-9',
  'Isaías 41:10',
  'Salmos 46:1',
  'Salmos 139:14',
  '2 Timoteo 1:7',
  '1 Pedro 5:7',
  'Santiago 1:5',
  'Miqueas 6:8',
  'Eclesiastés 3:1',
  'Habacuc 3:18-19',
  'Juan 10:10',
  'Colosenses 3:12-14',
  'Salmos 37:4-5',
  'Éxodo 14:14',
  'Mateo 5:14-16',
  'Pedro',
  'Jesús',
  'Amor',
  'Paz',
  'Gracia',
  'Fe',
  'Luz'
];

type EmotionTheme = {
  id: string;
  label: string;
  icon: string;
  classes: string;
  iconClass: string;
};

const EMOTION_THEMES: EmotionTheme[] = [
  { id: "Amor", label: "Amor", icon: "♥", classes: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-400/20 hover:border-rose-400/50 text-rose-100", iconClass: "text-rose-400" },
  { id: "Paz", label: "Paz", icon: "✧", classes: "bg-sky-500/10 hover:bg-sky-500/20 border-sky-400/20 hover:border-sky-400/50 text-sky-100", iconClass: "text-sky-400" },
  { id: "Fortaleza", label: "Fortaleza", icon: "✦", classes: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/20 hover:border-amber-400/50 text-amber-100", iconClass: "text-amber-400" },
  { id: "Esperanza", label: "Esperanza", icon: "☼", classes: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-400/20 hover:border-emerald-400/50 text-emerald-100", iconClass: "text-emerald-400" },
  { id: "Sanidad", label: "Sanidad", icon: "🌱", classes: "bg-teal-500/10 hover:bg-teal-500/20 border-teal-400/20 hover:border-teal-400/50 text-teal-100", iconClass: "text-teal-400" },
  { id: "Perdon", label: "Perdón", icon: "🕊", classes: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-400/20 hover:border-indigo-400/50 text-indigo-100", iconClass: "text-indigo-400" },
  { id: "Ansiedad", label: "Calma", icon: "☁", classes: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-400/20 hover:border-purple-400/50 text-purple-100", iconClass: "text-purple-400" },
  { id: "Sabiduria", label: "Sabiduría", icon: "💡", classes: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-400/20 hover:border-yellow-400/50 text-yellow-100", iconClass: "text-yellow-400" },
  { id: "Alegria", label: "Alegría", icon: "✨", classes: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-400/20 hover:border-fuchsia-400/50 text-fuchsia-100", iconClass: "text-fuchsia-400" },
];

function getRandomSelection(count = 5): string[] {
  const shuffled = [...CURATED_PASSAGES_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diveState, setDiveState] = useState<'idle' | 'diving' | 'emerging'>('idle');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [suggestedPassages, setSuggestedPassages] = useState<string[]>(() => getRandomSelection(5));
  const [activeEmotions, setActiveEmotions] = useState<EmotionTheme[]>([]);
  const [timeMode, setTimeMode] = useState<'auto' | WaterTheme>(() => (localStorage.getItem('bible_time_mode') as 'auto' | WaterTheme) || 'auto');
  const [activeTheme, setActiveTheme] = useState<WaterTheme>('night');
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [bgEnabled, setBgEnabled] = useState(() => localStorage.getItem('bible_bg_enabled') !== 'false');
  const [particlesEnabled, setParticlesEnabled] = useState(() => localStorage.getItem('bible_particles_enabled') !== 'false');
  const [uiStyle, setUiStyle] = useState<'serene' | 'dynamic'>(() => (localStorage.getItem('bible_ui_style') as 'serene' | 'dynamic') || 'serene');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReadingGuide, setShowReadingGuide] = useState(false);
  const [progressData, setProgressData] = useState<ReadingProgressData>(() => loadReadingProgress());
  const [lastRead, setLastRead] = useState<string | null>(() => {
    const p = loadReadingProgress();
    if (p.lastRead) return `${p.lastRead.bookName} ${p.lastRead.chapter}`;
    return localStorage.getItem('bible_last_read');
  });

  // Calculate & refresh streak status on launch
  useEffect(() => {
    setProgressData(prev => {
      const { currentStreak, bestStreak } = calculateStreak(prev);
      if (currentStreak !== prev.currentStreak || bestStreak !== prev.bestStreak) {
        return { ...prev, currentStreak, bestStreak };
      }
      return prev;
    });
  }, []);

  const [annotations, setAnnotations] = useState<Record<string, { isBookmarked?: boolean; comment?: string }>>(() => {
    try {
      const stored = localStorage.getItem('bible_annotations');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('bible_annotations', JSON.stringify(annotations));
  }, [annotations]);

  const handleToggleBookmark = (verseId: string) => {
    setAnnotations(prev => {
      const current = prev[verseId] || {};
      return {
        ...prev,
        [verseId]: { ...current, isBookmarked: !current.isBookmarked }
      };
    });
  };

  const handleSaveComment = (verseId: string, comment: string) => {
    setAnnotations(prev => {
      const current = prev[verseId] || {};
      const newComment = comment.trim();
      const updated = { ...current };
      if (newComment) {
        updated.comment = newComment;
      } else {
        delete updated.comment;
      }
      return {
        ...prev,
        [verseId]: updated
      };
    });
  };

  const [toc, setToc] = useState<{ name: string, chapters: number }[]>([]);

  const [readingFontFamily, setReadingFontFamily] = useState<string>(() => {
    return localStorage.getItem('bible_reading_font') || "'Lora', Georgia, serif";
  });

  const [readingFontSize, setReadingFontSize] = useState<FontSizeKey>(() => {
    return (localStorage.getItem('bible_reading_font_size') as FontSizeKey) || 'lg';
  });

  const [readingLineHeight, setReadingLineHeight] = useState<LineHeightKey>(() => {
    return (localStorage.getItem('bible_reading_line_height') as LineHeightKey) || 'relaxed';
  });

  const [numberFontFamily, setNumberFontFamily] = useState<string>(() => {
    return localStorage.getItem('bible_number_font') || 'system-ui, -apple-system, sans-serif';
  });

  useEffect(() => {
    localStorage.setItem('bible_reading_font', readingFontFamily);
  }, [readingFontFamily]);

  useEffect(() => {
    localStorage.setItem('bible_reading_font_size', readingFontSize);
  }, [readingFontSize]);

  useEffect(() => {
    localStorage.setItem('bible_reading_line_height', readingLineHeight);
  }, [readingLineHeight]);

  useEffect(() => {
    localStorage.setItem('bible_number_font', numberFontFamily);
  }, [numberFontFamily]);
  useEffect(() => {
    localStorage.setItem('bible_time_mode', timeMode);
  }, [timeMode]);
  useEffect(() => {
    localStorage.setItem('bible_bg_enabled', bgEnabled.toString());
  }, [bgEnabled]);
  useEffect(() => {
    localStorage.setItem('bible_particles_enabled', particlesEnabled.toString());
  }, [particlesEnabled]);
  useEffect(() => {
    localStorage.setItem('bible_ui_style', uiStyle);
  }, [uiStyle]);

  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(false);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);


  // Generate completely fresh random recommendations on every system start/mount
  useEffect(() => {
    setSuggestedPassages(getRandomSelection(5));
    setActiveEmotions([...EMOTION_THEMES].sort(() => 0.5 - Math.random()).slice(0, 3));
  }, []);

  const shuffleSuggestions = () => {
    setSuggestedPassages(getRandomSelection(5));
  };

  useEffect(() => {
    if (toc.length === 0) {
      getTableOfContents().then(setToc).catch(console.error);
    }
  }, [toc.length]);

  const handleToggleChapterCompleted = (bookName: string, chapter: number) => {
    setProgressData(prev => toggleChapterCompleted(prev, bookName, chapter));
  };

  useEffect(() => {
    const stored = localStorage.getItem('bible_recent_searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Update theme based on timeMode and real time
  useEffect(() => {
    if (timeMode !== 'auto') {
      setActiveTheme(timeMode);
      return;
    }
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) setActiveTheme('dawn');
    else if (hour >= 8 && hour < 17) setActiveTheme('day');
    else if (hour >= 17 && hour < 20) setActiveTheme('sunset');
    else setActiveTheme('night');
  }, [timeMode]);

  const handleSearch = async (e?: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = directQuery || query;
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setQuery(searchQuery);
    
    try {
      const data = await searchBible(searchQuery);
      
      // Update reading progress if it is a passage with chapters
      if (data.type === 'passage' && data.verses && data.verses.length > 0) {
        const firstVerse = data.verses[0];
        const bookName = firstVerse.book_name;
        const chapter = firstVerse.chapter;
        
        setProgressData(prev => recordChapterRead(prev, bookName, chapter));
        const formattedLast = `${bookName} ${chapter}`;
        setLastRead(formattedLast);
        localStorage.setItem('bible_last_read', formattedLast);
      }

      // Update recent searches
      const updated = [searchQuery, ...recentSearches.filter(h => h.toLowerCase() !== searchQuery.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('bible_recent_searches', JSON.stringify(updated));
      
      // Start the dive transition
      setDiveState('diving');
      
      setTimeout(() => {
        setResult(data);
        setDiveState('emerging');
        setLoading(false);
        setTimeout(() => setDiveState('idle'), 600);
      }, 500); // 500ms to let it cover the screen
    } catch (err: any) {
      setError(err.message);
      setResult(null);
      setLoading(false);
    }
  };

  const handleBack = () => {
    setDiveState('diving');
    setTimeout(() => {
      setResult(null);
      setQuery('');
      setDiveState('emerging');
      setTimeout(() => setDiveState('idle'), 600);
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-x-hidden">
      {/* SVG Filter for perfect text outline (subtracting interior) */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="true-outline" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="2"></feMorphology>
            <feFlood floodColor="rgba(255, 255, 255, 0.95)" result="WHITE"></feFlood>
            <feComposite in="WHITE" in2="DILATED" operator="in" result="OUTLINE_FILLED"></feComposite>
            <feComposite in="OUTLINE_FILLED" in2="SourceAlpha" operator="out" result="JUST_OUTLINE"></feComposite>
          </filter>
        </defs>
      </svg>

      <div className="fixed inset-0 z-[-1]">
        <WaterBackground theme={activeTheme} showBackground={bgEnabled} showParticles={particlesEnabled} />
      </div>
      
      {/* Vectorial Dive Overlay for Transitions */}
      <motion.div
        initial={{ y: '150vh' }}
        animate={
          diveState === 'idle' ? { y: '150vh', transition: { duration: 0 } } :
          diveState === 'diving' ? { y: '0vh', transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } } :
          { y: '-150vh', transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
        }
        className="fixed inset-0 z-50 pointer-events-none flex flex-col h-[100vh]"
      >
        <div className="absolute bottom-full left-0 w-full leading-none">
          <svg className="w-full h-24 md:h-48 text-white fill-current relative z-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
             <path d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,176C672,149,768,107,864,101.3C960,96,1056,128,1152,149.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          
          {/* Bubbles popping out of the wave */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-80"
              style={{
                width: 10 + (i % 3) * 10,
                height: 10 + (i % 3) * 10,
                left: `${10 + i * 11}%`,
                bottom: '10px'
              }}
              animate={{
                y: [0, -80 - (i % 4) * 20],
                x: [0, i % 2 === 0 ? 15 : -15],
                opacity: [0.8, 0]
              }}
              transition={{
                duration: 1 + (i % 2),
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
        
        <div className="w-full h-full bg-white relative">
          {/* Bubbles passing inside */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={`inner-${i}`}
              className="absolute bg-cyan-100 rounded-full opacity-40"
              style={{
                width: 20 + i * 15,
                height: 20 + i * 15,
                left: `${15 + i * 12}%`,
                top: `${20 + i * 10}%`
              }}
              animate={{
                y: [20, -20],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="absolute top-full left-0 w-full leading-none rotate-180">
          <svg className="w-full h-24 md:h-48 text-white fill-current relative z-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
             <path d="M0,160L48,149.3C96,139,192,117,288,117.3C384,117,480,139,576,170.7C672,203,768,245,864,240C960,235,1056,181,1152,144C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </motion.div>
      
      {/* App Content overlay */}
      <motion.div 
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
        className="relative z-10 w-full"
        style={{ display: sidebarOpen ? 'none' : 'block' }}
      >
        {/* Top Navigation Bar: Left (Back / Library) & Right (Streak / Settings) */}
        <div className="absolute top-3.5 sm:top-5 left-3 sm:left-6 z-40 flex items-center gap-2">
          {result && (
            <button 
              onClick={handleBack}
              className={`h-9 sm:h-10 flex items-center gap-1.5 px-3.5 sm:px-4 backdrop-blur-md transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 text-xs sm:text-sm font-semibold rounded-full ${
                uiStyle === 'dynamic'
                  ? 'bg-black/80 hover:bg-[#ff0066] border-2 border-white/80 text-white transform -skew-x-12'
                  : 'bg-black/25 hover:bg-black/45 border border-white/20 hover:border-white/40 text-white'
              }`}
              title="Volver a la búsqueda"
            >
              <ArrowLeft size={16} />
              <span>Buscar</span>
            </button>
          )}
          <button 
            onClick={() => setSidebarOpen(true)}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center backdrop-blur-md border rounded-full text-white transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 ${
              uiStyle === 'dynamic'
                ? 'bg-black/80 hover:bg-[#00e5ff] hover:text-black border-2 border-white/80'
                : 'bg-black/25 hover:bg-black/45 border-white/20 hover:border-white/40'
            }`}
            title="Libros y capítulos"
          >
            <Library size={18} />
          </button>
        </div>

        <SystemMenu
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onOpenReadingGuide={() => setShowReadingGuide(true)}
          timeMode={timeMode}
          setTimeMode={setTimeMode}
          activeTheme={activeTheme}
          bgEnabled={bgEnabled}
          setBgEnabled={setBgEnabled}
          particlesEnabled={particlesEnabled}
          setParticlesEnabled={setParticlesEnabled}
          readingFontFamily={readingFontFamily}
          setReadingFontFamily={setReadingFontFamily}
          readingFontSize={readingFontSize}
          setReadingFontSize={setReadingFontSize}
          readingLineHeight={readingLineHeight}
          setReadingLineHeight={setReadingLineHeight}
          numberFontFamily={numberFontFamily}
          setNumberFontFamily={setNumberFontFamily}
          uiStyle={uiStyle}
          setUiStyle={setUiStyle}
        />

        {/* Streak / Reading Guide Badge & Settings Toggle */}
        <div className="absolute top-3.5 sm:top-5 right-3 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
          {!isOnline && (
            <button
              onClick={() => setShowSettings(true)}
              className="h-9 sm:h-10 flex items-center gap-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-full text-amber-200 text-xs font-semibold backdrop-blur-md transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)] active:scale-95"
              title="Modo sin conexión activo - Pulsa para ver detalles"
            >
              <WifiOff size={13} />
              <span className="hidden min-[420px]:inline">Offline</span>
            </button>
          )}

          <button 
            onClick={() => setShowReadingGuide(true)}
            className={`h-9 sm:h-10 flex items-center gap-1.5 px-3.5 sm:px-4 backdrop-blur-md rounded-full border transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 text-xs sm:text-sm font-semibold ${
              uiStyle === 'dynamic'
                ? 'bg-black/80 hover:bg-[#e52b22] border-2 border-[#ffea29] text-[#ffea29] hover:text-white font-black italic -skew-x-12'
                : 'bg-black/25 hover:bg-black/45 border-white/20 hover:border-amber-400/50 text-white'
            }`}
            title="Guía de lectura, racha y estadísticas"
          >
            <Flame size={17} className={progressData.currentStreak > 0 ? (uiStyle === 'dynamic' ? 'text-[#ffea29] fill-[#ffea29]' : 'text-amber-400 fill-amber-400') : 'text-white/40'} />
            <span className="tracking-wide">
              {progressData.currentStreak} {progressData.currentStreak === 1 ? 'día' : 'días'}
            </span>
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center backdrop-blur-md border rounded-full text-white transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 ${
              showSettings 
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                : uiStyle === 'dynamic'
                  ? 'bg-black/80 hover:bg-[#00e5ff] hover:text-black border-2 border-white/80'
                  : 'border-white/20 hover:border-white/40 bg-black/25 hover:bg-black/45'
            }`}
            title="Ajustes de la aplicación"
          >
            <Settings size={18} className={showSettings ? 'rotate-90 transition-transform text-cyan-300' : 'transition-transform'} />
          </button>
        </div>

        <div className={`flex flex-col min-h-[100svh] items-center px-3.5 sm:px-6 md:px-12 ${!result ? 'justify-center py-12' : 'justify-start pt-12 sm:pt-14 pb-12'}`}>
          <motion.div 
            animate={!result ? { y: [0, -10, 0] } : { y: 0 }}
            transition={!result ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            className={`w-full max-w-2xl flex flex-col items-center justify-center ${!result ? 'min-h-[75vh] sm:min-h-[82vh] space-y-6 sm:space-y-8 my-auto' : 'space-y-6'}`}
          >
            {/* Header & Search Bar (Only shown when there are no results) */}
          {!result && (
            <>
              <div className="relative flex items-center justify-center my-2 sm:my-4 max-w-full overflow-visible">
                {/* 1. True Outline Layer (Solid text filtered down to just the 2px border, perfectly unified without overlaps) */}
                <h1 className={`absolute text-6xl min-[360px]:text-[4.2rem] min-[400px]:text-7xl sm:text-8xl md:text-9xl tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em] uppercase leading-[1.1] font-black whitespace-nowrap select-none ${uiStyle === 'dynamic' ? 'italic transform -skew-x-[10deg]' : ''}`}
                    style={{ 
                      color: 'white', /* Must be opaque to generate solid alpha mask */
                      filter: 'url(#true-outline)',
                      WebkitTextStroke: '0px', /* Ensure no stroke */
                      fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      padding: '0.05em 0.15em', /* Match CSS padding */
                    }}
                    aria-hidden="true">
                  BIBLIA
                </h1>
                
                {/* 2. Fill Layer (Wave animation inside transparent text) */}
                <h1 className={`relative text-6xl min-[360px]:text-[4.2rem] min-[400px]:text-7xl sm:text-8xl md:text-9xl tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em] title-outline font-black whitespace-nowrap select-none ${uiStyle === 'dynamic' ? 'italic transform -skew-x-[10deg]' : ''}`}>
                  BIBLIA
                </h1>
              </div>

              <div className="w-full flex flex-col space-y-4 sm:space-y-5">
                <form onSubmit={handleSearch} className="w-full relative group">
                    <input
                      type="text"
                      placeholder={`Buscar pasaje (p. ej. ${CURATED_PASSAGES_POOL[exampleIndex]})`}
                      className={`w-full pl-5 sm:pl-6 pr-14 sm:pr-16 py-3.5 sm:py-4 text-base sm:text-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${
                        uiStyle === 'dynamic' 
                          ? 'bg-black/60 border-b-4 border-cyan-400 font-bold italic transform -skew-x-6 rounded-none focus:bg-black/80' 
                          : 'bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl focus:bg-black/30'
                      }`}
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

                {/* Continue Last Read Chapter Button (Placed directly below Search Bar) */}
                {lastRead && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-center pt-0.5">
                    <button 
                      onClick={() => handleSearch(undefined, lastRead)}
                      className={`group flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border shadow-lg transition-all active:scale-95 ${
                        uiStyle === 'dynamic' 
                          ? 'bg-[#111] hover:bg-[#ff0066] border-[#ff0066]/50 text-white transform -skew-x-6' 
                          : 'bg-black/30 hover:bg-black/50 border-cyan-400/30 text-white backdrop-blur-md'
                      }`}
                    >
                      <BookOpen size={17} className={uiStyle === 'dynamic' ? 'text-white' : 'text-cyan-300'} />
                      <span className="font-semibold text-xs sm:text-sm">Continuar: {lastRead}</span>
                      <ChevronRight size={17} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {/* Quick Exploration (Action-oriented Pills) */}
                <div className="w-full flex flex-col items-center mt-4 sm:mt-6">
                  <span className="text-white/50 text-[11px] font-medium mb-3 uppercase tracking-widest text-center w-full">Descubrir:</span>
                  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5">
                    
                    {activeEmotions.map((emotion) => (
                      <button
                        key={emotion.id}
                        onClick={() => handleSearch(undefined, emotion.id)}
                        className={`group px-3.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md border rounded-full text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 active:scale-95 ${emotion.classes}`}
                      >
                        <span className={emotion.iconClass}>{emotion.icon}</span> {emotion.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

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

          {/* Results Area (Passage reader or Keyword Verse explorer) */}
          {result && !loading && (
            <BibleResults
              result={result}
              annotations={annotations}
              onToggleBookmark={handleToggleBookmark}
              onSaveComment={handleSaveComment}
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
                  ? !!progressData.completedChapters[`${result.bookName} ${result.verses[0].chapter}`]
                  : false
              }
              onToggleChapterCompleted={handleToggleChapterCompleted}
            />
          )}

        </motion.div>

        {/* History & Recommendations System (Scroll down) */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="w-full max-w-3xl mt-0 mb-8"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* History */}
              <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
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
                      className="text-xs text-white/50 hover:text-white/80 transition-colors"
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
                      className="w-full text-left px-4 py-3 bg-black/20 hover:bg-black/40 rounded-xl text-white text-sm transition-colors border border-white/10 hover:border-white/30 flex justify-between items-center group"
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
              <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center drop-shadow-md">
                    <Sparkles size={18} className="mr-2 text-amber-300" /> Recomendaciones
                  </h3>
                  <button
                    onClick={shuffleSuggestions}
                    className="text-xs text-cyan-300/80 hover:text-cyan-200 flex items-center gap-1 transition-colors"
                  >
                    <RotateCw size={12} /> Variar
                  </button>
                </div>
                <div className="space-y-2">
                  {suggestedPassages.slice(0, 5).map((item, idx) => (
                    <button
                      key={`${item}-${idx}`}
                      onClick={() => handleSearch(undefined, item)}
                      className="w-full text-left px-4 py-3 bg-black/20 hover:bg-black/40 rounded-xl text-white text-sm transition-colors border border-white/10 hover:border-white/30 flex justify-between items-center group"
                    >
                      <span>{item}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        </div>
      </motion.div>

      {/* Global Persona 3 Style Calendar & Library System */}
      <PersonaBibleMenu
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        toc={toc}
        currentBookName={result?.bookName}
        completedChapters={progressData.completedChapters}
        onSelectChapter={(book, chapter) => {
          handleSearch(undefined, `${book} ${chapter}`);
        }}
        uiStyle={uiStyle}
      />

      {/* Reading Guide, Streak & Statistics Modal */}
      <ReadingGuideModal
        isOpen={showReadingGuide}
        onClose={() => setShowReadingGuide(false)}
        progressData={progressData}
        setProgressData={setProgressData}
        toc={toc}
        onSelectChapter={(book, chapter) => {
          handleSearch(undefined, `${book} ${chapter}`);
        }}
        onToggleChapter={handleToggleChapterCompleted}
        uiStyle={uiStyle}
        activeTheme={activeTheme}
        bgEnabled={bgEnabled}
        particlesEnabled={particlesEnabled}
      />
    </div>
  );
}
