export interface FontOption {
  id: string;
  label: string;
  description: string;
  category: 'serif' | 'sans' | 'display' | 'mono';
}

export const READING_FONTS: FontOption[] = [
  { id: "'Lora', Georgia, serif", label: 'Lora', description: 'Clásica Literaria', category: 'serif' },
  { id: "'Merriweather', serif", label: 'Merriweather', description: 'Lectura Confortable', category: 'serif' },
  { id: "'Cormorant Garamond', Garamond, serif", label: 'Garamond', description: 'Elegancia Bíblica', category: 'serif' },
  { id: "'Inter', system-ui, sans-serif", label: 'Inter', description: 'Moderna y Limpia', category: 'sans' },
  { id: "'Montserrat', sans-serif", label: 'Montserrat', description: 'Estilo Persona', category: 'sans' },
  { id: "'Cinzel', serif", label: 'Cinzel', description: 'Solemne y Sagrada', category: 'display' },
  { id: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", label: 'Sistema', description: 'Nativo del Dispositivo', category: 'sans' },
  { id: "ui-monospace, 'Courier New', monospace", label: 'Mono', description: 'Monoespaciada', category: 'mono' },
];

export const NUMBER_FONTS: FontOption[] = [
  { id: "system-ui, -apple-system, sans-serif", label: 'Sistema', description: 'Limpio y Preciso', category: 'sans' },
  { id: "'Cinzel', serif", label: 'Cinzel', description: 'Romano / Monumental', category: 'display' },
  { id: "'Montserrat', sans-serif", label: 'Montserrat', description: 'Persona 3 Style', category: 'sans' },
  { id: "ui-serif, Georgia, Cambria, serif", label: 'Elegante', description: 'Serif Tradicional', category: 'serif' },
  { id: "ui-monospace, monospace", label: 'Monoespaciado', description: 'Digital / Terminal', category: 'mono' },
];

export type FontSizeKey = 'sm' | 'base' | 'lg' | 'xl' | '2xl';

export interface FontSizeOption {
  key: FontSizeKey;
  label: string;
  tag: string;
  passageClass: string;
  searchClass: string;
  sizePx: string;
  fontSizeRem: string;
}

export const FONT_SIZES: FontSizeOption[] = [
  { key: 'sm', label: 'Compacto', tag: '16px', passageClass: 'text-base sm:text-lg', searchClass: 'text-base', sizePx: '16px', fontSizeRem: '1rem' },
  { key: 'base', label: 'Normal', tag: '18px', passageClass: 'text-lg sm:text-xl', searchClass: 'text-lg', sizePx: '18px', fontSizeRem: '1.125rem' },
  { key: 'lg', label: 'Grande', tag: '22px', passageClass: 'text-xl sm:text-2xl', searchClass: 'text-xl', sizePx: '22px', fontSizeRem: '1.375rem' },
  { key: 'xl', label: 'Muy Grande', tag: '26px', passageClass: 'text-2xl sm:text-3xl', searchClass: 'text-2xl', sizePx: '26px', fontSizeRem: '1.625rem' },
  { key: '2xl', label: 'Gigante', tag: '32px', passageClass: 'text-3xl sm:text-4xl', searchClass: 'text-2xl sm:text-3xl', sizePx: '32px', fontSizeRem: '2rem' },
];

export type LineHeightKey = 'normal' | 'relaxed' | 'loose';

export interface LineHeightOption {
  key: LineHeightKey;
  label: string;
  value: string;
}

export const LINE_HEIGHTS: LineHeightOption[] = [
  { key: 'normal', label: 'Normal', value: '1.6' },
  { key: 'relaxed', label: 'Cómodo', value: '1.85' },
  { key: 'loose', label: 'Amplio', value: '2.15' },
];
