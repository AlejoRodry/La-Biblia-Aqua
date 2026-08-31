import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Moon, Sunrise, Sunset, Palette, Type, X, ChevronLeft, Wifi, WifiOff, CheckCircle2, Download, Smartphone, HardDrive, RefreshCw } from 'lucide-react';
import TypographyControl from './TypographyControl';
import WaterBackground, { WaterTheme } from './WaterBackground';
import { FontSizeKey, LineHeightKey } from '../lib/typography';
import { getOfflineStatus, saveBibleToIndexedDB, promptPWAInstall, subscribeToInstallPrompt } from '../lib/offlineBible';

interface SystemMenuProps {
  isOpen: boolean;
  onClose: () => void;
  timeMode: 'auto' | WaterTheme;
  setTimeMode: (mode: 'auto' | WaterTheme) => void;
  activeTheme: WaterTheme;
  bgEnabled: boolean;
  setBgEnabled: (enabled: boolean) => void;
  particlesEnabled: boolean;
  setParticlesEnabled: (enabled: boolean) => void;
  readingFontFamily: string;
  setReadingFontFamily: (font: string) => void;
  readingFontSize: FontSizeKey;
  setReadingFontSize: (size: FontSizeKey) => void;
  readingLineHeight: LineHeightKey;
  setReadingLineHeight: (height: LineHeightKey) => void;
  numberFontFamily: string;
  setNumberFontFamily: (font: string) => void;
  uiStyle: 'serene' | 'dynamic';
  setUiStyle: (style: 'serene' | 'dynamic') => void;
  onOpenReadingGuide?: () => void;
}

