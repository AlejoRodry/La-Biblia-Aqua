const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add annotations state
const stateCode = `
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
      return {
        ...prev,
        [verseId]: { ...current, comment }
      };
    });
  };
`;

appCode = appCode.replace(
  "const [lastRead, setLastRead] = useState<string | null>(() => localStorage.getItem('bible_last_read'));",
  "const [lastRead, setLastRead] = useState<string | null>(() => localStorage.getItem('bible_last_read'));\n" + stateCode
);

// 2. Pass props to BibleResults
appCode = appCode.replace(
  "<BibleResults\n              result={result}",
  "<BibleResults\n              result={result}\n              annotations={annotations}\n              onToggleBookmark={handleToggleBookmark}\n              onSaveComment={handleSaveComment}"
);

fs.writeFileSync('src/App.tsx', appCode);

// Patch BibleResults.tsx
let resultsCode = fs.readFileSync('src/components/BibleResults.tsx', 'utf8');

// 1. Add imports
resultsCode = resultsCode.replace(
  "import { ArrowLeft, BookOpen, ChevronRight, Filter, Sparkles, ChevronLeft, BookCheck, Search, X, Type, Copy, Check } from 'lucide-react';",
  "import { ArrowLeft, BookOpen, ChevronRight, Filter, Sparkles, ChevronLeft, BookCheck, Search, X, Type, Copy, Check, Heart, MessageSquare } from 'lucide-react';"
);

// 2. Add Props
resultsCode = resultsCode.replace(
  "uiStyle?: 'serene' | 'dynamic';",
  "uiStyle?: 'serene' | 'dynamic';\n  annotations?: Record<string, { isBookmarked?: boolean; comment?: string }>;\n  onToggleBookmark?: (verseId: string) => void;\n  onSaveComment?: (verseId: string, comment: string) => void;"
);

// 3. Destructure props
resultsCode = resultsCode.replace(
  "numberFontFamily,",
  "numberFontFamily,\n  annotations,\n  onToggleBookmark,\n  onSaveComment,"
);

// 4. Add component state for comment editing
const stateToAdd = `
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (focusedVerse && annotations) {
      const vid = \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\`;
      setCommentText(annotations[vid]?.comment || "");
      setIsEditingComment(false);
    }
  }, [focusedVerse, annotations]);
`;

resultsCode = resultsCode.replace(
  "const [copiedVerse, setCopiedVerse] = useState<boolean>(false);",
  "const [copiedVerse, setCopiedVerse] = useState<boolean>(false);\n" + stateToAdd
);

// 5. Render markers in the Verse list
const verseRenderReplacer = `
                  <p
                    key={verse.verse}
                    id={\`verse-\${verse.verse}\`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedVerse(isFocused ? null : verse);
                    }}
                    style={{
                      fontFamily: readingFontFamily,
                      fontSize: currentSizeOption.fontSizeRem,
                      lineHeight: currentLineHeightOption.value,
                    }}
                    className={\`font-normal drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] cursor-pointer transition-all duration-300 rounded-lg p-3 -mx-3 \${
                      isFocused 
                        ? 'text-cyan-100 bg-white/10 scale-[1.02] relative z-[70] shadow-2xl ring-1 ring-cyan-400/30' 
                        : isDimmed
                        ? 'text-white/30 blur-[2px] relative z-[60]'
                        : 'text-white hover:text-cyan-100 hover:bg-white/5'
                    }\`}
                  >
                    <sup className="text-cyan-200 font-bold mr-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none text-[0.7em] align-super">
                      {verse.verse}
                    </sup>
                    {verse.text}
                    {annotations && annotations[\`\${result.bookName} \${currentChapterNumber}:\${verse.verse}\`]?.isBookmarked && (
                      <Heart size={14} className="inline-block ml-2 text-rose-400 fill-rose-400/40" />
                    )}
                    {annotations && annotations[\`\${result.bookName} \${currentChapterNumber}:\${verse.verse}\`]?.comment && (
                      <MessageSquare size={14} className="inline-block ml-2 text-amber-300" />
                    )}
                  </p>
`;

// wait let's just do a regex replace to find the exact verse <p> render. I will write a simpler replacement.
