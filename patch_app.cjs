const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add persistence to state
code = code.replace(
  "const [timeMode, setTimeMode] = useState<'auto' | WaterTheme>('auto');",
  "const [timeMode, setTimeMode] = useState<'auto' | WaterTheme>(() => (localStorage.getItem('bible_time_mode') as 'auto' | WaterTheme) || 'auto');"
);
code = code.replace(
  "const [bgEnabled, setBgEnabled] = useState(true);",
  "const [bgEnabled, setBgEnabled] = useState(() => localStorage.getItem('bible_bg_enabled') !== 'false');"
);
code = code.replace(
  "const [particlesEnabled, setParticlesEnabled] = useState(true);",
  "const [particlesEnabled, setParticlesEnabled] = useState(() => localStorage.getItem('bible_particles_enabled') !== 'false');"
);
code = code.replace(
  "const [uiStyle, setUiStyle] = useState<'serene' | 'dynamic'>('serene');",
  "const [uiStyle, setUiStyle] = useState<'serene' | 'dynamic'>(() => (localStorage.getItem('bible_ui_style') as 'serene' | 'dynamic') || 'serene');"
);

// 2. Add last read state
code = code.replace(
  "const [sidebarOpen, setSidebarOpen] = useState(false);",
  "const [sidebarOpen, setSidebarOpen] = useState(false);\n  const [lastRead, setLastRead] = useState<string | null>(() => localStorage.getItem('bible_last_read'));"
);

// 3. Add effect to sync to localStorage
const effectsToAdd = `
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
`;

code = code.replace(
  "  useEffect(() => {\n    localStorage.setItem('bible_number_font', numberFontFamily);\n  }, [numberFontFamily]);",
  "  useEffect(() => {\n    localStorage.setItem('bible_number_font', numberFontFamily);\n  }, [numberFontFamily]);" + effectsToAdd
);

// 4. Update handleSearch to save last read
code = code.replace(
  "      setResult(resultData);",
  "      setResult(resultData);\n      if (resultData && resultData.type === 'passage') {\n        const readQuery = `${resultData.bookName} ${resultData.verses[0]?.chapter || ''}`.trim();\n        setLastRead(readQuery);\n        localStorage.setItem('bible_last_read', readQuery);\n      }"
);

// 5. Render "Continue reading" button
const continueReadingBtn = `
              {lastRead && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-center mb-4">
                  <button 
                    onClick={() => handleSearch(undefined, lastRead)}
                    className={\`group flex items-center gap-2 px-6 py-2 rounded-full border shadow-lg transition-all active:scale-95 \${
                      uiStyle === 'dynamic' 
                        ? 'bg-[#111] hover:bg-[#ff0066] border-[#ff0066]/50 text-white transform -skew-x-6' 
                        : 'bg-black/30 hover:bg-black/50 border-cyan-400/30 text-white backdrop-blur-md'
                    }\`}
                  >
                    <BookOpen size={16} className={uiStyle === 'dynamic' ? 'text-white' : 'text-cyan-300'} />
                    <span className="font-semibold text-sm">Continuar: {lastRead}</span>
                    <ChevronRight size={16} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
`;

code = code.replace(
  "<form onSubmit={handleSearch} className=\"w-full relative group\">",
  continueReadingBtn + "\n                <form onSubmit={handleSearch} className=\"w-full relative group\">"
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched successfully');