export default function SystemMenu({
  isOpen,
  onClose,
  timeMode,
  setTimeMode,
  activeTheme,
  bgEnabled,
  setBgEnabled,
  particlesEnabled,
  setParticlesEnabled,
  readingFontFamily,
  setReadingFontFamily,
  readingFontSize,
  setReadingFontSize,
  readingLineHeight,
  setReadingLineHeight,
  numberFontFamily,
  setNumberFontFamily,
  uiStyle,
  setUiStyle,
  onOpenReadingGuide,
}: SystemMenuProps) {
  const [screen, setScreen] = useState<'main' | 'typography' | 'visual' | 'offline'>('main');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineStatus, setOfflineStatus] = useState<{ isCached: boolean; meta: any }>({ isCached: false, meta: null });
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Check initial offline cache status
    getOfflineStatus().then(setOfflineStatus).catch(() => {});

    // Listen to network status
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Subscribe to PWA install prompt
    const unsubscribeInstall = subscribeToInstallPrompt(setCanInstall);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      unsubscribeInstall();
    };
  }, []);

  const handleSyncOfflineBible = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/bible');
      if (!res.ok) throw new Error('No se pudo descargar de la red');
      const data = await res.json();
      await saveBibleToIndexedDB(data);
      const status = await getOfflineStatus();
      setOfflineStatus(status);
      setSyncFeedback('¡Biblia completa guardada en el dispositivo para usar sin internet!');
    } catch (e: any) {
      setSyncFeedback('No se pudo conectar a la red para actualizar. Si estás offline, tu copia guardada sigue funcionando.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  const handleInstallApp = async () => {
    const res = await promptPWAInstall();
    if (res === 'accepted') {
      setSyncFeedback('¡Instalación completada!');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setScreen('main'), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const MenuButton = ({ text, onClick, offset, hoverPolygon }: { text: string, onClick: () => void, offset: string, hoverPolygon: string }) => (
    <motion.button
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`group relative transition-colors duration-200 ${offset} ${uiStyle === 'dynamic' ? 'text-[#81e6e6] hover:text-[#e52b22] font-black italic uppercase text-4xl sm:text-5xl md:text-7xl tracking-tighter' : 'text-white/80 hover:text-white font-light text-3xl sm:text-4xl md:text-5xl tracking-widest'}`}
    >
      <span className={`relative z-10 ${uiStyle === 'dynamic' ? 'drop-shadow-[3px_4px_0_rgba(0,0,40,0.6)]' : 'drop-shadow-lg'}`}>{text}</span>
      {/* Polígono de fondo al hacer hover estilo Persona, o fondo redondeado para sereno */}
      {uiStyle === 'dynamic' ? (
        <div
          className="absolute inset-y-[-10%] inset-x-[-10%] bg-[#e0e0e0] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 shadow-[8px_8px_0_rgba(0,0,0,0.2)]"
          style={{ clipPath: hoverPolygon }}
        />
      ) : (
        <div className="absolute inset-y-[-20%] inset-x-[-15%] bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 backdrop-blur-md border border-white/20" />
      )}
    </motion.button>
  );

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
          {/* Global Close Button (Consistent with PersonaBibleMenu) */}
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, delay: 0.2 }}
            onClick={onClose} 
            className={`absolute top-6 right-6 md:top-8 md:right-8 z-[250] flex items-center justify-center transition-all ${
              uiStyle === 'dynamic' 
                ? 'w-12 h-12 md:w-14 md:h-14 bg-[#111] hover:bg-[#ff0066] text-white border-2 md:border-4 border-white transform -skew-x-12 shadow-[4px_4px_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-[2px_2px_0_rgba(0,0,0,0.3)]' 
                : 'w-12 h-12 md:w-14 md:h-14 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:border-white/50 text-white shadow-lg'
            }`}
          >
            <X size={28} className={uiStyle === 'dynamic' ? 'skew-x-[12deg]' : ''} />
          </motion.button>
          {/* Base opaque background to block main App UI + isolated WaterBackground */}
          <div className="absolute inset-0 opacity-80">
            <WaterBackground theme={activeTheme} showBackground={bgEnabled} showParticles={particlesEnabled} />
          </div>

          {uiStyle === 'dynamic' ? (
            <>
              {/* Capa 2: Máscara gris geométrica con recorte circular (Dinámico) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="absolute top-0 right-0 w-[220vh] h-[220vh] rounded-full translate-x-1/2 -translate-y-1/2"
                  style={{
                    boxShadow: '0 0 0 200vw #e0e0e0', // Fondo gris infinito
                  }}
                >
                  {/* Texto curvo dibujado en el cuadrante visible */}
                  <motion.svg 
                    viewBox="0 0 100 100" 
                    className="absolute inset-0 w-full h-full overflow-visible"
                    initial={{ opacity: 0, rotate: 15 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
                  >
                    <defs>
                      <path id="text-curve" d="M -6 50 A 56 56 0 0 0 50 106" fill="none" />
                    </defs>
                    <text className="text-[6px] md:text-[7.5px] font-black italic fill-[#1a1a1a] tracking-[0.4em] uppercase opacity-90 drop-shadow-sm">
                      <textPath href="#text-curve" startOffset="34%" textAnchor="middle">
                        {screen === 'main' ? 'AJUSTES' : screen === 'typography' ? 'TIPOGRAFÍA' : screen === 'visual' ? 'EFECTOS' : 'OFFLINE'}
                      </textPath>
                    </text>
                  </motion.svg>

                  {/* Sombra interior para dar profundidad al agujero */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] pointer-events-none" />
                </motion.div>
              </div>

              {/* Detalles dinámicos (Fragmentos de cristal / confeti estilo Persona) */}
              <div className="absolute top-[75%] left-[45%] md:left-[55%] w-10 h-10 bg-[#e52b22] pointer-events-none drop-shadow-lg" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: 'rotate(45deg)' }} />
              <div className="absolute top-[70%] left-[50%] md:left-[60%] w-5 h-5 bg-[#81e6e6] pointer-events-none drop-shadow-lg" style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)', transform: 'rotate(-20deg)' }} />
              <div className="absolute top-[25%] left-[50%] md:left-[65%] w-8 h-8 bg-black pointer-events-none opacity-40" style={{ clipPath: 'polygon(20% 0%, 100% 20%, 80% 100%, 0% 80%)', transform: 'rotate(15deg)' }} />
            </>
          ) : (
            <>
              {/* Serene Glassmorphism Background Overlay */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0 z-10 bg-black/20 backdrop-blur-md pointer-events-auto"
              >
                <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50 pointer-events-auto flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl md:text-5xl font-light text-white/90 tracking-widest uppercase drop-shadow-md">
                      {screen === 'main' ? 'Ajustes' : screen === 'typography' ? 'Tipografía' : screen === 'visual' ? 'Efectos' : 'Sin Internet'}
                    </h2>
                  </div>
                  <div className="w-16 h-1 bg-white/30 rounded-full ml-1 md:ml-3"></div>
                </div>
              </motion.div>
            </>
          )}

          {/* Capa 4: Contenido interactivo */}
          <div className="relative z-20 w-full h-full">

            <AnimatePresence mode="wait">
              {/* MENÚ PRINCIPAL */}
              {screen === 'main' && (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-4 sm:gap-6 ${uiStyle === 'dynamic' ? 'right-0 pr-4 md:pr-12 items-end transform -skew-x-[15deg]' : 'left-1/2 -translate-x-1/2 items-center'}`}
                >
                  <MenuButton 
                    text="MI PROGRESO" 
                    onClick={() => {
                      if (onOpenReadingGuide) {
                        onClose();
                        onOpenReadingGuide();
                      }
                    }} 
                    offset={uiStyle === "dynamic" ? "mr-0" : ""} 
                    hoverPolygon="polygon(0 0, 100% 15%, 95% 100%, 5% 85%)" 
                  />
                  <MenuButton 
                    text="TIPOGRAFÍA" 
                    onClick={() => setScreen('typography')} 
                    offset={uiStyle === "dynamic" ? "mr-4 sm:mr-8" : ""} 
                    hoverPolygon="polygon(0 20%, 100% 0, 95% 100%, 5% 80%)" 
                  />
                  <MenuButton 
                    text="EFECTOS" 
                    onClick={() => setScreen('visual')} 
                    offset={uiStyle === "dynamic" ? "mr-8 sm:mr-14" : ""} 
                    hoverPolygon="polygon(5% 0, 100% 10%, 90% 100%, 0 90%)" 
                  />
                  <MenuButton 
                    text="SIN INTERNET" 
                    onClick={() => setScreen('offline')} 
                    offset={uiStyle === "dynamic" ? "mr-12 sm:mr-20" : ""} 
                    hoverPolygon="polygon(0 10%, 100% 0, 95% 90%, 5% 100%)" 
                  />
                </motion.div>
              )}

              {/* PANEL DE TIPOGRAFÍA */}
              {screen === 'typography' && (
                <motion.div
                  key="typography"
                  initial={{ opacity: 0, x: 100, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  animate={{ opacity: 1, x: 0, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  exit={{ opacity: 0, x: 100, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`absolute flex flex-col ${uiStyle === 'dynamic' ? 'top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] w-[90vw] md:w-[450px] max-h-[90vh] p-6 bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'top-[110px] md:top-[130px] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'}`}
                >
                  {/* Des-sesgar el contenido interno si es dinámico */}
                  <div className={`flex flex-col h-full ${uiStyle === 'dynamic' ? 'transform skew-x-[15deg]' : ''}`}>
                    {uiStyle === 'dynamic' && (
                      <div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-4 shrink-0">
                        <h2 className="text-3xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Tipografía</h2>
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-4 py-2 font-black italic uppercase skew-x-[-15deg] hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-lg"
                        >
                          <span className="block skew-x-[15deg]">Volver</span>
                        </button>
                      </div>
                    )}

                    <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)] -my-4 py-4">
                      <TypographyControl
                        layout={uiStyle === 'dynamic' ? 'vertical' : 'grid'}
                        readingFontFamily={readingFontFamily}
                        setReadingFontFamily={setReadingFontFamily}
                        readingFontSize={readingFontSize}
                        setReadingFontSize={setReadingFontSize}
                        readingLineHeight={readingLineHeight}
                        setReadingLineHeight={setReadingLineHeight}
                        numberFontFamily={numberFontFamily}
                        setNumberFontFamily={setNumberFontFamily}
                        showNumberFont={true}
                        showPreview={true}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PANEL DE EFECTOS */}
              {screen === 'visual' && (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0, x: 100, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  animate={{ opacity: 1, x: 0, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  exit={{ opacity: 0, x: 100, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`absolute flex flex-col ${uiStyle === 'dynamic' ? 'top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] w-[90vw] md:w-[450px] max-h-[90vh] p-6 bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'top-[110px] md:top-[130px] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'}`}
                >
                  <div className={`flex flex-col h-full ${uiStyle === 'dynamic' ? 'transform skew-x-[15deg]' : ''}`}>
                    {uiStyle === 'dynamic' && (
                      <div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-4 shrink-0">
                        <h2 className="text-3xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Efectos</h2>
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-4 py-2 font-black italic uppercase skew-x-[-15deg] hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-lg"
                        >
                          <span className="block skew-x-[15deg]">Volver</span>
                        </button>
                      </div>
                    )}

                    <div className={`overflow-y-auto custom-scrollbar pr-2 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)] -my-4 py-4 ${uiStyle === 'dynamic' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'}`}>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className={`text-sm uppercase tracking-widest ${uiStyle === 'dynamic' ? 'font-black italic text-[#81e6e6]/80' : 'font-medium text-white/50'}`}>
                            Personalidad Visual
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setUiStyle('serene')}
                              className={`flex flex-col items-center justify-center p-4 text-sm transition-all group ${
                                uiStyle === 'dynamic' ? 'border-2 skew-x-[-10deg]' : 'border rounded-xl'
                              } ${
                                uiStyle === 'serene' 
                                  ? 'bg-white/20 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                  : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30'
                              }`}
                            >
                              <div className={`flex flex-col items-center gap-2 ${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''}`}>
                                <Sparkles size={24} className={uiStyle === 'serene' ? 'text-white' : 'text-white/50 group-hover:text-white transition-colors'} />
                                <span className="font-light tracking-widest uppercase text-base">Sereno</span>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setUiStyle('dynamic')}
                              className={`flex flex-col items-center justify-center p-4 text-sm transition-all group ${
                                uiStyle === 'dynamic' ? 'border-2 skew-x-[-10deg]' : 'border rounded-xl'
                              } ${
                                uiStyle === 'dynamic' 
                                  ? 'bg-[#81e6e6]/25 border-[#81e6e6] text-[#81e6e6] shadow-[0_0_15px_rgba(129,230,230,0.3)]' 
                                  : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30'
                              }`}
                            >
                              <div className={`flex flex-col items-center gap-2 ${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''}`}>
                                <Palette size={24} className={uiStyle === 'dynamic' ? 'text-[#81e6e6]' : 'text-white/50 group-hover:text-white transition-colors'} />
                                <span className="font-black italic tracking-tighter uppercase text-base">Dinámico</span>
                              </div>
                            </button>
                          </div>
                        </div>

                        <div className={`space-y-3 ${uiStyle === 'dynamic' ? 'pt-4 border-t-2 border-white/10' : ''}`}>
                          <div className={`text-sm uppercase tracking-widest ${uiStyle === 'dynamic' ? 'font-black italic text-[#81e6e6]/80' : 'font-medium text-white/50'}`}>
                            Elementos
                          </div>
                          <label className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group ${
                            uiStyle === 'dynamic' ? 'bg-black/40 hover:bg-black/60 border-2 border-transparent hover:border-white/20 skew-x-[-10deg] text-white/90' : 'bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/30 rounded-xl text-white/90'
                          }`}>
                            <span className={uiStyle === 'dynamic' ? 'skew-x-[10deg] font-black italic uppercase tracking-wide' : 'font-light tracking-widest uppercase'}>Agua Animada</span>
                            <input 
                              type="checkbox" 
                              checked={bgEnabled} 
                              onChange={() => setBgEnabled(!bgEnabled)}
                              className={`accent-[#e52b22] w-5 h-5 cursor-pointer ${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''}`}
                            />
                          </label>
                          <label className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group ${
                            uiStyle === 'dynamic' ? 'bg-black/40 hover:bg-black/60 border-2 border-transparent hover:border-white/20 skew-x-[-10deg] text-white/90' : 'bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/30 rounded-xl text-white/90'
                          }`}>
                            <span className={uiStyle === 'dynamic' ? 'skew-x-[10deg] font-black italic uppercase tracking-wide' : 'font-light tracking-widest uppercase'}>Partículas</span>
                            <input 
                              type="checkbox" 
                              checked={particlesEnabled} 
                              onChange={() => setParticlesEnabled(!particlesEnabled)}
                              className={`accent-[#e52b22] w-5 h-5 cursor-pointer ${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''}`}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className={`text-sm uppercase tracking-widest ${uiStyle === 'dynamic' ? 'font-black italic text-[#81e6e6]/80' : 'font-medium text-white/50'}`}>
                          Tono del Fondo
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: 'auto', label: 'Hora Local', icon: Sparkles },
                            { id: 'dawn', label: 'Amanecer', icon: Sunrise },
                            { id: 'day', label: 'Día', icon: Sun },
                            { id: 'sunset', label: 'Atardecer', icon: Sunset },
                            { id: 'night', label: 'Noche', icon: Moon },
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setTimeMode(mode.id as 'auto' | WaterTheme)}
                              className={`flex items-center space-x-3 w-full px-4 py-3 text-sm transition-all group ${
                                uiStyle === 'dynamic' ? 'border-2 skew-x-[-10deg]' : 'border rounded-xl'
                              } ${
                                timeMode === mode.id 
                                  ? (uiStyle === 'dynamic' ? 'bg-[#81e6e6]/20 border-[#81e6e6] text-white shadow-[0_0_15px_rgba(129,230,230,0.3)]' : 'bg-white/15 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]')
                                  : (uiStyle === 'dynamic' ? 'bg-black/40 hover:bg-black/80 border-transparent text-white/70 hover:text-white hover:border-[#81e6e6]/50' : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30')
                              }`}
                            >
                              <div className={`flex items-center space-x-3 w-full ${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''}`}>
                                <mode.icon size={20} className={timeMode === mode.id ? (uiStyle === 'dynamic' ? 'text-[#81e6e6]' : 'text-white') : (uiStyle === 'dynamic' ? 'text-white/50 group-hover:text-[#81e6e6] transition-colors' : 'text-white/50 group-hover:text-white transition-colors')} />
                                <span className={uiStyle === 'dynamic' ? 'font-black italic tracking-wider uppercase text-base' : 'font-light tracking-widest uppercase text-base'}>{mode.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PANEL DE MODO SIN INTERNET (OFFLINE) */}
              {screen === 'offline' && (
                <motion.div
                  key="offline"
                  initial={{ opacity: 0, x: 100, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  animate={{ opacity: 1, x: 0, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  exit={{ opacity: 0, x: 100, skewX: uiStyle === 'dynamic' ? -15 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`absolute flex flex-col ${uiStyle === 'dynamic' ? 'top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] w-[92vw] md:w-[480px] max-h-[90vh] p-6 bg-blue-950/95 border-4 border-[#81e6e6] rounded-2xl shadow-[15px_15px_0_rgba(0,0,0,0.6)]' : 'top-[110px] md:top-[130px] left-6 right-6 md:left-12 md:right-12 bottom-6 md:bottom-12'}`}
                >
                  <div className={`flex flex-col h-full ${uiStyle === 'dynamic' ? 'transform skew-x-[15deg]' : ''}`}>
                    {uiStyle === 'dynamic' && (
                      <div className="flex items-center justify-between mb-5 border-b-2 border-white/20 pb-4 shrink-0">
                        <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Sin Internet (Offline)</h2>
                        <button 
                          onClick={() => setScreen('main')} 
                          className="bg-[#e52b22] text-white px-4 py-2 font-black italic uppercase skew-x-[-15deg] hover:bg-[#e0e0e0] hover:text-[#e52b22] transition-colors shadow-lg shrink-0 text-sm"
                        >
                          <span className="block skew-x-[15deg]">Volver</span>
                        </button>
                      </div>
                    )}

                    <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-4 [mask-image:linear-gradient(to_bottom,transparent,black_15px,black_calc(100%-15px),transparent)] -my-3 py-3">
                      {/* Estado de conectividad actual */}
                      <div className={`p-4 transition-all ${
                        uiStyle === 'dynamic' ? 'bg-black/50 border-2 skew-x-[-10deg]' : 'rounded-xl border'
                      } ${
                        isOnline 
                          ? (uiStyle === 'dynamic' ? 'border-emerald-400/80 bg-emerald-950/40 text-emerald-200' : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200')
                          : (uiStyle === 'dynamic' ? 'border-amber-400/80 bg-amber-950/40 text-amber-200' : 'border-amber-500/40 bg-amber-950/30 text-amber-200')
                      }`}>
                        <div className={`flex items-start gap-3.5 ${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''}`}>
                          <div className={`p-2 rounded-lg shrink-0 ${isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {isOnline ? <Wifi size={22} /> : <WifiOff size={22} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base uppercase ${uiStyle === 'dynamic' ? 'font-black italic tracking-wide' : 'font-semibold tracking-wider text-white'}`}>
                                {isOnline ? 'Conexión a Internet Activa' : 'Modo Sin Conexión (Offline)'}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">
                              {isOnline 
                                ? 'Tu dispositivo tiene internet y la Biblia está sincronizada localmente para cuando la necesites sin conexión.'
                                : 'Estás desconectado o en modo avión. Puedes buscar y leer cualquier libro o versículo con total normalidad.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tarjeta de Almacenamiento Local de la Biblia */}
                      <div className={`p-4 transition-all ${
                        uiStyle === 'dynamic' ? 'bg-black/40 border-2 border-white/20 skew-x-[-10deg]' : 'rounded-xl border border-white/15 bg-black/20'
                      }`}>
                        <div className={`${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''} space-y-3`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <HardDrive size={20} className={uiStyle === 'dynamic' ? 'text-[#81e6e6]' : 'text-blue-300'} />
                              <span className={`text-sm uppercase tracking-wide ${uiStyle === 'dynamic' ? 'font-black italic text-white' : 'font-semibold text-white/90'}`}>
                                Base de Datos Local
                              </span>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium">
                              <CheckCircle2 size={13} />
                              {offlineStatus.isCached ? 'Guardada (~4.8 MB)' : 'Lista (~4.8 MB)'}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                            Contiene los 66 libros completos (Antiguo y Nuevo Testamento) con sus 1.189 capítulos y 31.102 versículos almacenados directamente en la memoria interna de tu dispositivo.
                          </p>

                          {syncFeedback && (
                            <div className="text-xs p-2.5 rounded bg-blue-500/20 border border-blue-400/40 text-blue-200">
                              {syncFeedback}
                            </div>
                          )}

                          <button
                            onClick={handleSyncOfflineBible}
                            disabled={isSyncing}
                            className={`w-full py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all font-semibold ${
                              uiStyle === 'dynamic'
                                ? 'bg-[#81e6e6] hover:bg-[#ffea29] text-black font-black italic uppercase -skew-x-6 active:scale-95'
                                : 'bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg text-white active:scale-95'
                            } disabled:opacity-50`}
                          >
                            <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
                            <span>{isSyncing ? 'Guardando copia local...' : 'Verificar / Actualizar Copia Local'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Tarjeta de Aplicación Android (PWA) */}
                      <div className={`p-4 transition-all ${
                        uiStyle === 'dynamic' ? 'bg-black/40 border-2 border-white/20 skew-x-[-10deg]' : 'rounded-xl border border-white/15 bg-black/20'
                      }`}>
                        <div className={`${uiStyle === 'dynamic' ? 'skew-x-[10deg]' : ''} space-y-3`}>
                          <div className="flex items-center gap-3">
                            <img src="./icon-192.png" alt="Icono de La Biblia" className="w-10 h-10 rounded-xl shadow-md border border-white/20 shrink-0" referrerPolicy="no-referrer" />
                            <div>
                              <span className={`text-sm uppercase tracking-wide block ${uiStyle === 'dynamic' ? 'font-black italic text-white' : 'font-semibold text-white/90'}`}>
                                Instalar en Android
                              </span>
                              <span className="text-[11px] text-white/50 block">Acceso rápido con icono acuático</span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                            Puedes guardar la Biblia como una aplicación en la pantalla de tu celular para abrirla a pantalla completa sin barra de navegador:
                          </p>

                          {canInstall ? (
                            <button
                              onClick={handleInstallApp}
                              className={`w-full py-3 px-4 text-sm flex items-center justify-center gap-2 transition-all ${
                                uiStyle === 'dynamic'
                                  ? 'bg-[#e52b22] hover:bg-[#ff0066] text-white font-black italic uppercase -skew-x-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-0.5'
                                  : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-lg text-amber-200 active:scale-95'
                              }`}
                            >
                              <Smartphone size={18} />
                              <span>Instalar Aplicación en Celular</span>
                            </button>
                          ) : (
                            <div className="bg-black/30 p-3 rounded-lg border border-white/10 space-y-1.5 text-xs text-white/80">
                              <p className="font-semibold text-white/95">Instrucciones para Android:</p>
                              <p>1. Toca los tres puntos (⋮) en la esquina superior de Chrome.</p>
                              <p>2. Selecciona <span className="text-[#81e6e6] font-semibold">"Instalar aplicación"</span> o <span className="text-[#81e6e6] font-semibold">"Agregar a pantalla principal"</span>.</p>
                              <p>3. ¡Listo! Tendrás el icono de la Biblia en tu teléfono para abrirla con o sin internet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
