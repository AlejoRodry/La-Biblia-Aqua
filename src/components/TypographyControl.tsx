import React from 'react';
import { Type, Check, Minus, Plus } from 'lucide-react';
import {
  READING_FONTS,
  NUMBER_FONTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  FontSizeKey,
  LineHeightKey
} from '../lib/typography';

interface TypographyControlProps {
  readingFontFamily: string;
  setReadingFontFamily: (font: string) => void;
  readingFontSize: FontSizeKey;
  setReadingFontSize: (size: FontSizeKey) => void;
  readingLineHeight: LineHeightKey;
  setReadingLineHeight: (height: LineHeightKey) => void;
  numberFontFamily?: string;
  setNumberFontFamily?: (font: string) => void;
  showNumberFont?: boolean;
  showPreview?: boolean;
  layout?: 'vertical' | 'grid';
  uiStyle?: 'dynamic' | 'serene';
}

export default function TypographyControl({
  readingFontFamily,
  setReadingFontFamily,
  readingFontSize,
  setReadingFontSize,
  readingLineHeight,
  setReadingLineHeight,
  numberFontFamily,
  setNumberFontFamily,
  showNumberFont = true,
  showPreview = true,
  layout = 'vertical',
  uiStyle = 'serene',
}: TypographyControlProps) {
  const currentSizeIndex = FONT_SIZES.findIndex(f => f.key === readingFontSize);
  const currentSize = FONT_SIZES[currentSizeIndex] || FONT_SIZES[2];
  const currentHeight = LINE_HEIGHTS.find(h => h.key === readingLineHeight) || LINE_HEIGHTS[1];

  const handleDecreaseSize = () => {
    if (currentSizeIndex > 0) {
      setReadingFontSize(FONT_SIZES[currentSizeIndex - 1].key);
    }
  };

  const handleIncreaseSize = () => {
    if (currentSizeIndex < FONT_SIZES.length - 1) {
      setReadingFontSize(FONT_SIZES[currentSizeIndex + 1].key);
    }
  };

  const renderSize = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-xs md:text-sm uppercase tracking-widest inline-block px-4 py-1.5 ${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic' : 'font-medium text-white/50'}`}><span className={uiStyle === 'dynamic' ? 'block skew-x-[15deg]' : ''}>
          Tamaño de Letra</span></span>
        <span className="text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 text-[10px] tracking-wider uppercase font-medium">
          {currentSize.label}
        </span>
      </div>
      <div className={`flex items-center gap-1.5 p-1.5 border ${uiStyle === 'dynamic' ? 'bg-[#111] border-[3px] border-[#333]  shadow-[4px_4px_0_rgba(0,0,0,0.8)]' : 'bg-black/20 rounded-2xl border-white/10'}`}>
        <button
          type="button"
          disabled={currentSizeIndex === 0}
          onClick={handleDecreaseSize}
          className={`p-3 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all active:scale-95 flex items-center justify-center shrink-0 ${uiStyle === 'dynamic' ? '' : 'rounded-xl'}`}
        >
          <Minus size={16} />
        </button>
        <div className="flex-1 grid grid-cols-5 gap-1">
          {FONT_SIZES.map((size) => {
            const isSelected = readingFontSize === size.key;
            return (
              <button
                key={size.key}
                type="button"
                onClick={() => setReadingFontSize(size.key)}
                className={`py-2 px-1 text-xs transition-all text-center flex flex-col items-center justify-center ${uiStyle === 'dynamic' ? '' : 'rounded-xl'} ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-md scale-105'
                    : 'text-white/50 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <span className="text-[11px]">{size.tag}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={currentSizeIndex === FONT_SIZES.length - 1}
          onClick={handleIncreaseSize}
          className={`p-3 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all active:scale-95 flex items-center justify-center shrink-0 ${uiStyle === 'dynamic' ? '' : 'rounded-xl'}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );

  const renderType = () => (
    <div className="space-y-3">
      <div className={`text-xs md:text-sm uppercase tracking-widest inline-block px-4 py-1.5 mb-4 ${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic' : 'font-medium text-white/50'}`}><span className={uiStyle === 'dynamic' ? 'block skew-x-[15deg]' : ''}>
        Familia Tipográfica</span>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${layout === "grid" ? "" : "overflow-y-auto pr-1 custom-scrollbar max-h-56"}`}>
        {READING_FONTS.map((font) => {
          const isSelected = readingFontFamily === font.id;
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => setReadingFontFamily(font.id)}
              className={`text-left p-5 md:p-6 transition-all border flex items-center justify-between group ${uiStyle === 'dynamic' ? 'transform -skew-x-[15deg]' : 'rounded-2xl'} ${
                isSelected
                  ? 'bg-white/15 border-white/40 text-white shadow-lg backdrop-blur-md'
                  : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-lg md:text-xl tracking-wide truncate" style={{ fontFamily: font.id }}>
                  {font.label}
                </div>
                <div className={`text-xs md:text-sm mt-1 transition-colors ${isSelected ? (uiStyle === 'dynamic' ? 'text-[#81e6e6]/70' : 'text-white/70') : 'text-white/40 group-hover:text-white/60'}`}>
                  {font.description}
                </div>
              </div>
              {isSelected && (
                <span className={`shrink-0 p-1 ${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black' : 'bg-white text-black rounded-full'} shadow-sm`}>
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSpacing = () => (
    <div className="space-y-3">
      <div className={`text-xs md:text-sm uppercase tracking-widest inline-block px-4 py-1.5 mb-4 ${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic' : 'font-medium text-white/50'}`}><span className={uiStyle === 'dynamic' ? 'block skew-x-[15deg]' : ''}>
        Espaciado entre Líneas</span>
        </div>
      <div className="grid grid-cols-3 gap-1.5 bg-black/20 p-1.5 rounded-2xl border border-white/10">
        {LINE_HEIGHTS.map((height) => {
          const isSelected = readingLineHeight === height.key;
          return (
            <button
              key={height.key}
              type="button"
              onClick={() => setReadingLineHeight(height.key)}
              className={`py-2 px-2 rounded-xl text-xs transition-all text-center ${
                isSelected
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/10 font-medium'
              }`}
            >
              {height.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderNumber = () => (
    <div className="space-y-3 pt-4 border-t border-white/10">
      <div className={`text-xs md:text-sm uppercase tracking-widest inline-block px-4 py-1.5 mb-4 ${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic' : 'font-medium text-white/50'}`}><span className={uiStyle === 'dynamic' ? 'block skew-x-[15deg]' : ''}>
        Números de Capítulo</span>
        </div>
      <div className="grid grid-cols-2 gap-2">
        {NUMBER_FONTS.map((font) => {
          const isSelected = numberFontFamily === font.id;
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => setNumberFontFamily && setNumberFontFamily(font.id)}
              className={`text-left p-3 rounded-xl transition-all border flex-col items-start ${
                isSelected
                  ? 'bg-white/15 border-white/40 text-white shadow-md backdrop-blur-md'
                  : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <span style={{ fontFamily: font.id }} className="block text-xl md:text-2xl mb-0.5">
                {font.label} (12)
              </span>
              <span className={`text-[10px] md:text-xs block mt-1 ${isSelected ? 'text-white/60' : 'text-white/40'}`}>
                {font.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="p-5 bg-black/20 border border-white/10 rounded-3xl shadow-inner mt-4">
      <div className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-3">
        Muestra
      </div>
      <p
        className="text-white/90 transition-all font-medium"
        style={{
          fontFamily: readingFontFamily,
          fontSize: currentSize.fontSizeRem,
          lineHeight: currentHeight.value,
        }}
      >
        <sup className="text-white/50 font-bold mr-2 text-[0.7em]">16</sup>
        Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito...
      </p>
    </div>
  );

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start pb-10">
        <div className="space-y-8 flex flex-col">
          {renderSize()}
          {renderSpacing()}
          {showPreview && renderPreview()}
        </div>
        <div className="space-y-8 flex flex-col">
          {renderType()}
          {showNumberFont && numberFontFamily && setNumberFontFamily && renderNumber()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {renderSize()}
      {renderType()}
      {renderSpacing()}
      {showNumberFont && numberFontFamily && setNumberFontFamily && renderNumber()}
      {showPreview && renderPreview()}
    </div>
  );
}
