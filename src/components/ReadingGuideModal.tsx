import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Flame, 
  Trophy, 
  Target, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  Sparkles,
  BookmarkCheck,
  Compass,
  RotateCcw
} from 'lucide-react';
import { 
  ReadingProgressData, 
  setDailyGoal, 
  getWeekActivity, 
  getGlobalProgressStats,
  getTodayDateString
} from '../lib/readingProgress';
import WaterBackground, { WaterTheme } from './WaterBackground';

interface ReadingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressData: ReadingProgressData;
  setProgressData?: React.Dispatch<React.SetStateAction<ReadingProgressData>>;
  toc: { name: string; chapters: number }[];
  onSelectChapter: (book: string, chapter: number) => void;
  onToggleChapter?: (bookName: string, chapter: number) => void;
  uiStyle: 'serene' | 'dynamic';
  activeTheme?: WaterTheme;
  bgEnabled?: boolean;
  particlesEnabled?: boolean;
}

const OLD_TESTAMENT_COUNT = 39;

export default function ReadingGuideModal({
  isOpen,
  onClose,
  progressData,
  setProgressData,
  toc,
  onSelectChapter,
  onToggleChapter,
  uiStyle,
  activeTheme = 'night',
  bgEnabled = true,
  particlesEnabled = true,
}: ReadingGuideModalProps) {
  const todayStr = getTodayDateString();
  const todayCount = progressData.dailyHistory[todayStr] || 0;
  const isGoalMet = todayCount >= progressData.dailyGoal;
  const weekDays = useMemo(() => getWeekActivity(progressData.dailyHistory), [progressData.dailyHistory]);
  const stats = useMemo(() => getGlobalProgressStats(progressData.completedChapters, toc), [progressData.completedChapters, toc]);

  // Calculate OT vs NT progress
  const testamentsProgress = useMemo(() => {
    let otCompleted = 0;
    let ntCompleted = 0;

    toc.forEach((book, idx) => {
      for (let c = 1; c <= book.chapters; c++) {
        if (progressData.completedChapters[`${book.name} ${c}`]) {
          if (idx < OLD_TESTAMENT_COUNT) {
            otCompleted++;
          } else {
            ntCompleted++;
          }
        }
      }
    });

    return {
      otCompleted,
      otTotal: 929,
      otPercent: Number(((otCompleted / 929) * 100).toFixed(1)),
      ntCompleted,
      ntTotal: 260,
      ntPercent: Number(((ntCompleted / 260) * 100).toFixed(1)),
    };
  }, [progressData.completedChapters, toc]);

  // Suggested next chapter to read
  const nextReading = useMemo(() => {
    if (progressData.lastRead) {
      const { bookName, chapter } = progressData.lastRead;
      const currentBook = toc.find((b) => b.name === bookName);
      if (currentBook) {
        if (chapter < currentBook.chapters) {
          return { bookName, chapter: chapter + 1, isNextInBook: true };
        } else {
          // next book
          const bIdx = toc.findIndex((b) => b.name === bookName);
          if (bIdx >= 0 && bIdx < toc.length - 1) {
            return { bookName: toc[bIdx + 1].name, chapter: 1, isNextInBook: false };
          }
        }
      }
      return { bookName, chapter, isNextInBook: true };
    }
    return { bookName: 'Génesis', chapter: 1, isNextInBook: true };
  }, [progressData.lastRead, toc]);

  const handleGoalChange = (newGoal: number) => {
    setProgressData((prev) => setDailyGoal(prev, newGoal));
  };

  const handleContinueReading = (book: string, chapter: number) => {
    onSelectChapter(book, chapter);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] overflow-hidden font-sans bg-black"
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, delay: 0.2 }}
            onClick={onClose}
            className={`absolute top-6 right-6 md:top-8 md:right-8 z-[250] flex items-center justify-center transition-all ${
              uiStyle === 'dynamic'
                ? 'w-12 h-12 md:w-14 md:h-14 bg-[#111] hover:bg-[#ff0066] text-white border-2 md:border-4 border-white transform -skew-x-12 shadow-[4px_4px_0_rgba(0,0,0,0.3)] active:translate-y-1'
                : 'w-12 h-12 md:w-14 md:h-14 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:border-white/50 text-white shadow-lg'
            }`}
          >
            <X size={28} className={uiStyle === 'dynamic' ? 'skew-x-[12deg]' : ''} />
          </motion.button>

          {/* Water Background */}
          <div className="absolute inset-0 opacity-80">
            <WaterBackground theme={activeTheme} showBackground={bgEnabled} showParticles={particlesEnabled} />
          </div>

          {/* Header */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50 pointer-events-auto flex flex-col gap-2">
            <h2 className={`text-3xl md:text-5xl uppercase tracking-widest ${
              uiStyle === 'dynamic' ? 'font-black italic text-[#81e6e6] drop-shadow-[3px_4px_0_rgba(0,0,0,0.8)]' : 'font-light text-white/90 drop-shadow-md'
            }`}>
              Mi Progreso
            </h2>
            <div className={`h-1 rounded-full ${uiStyle === 'dynamic' ? 'w-24 bg-[#ffea29]' : 'w-16 bg-white/30'}`} />
          </div>

          {/* Main Modal Container with smooth scroll mask */}
          <div className="relative z-20 w-full h-full pt-28 md:pt-32 pb-8 px-4 sm:px-6 md:px-12 flex justify-center items-stretch">
            <div className="w-full max-w-5xl h-full overflow-y-auto custom-scrollbar pr-2 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)] -my-4 py-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
                
                {/* LEFT COLUMN: Resume Card & Daily Streak (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* 1. CONTINUAR LECTURA HERO CARD */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`relative overflow-hidden p-6 transition-all ${
                      uiStyle === 'dynamic'
                        ? 'bg-[#0f172a]/95 border-4 border-[#ffea29] shadow-[8px_8px_0_rgba(0,0,0,0.6)] transform -skew-x-2'
                        : 'bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    <div className={uiStyle === 'dynamic' ? 'transform skew-x-2' : ''}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-xs uppercase tracking-widest flex items-center gap-1.5 ${
                          uiStyle === 'dynamic' ? 'font-black text-[#ffea29]' : 'text-cyan-300 font-semibold'
                        }`}>
                          <Compass size={16} /> Continuar donde te quedaste
                        </span>
                        {progressData.lastRead && (
                          <span className="text-[11px] text-white/50">
                            Última sesión
                          </span>
                        )}
                      </div>

                      {progressData.lastRead ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className={`text-3xl sm:text-4xl text-white ${
                              uiStyle === 'dynamic' ? 'font-black italic tracking-tighter' : 'font-light tracking-wide'
                            }`}>
                              {progressData.lastRead.bookName} {progressData.lastRead.chapter}
                            </h3>
                            <p className="text-white/70 text-xs sm:text-sm mt-1">
                              Siguiente sugerido: <strong className="text-cyan-200">{nextReading.bookName} {nextReading.chapter}</strong>
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleContinueReading(progressData.lastRead!.bookName, progressData.lastRead!.chapter)}
                              className={`px-5 py-3 flex items-center gap-2 text-sm transition-all active:scale-95 whitespace-nowrap ${
                                uiStyle === 'dynamic'
                                  ? 'bg-[#ff0066] hover:bg-[#ff0066]/80 text-white font-black italic uppercase shadow-[4px_4px_0_rgba(0,0,0,0.4)]'
                                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-white font-medium rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                              }`}
                            >
                              <BookOpen size={16} /> Reanudar Cap. {progressData.lastRead.chapter}
                            </button>

                            {nextReading.chapter !== progressData.lastRead.chapter && (
                              <button
                                onClick={() => handleContinueReading(nextReading.bookName, nextReading.chapter)}
                                className={`px-4 py-3 flex items-center gap-1.5 text-xs transition-all active:scale-95 ${
                                  uiStyle === 'dynamic'
                                    ? 'bg-[#ffea29] hover:bg-[#ffe500] text-black font-black italic uppercase shadow-[4px_4px_0_rgba(0,0,0,0.4)]'
                                    : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-2xl'
                                }`}
                              >
                                Siguiente <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className={`text-2xl sm:text-3xl text-white ${
                              uiStyle === 'dynamic' ? 'font-black italic' : 'font-light'
                            }`}>
                              Comienza tu primer capítulo
                            </h3>
                            <p className="text-white/60 text-xs sm:text-sm mt-1">
                              Empieza hoy con Génesis 1 o el Evangelio de Juan.
                            </p>
                          </div>
                          <button
                            onClick={() => handleContinueReading('Génesis', 1)}
                            className={`px-5 py-3 flex items-center gap-2 text-sm transition-all active:scale-95 ${
                              uiStyle === 'dynamic'
                                ? 'bg-[#ff0066] text-white font-black italic uppercase shadow-[4px_4px_0_rgba(0,0,0,0.4)]'
                                : 'bg-cyan-400 text-black font-bold rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                            }`}
                          >
                            <BookOpen size={16} /> Leer Génesis 1
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* 2. RACHA DIARIA & META DE HOY */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`p-6 transition-all ${
                      uiStyle === 'dynamic'
                        ? 'bg-[#0f172a]/95 border-4 border-[#81e6e6] shadow-[8px_8px_0_rgba(0,0,0,0.6)] transform -skew-x-2'
                        : 'bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    <div className={uiStyle === 'dynamic' ? 'transform skew-x-2' : ''}>
                      {/* Streak Header Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        
                        {/* Current Streak */}
                        <div className={`p-4 transition-all ${
                          uiStyle === 'dynamic'
                            ? 'bg-black/60 border-2 border-[#ff0066]/50'
                            : 'bg-white/5 border border-white/10 rounded-2xl'
                        }`}>
                          <div className="flex items-center gap-2 text-amber-400 mb-1">
                            <Flame size={20} className="fill-amber-400 animate-pulse" />
                            <span className="text-xs uppercase tracking-wider font-semibold">Racha Actual</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-3xl sm:text-4xl text-white ${
                              uiStyle === 'dynamic' ? 'font-black italic' : 'font-light'
                            }`}>
                              {progressData.currentStreak}
                            </span>
                            <span className="text-xs text-white/60">
                              {progressData.currentStreak === 1 ? 'día' : 'días'}
                            </span>
                          </div>
                        </div>

                        {/* Best Streak */}
                        <div className={`p-4 transition-all ${
                          uiStyle === 'dynamic'
                            ? 'bg-black/60 border-2 border-[#ffea29]/50'
                            : 'bg-white/5 border border-white/10 rounded-2xl'
                        }`}>
                          <div className="flex items-center gap-2 text-yellow-300 mb-1">
                            <Trophy size={18} />
                            <span className="text-xs uppercase tracking-wider font-semibold">Récord</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-3xl sm:text-4xl text-white ${
                              uiStyle === 'dynamic' ? 'font-black italic' : 'font-light'
                            }`}>
                              {progressData.bestStreak}
                            </span>
                            <span className="text-xs text-white/60">
                              {progressData.bestStreak === 1 ? 'día' : 'días'}
                            </span>
                          </div>
                        </div>

                        {/* Today's Goal Status */}
                        <div className={`col-span-2 sm:col-span-1 p-4 transition-all ${
                          isGoalMet
                            ? (uiStyle === 'dynamic' ? 'bg-[#ff0066]/20 border-2 border-[#ff0066]' : 'bg-emerald-500/15 border border-emerald-400/40 rounded-2xl')
                            : (uiStyle === 'dynamic' ? 'bg-black/60 border-2 border-white/20' : 'bg-white/5 border border-white/10 rounded-2xl')
                        }`}>
                          <div className={`flex items-center gap-2 mb-1 ${isGoalMet ? 'text-emerald-300' : 'text-cyan-300'}`}>
                            <Target size={18} />
                            <span className="text-xs uppercase tracking-wider font-semibold">Meta de Hoy</span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-3xl sm:text-4xl ${isGoalMet ? 'text-emerald-300 font-bold' : 'text-white font-light'}`}>
                              {todayCount}
                            </span>
                            <span className="text-xs text-white/60">
                              / {progressData.dailyGoal} cap.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Week Activity Visualizer (Last 7 Days) */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-xs text-white/70 uppercase tracking-wider mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-cyan-300" /> Actividad de los últimos 7 días
                          </span>
                          <span className="text-[11px] text-white/50">
                            {isGoalMet ? '¡Meta diaria alcanzada hoy! 🎉' : 'Lee al menos 1 capítulo hoy'}
                          </span>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {weekDays.map((day) => {
                            const isCompleted = day.count >= progressData.dailyGoal;
                            const hasSomeRead = day.count > 0;

                            return (
                              <div
                                key={day.dateStr}
                                className={`flex flex-col items-center p-2.5 transition-all text-center ${
                                  day.isToday
                                    ? (uiStyle === 'dynamic' ? 'bg-[#81e6e6]/20 border-2 border-[#81e6e6]' : 'bg-white/15 border border-white/40 rounded-xl')
                                    : (uiStyle === 'dynamic' ? 'bg-black/40 border border-white/10' : 'bg-white/5 border border-white/10 rounded-xl')
                                }`}
                              >
                                <span className="text-[11px] text-white/60 uppercase font-medium mb-1">
                                  {day.dayName}
                                </span>
                                
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold my-1 transition-all ${
                                  isCompleted
                                    ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                                    : hasSomeRead
                                    ? 'bg-cyan-500/40 text-cyan-200 border border-cyan-400/40'
                                    : 'bg-white/5 text-white/30'
                                }`}>
                                  {isCompleted ? (
                                    <Flame size={16} className="fill-black" />
                                  ) : hasSomeRead ? (
                                    day.count
                                  ) : (
                                    '·'
                                  )}
                                </div>

                                <span className="text-[10px] text-white/40">
                                  {day.count} {day.count === 1 ? 'cap' : 'caps'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Daily Goal Adjuster */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
                        <span className="text-xs text-white/70">
                          Ajustar objetivo diario:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 5].map((g) => (
                            <button
                              key={g}
                              onClick={() => handleGoalChange(g)}
                              className={`px-3 py-1 text-xs transition-all ${
                                progressData.dailyGoal === g
                                  ? (uiStyle === 'dynamic' ? 'bg-[#ffea29] text-black font-black' : 'bg-cyan-400 text-black font-bold rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.5)]')
                                  : (uiStyle === 'dynamic' ? 'bg-black/40 text-white/70 hover:text-white border border-white/20' : 'bg-white/5 hover:bg-white/10 text-white/70 rounded-lg border border-white/10')
                              }`}
                            >
                              {g} {g === 1 ? 'cap./día' : 'caps./día'}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>

                </div>

                {/* RIGHT COLUMN: Total Bible Progress & Statistics (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* 3. PROGRESO GLOBAL DE LA BIBLIA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`p-6 transition-all ${
                      uiStyle === 'dynamic'
                        ? 'bg-[#0f172a]/95 border-4 border-white/80 shadow-[8px_8px_0_rgba(0,0,0,0.6)] transform -skew-x-2'
                        : 'bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    <div className={uiStyle === 'dynamic' ? 'transform skew-x-2' : ''}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs uppercase tracking-widest flex items-center gap-1.5 ${
                          uiStyle === 'dynamic' ? 'font-black text-[#81e6e6]' : 'text-cyan-300 font-semibold'
                        }`}>
                          <BarChart3 size={16} /> Progreso Total de la Biblia
                        </span>
                        <span className={`text-2xl text-white ${
                          uiStyle === 'dynamic' ? 'font-black italic' : 'font-light'
                        }`}>
                          {stats.percentage}%
                        </span>
                      </div>

                      {/* Main Progress Bar */}
                      <div className="w-full h-4 bg-black/40 rounded-full border border-white/15 p-0.5 mb-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(stats.percentage, 1.5)}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full transition-all ${
                            uiStyle === 'dynamic'
                              ? 'bg-gradient-to-r from-[#ff0066] to-[#ffea29]'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                          }`}
                        />
                      </div>

                      {/* Detailed Counter Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <span className="text-[11px] text-white/60 uppercase block mb-0.5">Capítulos Leídos</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{stats.totalCompleted}</span>
                            <span className="text-xs text-white/50">/ 1,189</span>
                          </div>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <span className="text-[11px] text-white/60 uppercase block mb-0.5">Libros Completos</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{stats.completedBooks}</span>
                            <span className="text-xs text-white/50">/ 66</span>
                          </div>
                        </div>
                      </div>

                      {/* Testaments Breakdown */}
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        <div>
                          <div className="flex justify-between text-xs text-white/80 mb-1">
                            <span>Antiguo Testamento</span>
                            <span className="font-semibold text-cyan-200">
                              {testamentsProgress.otCompleted} / {testamentsProgress.otTotal} ({testamentsProgress.otPercent}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-black/40 rounded-full border border-white/10 overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${testamentsProgress.otPercent}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-white/80 mb-1">
                            <span>Nuevo Testamento</span>
                            <span className="font-semibold text-amber-300">
                              {testamentsProgress.ntCompleted} / {testamentsProgress.ntTotal} ({testamentsProgress.ntPercent}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-black/40 rounded-full border border-white/10 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${testamentsProgress.ntPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>

                  {/* 4. GUÍA DE LECTURA / CONSEJO INSPIRACIONAL */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`p-5 transition-all ${
                      uiStyle === 'dynamic'
                        ? 'bg-black/60 border-2 border-white/20'
                        : 'bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl mt-0.5">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Constancia y Hábito</h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                          Leyendo solo <strong>3 capítulos diarios</strong> puedes completar toda la Biblia en menos de un año. ¡Cada versículo suma a tu crecimiento espiritual!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                </div>

              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
