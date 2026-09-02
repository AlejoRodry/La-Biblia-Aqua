import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageSquare, ChevronRight, Search, Trash2 } from 'lucide-react';
import WaterBackground, { WaterTheme } from './WaterBackground';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  annotations: Record<string, { isBookmarked?: boolean; comment?: string }>;
  onSelectVerse: (reference: string) => void;
  onRemoveBookmark: (reference: string) => void;
  uiStyle: 'serene' | 'dynamic';
  activeTheme?: WaterTheme;
  bgEnabled?: boolean;
  particlesEnabled?: boolean;
}

export default function BookmarksModal({
  isOpen,
  onClose,
  annotations,
  onSelectVerse,
  onRemoveBookmark,
  uiStyle,
  activeTheme = 'night',
  bgEnabled = true,
  particlesEnabled = true,
}: BookmarksModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const bookmarkedVerses = useMemo(() => {
    return Object.entries(annotations)
      .filter(([_, data]) => data.isBookmarked)
      .map(([reference, data]) => ({ reference, ...data }));
  }, [annotations]);

  const commentedVerses = useMemo(() => {
    return Object.entries(annotations)
      .filter(([_, data]) => data.comment && data.comment.trim() !== '')
      .map(([reference, data]) => ({ reference, ...data }));
  }, [annotations]);

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'comments'>('bookmarks');

  const filteredItems = useMemo(() => {
    const source = activeTab === 'bookmarks' ? bookmarkedVerses : commentedVerses;
    if (!searchTerm.trim()) return source;
    const lowerSearch = searchTerm.toLowerCase();
    return source.filter(item => 
      item.reference.toLowerCase().includes(lowerSearch) || 
      (item.comment && item.comment.toLowerCase().includes(lowerSearch))
    );
  }, [bookmarkedVerses, commentedVerses, activeTab, searchTerm]);

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
            <h2 className={`text-3xl md:text-5xl uppercase tracking-widest flex items-center gap-4 ${
              uiStyle === 'dynamic' ? 'font-black italic text-[#ff0066] drop-shadow-[3px_4px_0_rgba(0,0,0,0.8)]' : 'font-light text-white/90 drop-shadow-md'
            }`}>
              <Heart size={uiStyle === 'dynamic' ? 36 : 40} className={uiStyle === 'dynamic' ? 'text-[#ff0066]' : 'text-rose-400'} /> 
              Mi Registro
            </h2>
            <div className={`h-1 rounded-full ${uiStyle === 'dynamic' ? 'w-32 bg-[#ff0066]' : 'w-24 bg-rose-400/50'}`} />
          </div>

          {/* Main Modal Container with smooth scroll mask */}
          <div className="relative z-20 w-full h-full pt-28 md:pt-32 pb-8 px-4 sm:px-6 md:px-12 flex justify-center items-stretch">
            <div className="w-full max-w-5xl h-full flex flex-col overflow-y-auto custom-scrollbar pr-2 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)] -my-4 py-6">
              
              {/* Tabs & Search Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4 shrink-0">
                <div className="flex gap-4 sm:gap-6 border-b border-white/10 pb-2">
                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`pb-2 text-base sm:text-lg transition-colors relative ${
                      activeTab === 'bookmarks' ? 'text-white font-medium' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Heart size={18} className={activeTab === 'bookmarks' ? 'text-rose-400 fill-rose-400' : ''} />
                      Favoritos ({bookmarkedVerses.length})
                    </span>
                    {activeTab === 'bookmarks' && (
                      <motion.div layoutId="activeTabIndicator" className={`absolute -bottom-[1px] left-0 right-0 h-1 ${uiStyle === 'dynamic' ? 'bg-[#ff0066]' : 'bg-rose-400'}`} />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`pb-2 text-base sm:text-lg transition-colors relative ${
                      activeTab === 'comments' ? 'text-white font-medium' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare size={18} className={activeTab === 'comments' ? 'text-amber-400 fill-amber-400' : ''} />
                      Notas ({commentedVerses.length})
                    </span>
                    {activeTab === 'comments' && (
                      <motion.div layoutId="activeTabIndicator" className={`absolute -bottom-[1px] left-0 right-0 h-1 ${uiStyle === 'dynamic' ? 'bg-[#ff0066]' : 'bg-amber-400'}`} />
                    )}
                  </button>
                </div>

                <div className="relative w-full md:w-80 shrink-0">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Buscar referencias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-black/40 backdrop-blur-md border text-white focus:outline-none transition-colors ${
                      uiStyle === 'dynamic'
                        ? 'border-white/20 focus:border-[#ff0066] rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)] focus:shadow-[4px_4px_0_rgba(255,0,102,0.5)] font-mono'
                        : 'border-white/10 focus:border-cyan-400/50 rounded-2xl'
                    }`}
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1">
                {filteredItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full min-h-[300px] text-center opacity-60"
                  >
                    {activeTab === 'bookmarks' ? (
                      <Heart size={64} className="mb-6 text-white/20" />
                    ) : (
                      <MessageSquare size={64} className="mb-6 text-white/20" />
                    )}
                    <h3 className={`text-white text-2xl mb-2 ${uiStyle === 'dynamic' ? 'font-black italic' : 'font-light'}`}>
                      {searchTerm ? 'No se encontraron resultados' : (activeTab === 'bookmarks' ? 'Aún no tienes favoritos' : 'Aún no tienes notas')}
                    </h3>
                    <p className="text-white/50 max-w-sm text-lg">
                      {searchTerm 
                        ? 'Intenta buscar con otros términos.'
                        : `Haz clic en el icono de ${activeTab === 'bookmarks' ? 'corazón' : 'comentario'} al leer un pasaje para guardarlo aquí.`}
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                    {filteredItems.map((item, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={item.reference}
                        className={`group flex items-start gap-3 p-5 sm:p-6 transition-all relative overflow-hidden ${
                          uiStyle === 'dynamic'
                            ? 'border-2 border-white/10 bg-black/60 hover:border-[#ff0066]/60 hover:bg-[#ff0066]/10 transform hover:-skew-x-2'
                            : 'border border-white/10 bg-black/30 backdrop-blur-md hover:border-rose-400/40 hover:bg-white/10 rounded-3xl'
                        }`}
                      >
                        <button
                          onClick={() => {
                            onSelectVerse(item.reference);
                            onClose();
                          }}
                          className="flex-1 text-left relative z-10"
                        >
                          <h4 className={`text-white text-xl sm:text-2xl flex items-center gap-3 mb-2 ${uiStyle === 'dynamic' ? 'font-black italic' : 'font-light'}`}>
                            {item.reference}
                            <ChevronRight size={18} className="text-white/30 group-hover:text-white/80 transition-colors group-hover:translate-x-1" />
                          </h4>
                          {activeTab === 'comments' && item.comment && (
                            <p className="text-white/80 text-base mt-3 p-4 bg-black/50 rounded-xl italic border-l-4 border-amber-400/50 shadow-inner leading-relaxed">
                              "{item.comment}"
                            </p>
                          )}
                        </button>
                        
                        <div className="flex flex-col gap-2 shrink-0 relative z-20 self-start">
                          {activeTab === 'bookmarks' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveBookmark(item.reference);
                              }}
                              className={`p-3 text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 transition-colors ${uiStyle === 'dynamic' ? 'rounded-none border border-transparent hover:border-rose-400/50' : 'rounded-full'}`}
                              title="Quitar de favoritos"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                        
                        {/* Decorative background element */}
                        {uiStyle === 'dynamic' && (
                          <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-10 pointer-events-none transition-opacity translate-x-1/4 translate-y-1/4">
                            {activeTab === 'bookmarks' ? <Heart size={120} /> : <MessageSquare size={120} />}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
