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
resultsCode = resultsCode.replace(
  "</sup>\n                    {verse.text}\n                  </p>",
  "</sup>\n                    {verse.text}\n                    {annotations && annotations[`${result.bookName} ${currentChapterNumber}:${verse.verse}`]?.isBookmarked && (\n                      <Heart size={14} className=\"inline-block ml-3 mb-1 text-rose-400 fill-rose-400 opacity-80\" />\n                    )}\n                    {annotations && annotations[`${result.bookName} ${currentChapterNumber}:${verse.verse}`]?.comment && (\n                      <MessageSquare size={14} className=\"inline-block ml-2 mb-1 text-amber-300 opacity-80\" />\n                    )}\n                  </p>"
);
resultsCode = resultsCode.replace(
  "</sup>\n                    {verse.text}\n                  </p>",
  "</sup>\n                    {verse.text}\n                    {annotations && annotations[`${verse.book_name} ${verse.chapter}:${verse.verse}`]?.isBookmarked && (\n                      <Heart size={14} className=\"inline-block ml-3 mb-1 text-rose-400 fill-rose-400 opacity-80\" />\n                    )}\n                    {annotations && annotations[`${verse.book_name} ${verse.chapter}:${verse.verse}`]?.comment && (\n                      <MessageSquare size={14} className=\"inline-block ml-2 mb-1 text-amber-300 opacity-80\" />\n                    )}\n                  </p>"
);

// 6. Focus bar additions
const focusBarButtons = `
              <button
                type="button"
                onClick={() => onToggleBookmark && focusedVerse && onToggleBookmark(\`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\`)}
                className={\`p-2 rounded-xl border transition-all active:scale-95 \${annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.isBookmarked ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 hover:bg-white/15 text-white/90 hover:text-white border-white/10'}\`}
                title="Favorito"
              >
                <Heart size={16} className={annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.isBookmarked ? 'fill-current' : ''} />
              </button>
              
              <button
                type="button"
                onClick={() => setIsEditingComment(!isEditingComment)}
                className={\`p-2 rounded-xl border transition-all active:scale-95 \${annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.comment ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/5 hover:bg-white/15 text-white/90 hover:text-white border-white/10'}\`}
                title="Añadir nota"
              >
                <MessageSquare size={16} className={annotations?.[focusedVerse ? \`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\` : '']?.comment ? 'fill-current' : ''} />
              </button>
`;

resultsCode = resultsCode.replace(
  "<button\n                type=\"button\"\n                onClick={handleCopyFocusedVerse}",
  focusBarButtons + "\n              <button\n                type=\"button\"\n                onClick={handleCopyFocusedVerse}"
);

const editCommentUi = `
            {isEditingComment && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full border-t border-white/15 mt-3 pt-3 flex flex-col sm:flex-row gap-2"
              >
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Añade tu comentario o reflexión sobre este pasaje..."
                  className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none h-16 sm:h-10"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (onSaveComment && focusedVerse) {
                      onSaveComment(\`\${focusedVerse.book_name} \${focusedVerse.chapter}:\${focusedVerse.verse}\`, commentText);
                      setIsEditingComment(false);
                    }
                  }}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-95"
                >
                  Guardar
                </button>
              </motion.div>
            )}
`;

resultsCode = resultsCode.replace(
  "className=\"fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] bg-blue-950/95 backdrop-blur-2xl border border-cyan-400/50 rounded-2xl px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-2 sm:gap-3 max-w-[92vw]\"\n          >",
  "className=\"fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] bg-blue-950/95 backdrop-blur-2xl border border-cyan-400/50 rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col items-stretch max-w-[92vw] min-w-[300px]\"\n          >\n            <div className=\"flex items-center justify-between gap-2 sm:gap-3 w-full\">"
);

resultsCode = resultsCode.replace(
  "className=\"p-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black transition-all active:scale-95 ml-1 font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]\"\n                title=\"Salir del modo concentración (Esc)\"\n              >\n                <X size={16} />\n              </button>\n            </div>\n          </motion.div>",
  "className=\"p-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black transition-all active:scale-95 ml-1 font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]\"\n                title=\"Salir del modo concentración (Esc)\"\n              >\n                <X size={16} />\n              </button>\n            </div>\n            </div>\n" + editCommentUi + "\n          </motion.div>"
);

fs.writeFileSync('src/components/BibleResults.tsx', resultsCode);

console.log("Patched successfully!");
