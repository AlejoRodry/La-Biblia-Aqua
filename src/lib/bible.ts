export type SearchType = 'passage' | 'keyword';

export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface MatchingBookShortcut {
  name: string;
  chapters: number;
  abbrev: string;
}

export interface SearchResult {
  type: SearchType;
  query: string;
  reference: string;
  verses: Verse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
  totalChapters?: number;
  bookName?: string;
  totalCount?: number;
  bookShortcuts?: MatchingBookShortcut[];
}

const bookTranslations: Record<string, string> = {
  "Genesis": "Génesis",
  "Exodus": "Éxodo",
  "Leviticus": "Levítico",
  "Numbers": "Números",
  "Deuteronomy": "Deuteronomio",
  "Joshua": "Josué",
  "Judges": "Jueces",
  "Ruth": "Rut",
  "1 Samuel": "1 Samuel",
  "2 Samuel": "2 Samuel",
  "1 Kings": "1 Reyes",
  "2 Kings": "2 Reyes",
  "1 Chronicles": "1 Crónicas",
  "2 Chronicles": "2 Crónicas",
  "Ezra": "Esdras",
  "Nehemiah": "Nehemías",
  "Esther": "Ester",
  "Job": "Job",
  "Psalms": "Salmos",
  "Proverbs": "Proverbios",
  "Ecclesiastes": "Eclesiastés",
  "Song of Solomon": "Cantares",
  "Isaiah": "Isaías",
  "Jeremiah": "Jeremías",
  "Lamentations": "Lamentaciones",
  "Ezekiel": "Ezequiel",
  "Daniel": "Daniel",
  "Hosea": "Oseas",
  "Joel": "Joel",
  "Amos": "Amós",
  "Obadiah": "Abdías",
  "Jonah": "Jonás",
  "Micah": "Miqueas",
  "Nahum": "Nahúm",
  "Habakkuk": "Habacuc",
  "Zephaniah": "Sofonías",
  "Haggai": "Hageo",
  "Zechariah": "Zacarías",
  "Malachi": "Malaquías",
  "Matthew": "Mateo",
  "Mark": "Marcos",
  "Luke": "Lucas",
  "John": "Juan",
  "Acts": "Hechos",
  "Romans": "Romanos",
  "1 Corinthians": "1 Corintios",
  "2 Corinthians": "2 Corintios",
  "Galatians": "Gálatas",
  "Ephesians": "Efesios",
  "Philippians": "Filipenses",
  "Colossians": "Colosenses",
  "1 Thessalonians": "1 Tesalonicenses",
  "2 Thessalonians": "2 Tesalonicenses",
  "1 Timothy": "1 Timoteo",
  "2 Timothy": "2 Timoteo",
  "Titus": "Tito",
  "Philemon": "Filemón",
  "Hebrews": "Hebreos",
  "James": "Santiago",
  "1 Peter": "1 Pedro",
  "2 Peter": "2 Pedro",
  "1 John": "1 Juan",
  "2 John": "2 Juan",
  "3 John": "3 Juan",
  "Jude": "Judas",
  "Revelation": "Apocalipsis"
};

let bibleData: any[] | null = null;

export async function getBibleData() {
  if (bibleData) return bibleData;

  let rawData: any = null;

  // 1. Try to fetch from network / Service Worker cache
  try {
    const res = await fetch('/api/bible');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        rawData = data;
        import('./offlineBible').then(({ saveBibleToIndexedDB }) => {
          saveBibleToIndexedDB(rawData).catch(() => { });
        }).catch(() => { });
      }
    }
  } catch (err) {
    console.info('Fetch /api/bible falló o está sin conexión. Probando origen remoto directo...', err);
  }

  // 1b. Fallback to direct GitHub raw data (for static hosts like GitHub Pages)
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    try {
      const res = await fetch('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr.json');
      if (res.ok) {
        let text = await res.text();
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        text = text.replace(/[\n\r\t]/g, ' ').replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
        const data = JSON.parse(text);
        if (Array.isArray(data) && data.length > 0) {
          rawData = data;
          import('./offlineBible').then(({ saveBibleToIndexedDB }) => {
            saveBibleToIndexedDB(rawData).catch(() => { });
          }).catch(() => { });
        }
      }
    } catch (e) {
      console.info('Fetch remoto directo falló:', e);
    }
  }

  // 2. Fallback to local IndexedDB if offline or network failed
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    try {
      const { getBibleFromIndexedDB } = await import('./offlineBible');
      rawData = await getBibleFromIndexedDB();
    } catch (e) {
      console.warn('Error leyendo desde IndexedDB:', e);
    }
  }

  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    throw new Error('No se pudo cargar la Biblia. Si no tienes conexión a internet, abre la app al menos una vez con conexión para guardarla en tu dispositivo.');
  }

  bibleData = rawData.map((book: any) => ({
    ...book,
    name: bookTranslations[book.name] || book.name
  }));

  return bibleData;
}

export async function getTableOfContents(): Promise<{ name: string, chapters: number }[]> {
  const data = await getBibleData();
  return data.map((book: any) => ({
    name: book.name,
    chapters: book.chapters.length
  }));
}

function normalizeBookName(name: string): string {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/^san\s+/, '') // remove 'san ' prefix
    .replace(/^iii\s+/, '3')
    .replace(/^ii\s+/, '2')
    .replace(/^i\s+/, '1')
    .replace(/^primera\s*(de)?\s*/, '1')
    .replace(/^segunda\s*(de)?\s*/, '2')
    .replace(/^tercera\s*(de)?\s*/, '3')
    .replace(/^1ra\s*(de)?\s*/, '1')
    .replace(/^2da\s*(de)?\s*/, '2')
    .replace(/^3ra\s*(de)?\s*/, '3')
    .replace(/^(\d+)(ra|da|ta|ma|er|o|a|st|nd|rd|th)?\s*(de)?\s*/, '$1') // 1ra de -> 1
    .replace(/[^a-z0-9]/g, ''); // remove non-alphanumeric characters
}

function normalizeSearchText(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const bookAliases: Record<string, string> = {
  "cantardeloscantares": "cantares",
  "cantar": "cantares",
  "cantares": "cantares",
  "cnt": "cantares",
  "ct": "cantares",
  "songofsolomon": "cantares",
  "salmo": "salmos",
  "sal": "salmos",
  "ps": "salmos",
  "psa": "salmos",
  "psalms": "salmos",
  "gn": "genesis",
  "gen": "genesis",
  "ge": "genesis",
  "ex": "exodo",
  "exo": "exodo",
  "exod": "exodo",
  "exodus": "exodo",
  "lev": "levitico",
  "lv": "levitico",
  "levit": "levitico",
  "leviticus": "levitico",
  "num": "numeros",
  "nm": "numeros",
  "nume": "numeros",
  "numbers": "numeros",
  "deut": "deuteronomio",
  "dt": "deuteronomio",
  "deu": "deuteronomio",
  "deuteronomy": "deuteronomio",
  "jos": "josue",
  "js": "josue",
  "josu": "josue",
  "joshua": "josue",
  "jue": "jueces",
  "jdc": "jueces",
  "juez": "jueces",
  "judg": "jueces",
  "judges": "jueces",
  "rt": "rut",
  "ruth": "rut",
  "1s": "1samuel",
  "1sam": "1samuel",
  "1sm": "1samuel",
  "2s": "2samuel",
  "2sam": "2samuel",
  "2sm": "2samuel",
  "1r": "1reyes",
  "1rey": "1reyes",
  "1k": "1reyes",
  "1kg": "1reyes",
  "1kgs": "1reyes",
  "1kings": "1reyes",
  "2r": "2reyes",
  "2rey": "2reyes",
  "2k": "2reyes",
  "2kg": "2reyes",
  "2kgs": "2reyes",
  "2kings": "2reyes",
  "1cr": "1cronicas",
  "1cron": "1cronicas",
  "1ch": "1cronicas",
  "1chr": "1cronicas",
  "1chronicles": "1cronicas",
  "2cr": "2cronicas",
  "2cron": "2cronicas",
  "2ch": "2cronicas",
  "2chr": "2cronicas",
  "2chronicles": "2cronicas",
  "esd": "esdras",
  "ezr": "esdras",
  "ezra": "esdras",
  "neh": "nehemias",
  "ne": "nehemias",
  "nehemiah": "nehemias",
  "est": "ester",
  "et": "ester",
  "esth": "ester",
  "esther": "ester",
  "jb": "job",
  "pr": "proverbios",
  "prov": "proverbios",
  "prv": "proverbios",
  "proverbs": "proverbios",
  "ecl": "eclesiastes",
  "ec": "eclesiastes",
  "ecc": "eclesiastes",
  "eccl": "eclesiastes",
  "ecclesiastes": "eclesiastes",
  "is": "isaias",
  "isa": "isaias",
  "isaiah": "isaias",
  "jer": "jeremias",
  "jr": "jeremias",
  "jeremiah": "jeremias",
  "lam": "lamentaciones",
  "lm": "lamentaciones",
  "lamentations": "lamentaciones",
  "ez": "ezequiel",
  "eze": "ezequiel",
  "ezk": "ezequiel",
  "ezekiel": "ezequiel",
  "dan": "daniel",
  "dn": "daniel",
  "os": "oseas",
  "ho": "oseas",
  "hos": "oseas",
  "hosea": "oseas",
  "jl": "joel",
  "joe": "joel",
  "am": "amos",
  "amo": "amos",
  "abd": "abdias",
  "ob": "abdias",
  "obad": "abdias",
  "obadiah": "abdias",
  "jon": "jonas",
  "jnh": "jonas",
  "jonah": "jonas",
  "miq": "miqueas",
  "mi": "miqueas",
  "mic": "miqueas",
  "micah": "miqueas",
  "nah": "nahum",
  "na": "nahum",
  "hab": "habacuc",
  "hk": "habacuc",
  "habakkuk": "habacuc",
  "sof": "sofonias",
  "zp": "sofonias",
  "zep": "sofonias",
  "zephaniah": "sofonias",
  "hag": "hageo",
  "hg": "hageo",
  "haggai": "hageo",
  "zac": "zacarias",
  "zc": "zacarias",
  "zech": "zacarias",
  "zechariah": "zacarias",
  "mal": "malaquias",
  "ml": "malaquias",
  "malachi": "malaquias",
  "mt": "mateo",
  "mat": "mateo",
  "matt": "mateo",
  "matthew": "mateo",
  "mr": "marcos",
  "mc": "marcos",
  "mar": "marcos",
  "mk": "marcos",
  "mark": "marcos",
  "lc": "lucas",
  "luc": "lucas",
  "lk": "lucas",
  "luk": "lucas",
  "luke": "lucas",
  "jn": "juan",
  "jhn": "juan",
  "jo": "juan",
  "john": "juan",
  "hch": "hechos",
  "act": "hechos",
  "acts": "hechos",
  "hec": "hechos",
  "rom": "romanos",
  "rm": "romanos",
  "ro": "romanos",
  "romans": "romanos",
  "1cor": "1corintios",
  "1co": "1corintios",
  "1corinthians": "1corintios",
  "2cor": "2corintios",
  "2co": "2corintios",
  "2corinthians": "2corintios",
  "gal": "galatas",
  "gl": "galatas",
  "galatians": "galatas",
  "ef": "efesios",
  "efe": "efesios",
  "eph": "efesios",
  "ephesians": "efesios",
  "flp": "filipenses",
  "fil": "filipenses",
  "php": "filipenses",
  "ph": "filipenses",
  "philippians": "filipenses",
  "col": "colosenses",
  "cl": "colosenses",
  "colossians": "colosenses",
  "1tes": "1tesalonicenses",
  "1ts": "1tesalonicenses",
  "1thess": "1tesalonicenses",
  "1thessalonians": "1tesalonicenses",
  "2tes": "2tesalonicenses",
  "2ts": "2tesalonicenses",
  "2thess": "2tesalonicenses",
  "2thessalonians": "2tesalonicenses",
  "1tim": "1timoteo",
  "1tm": "1timoteo",
  "1timothy": "1timoteo",
  "2tim": "2timoteo",
  "2tm": "2timoteo",
  "2timothy": "2timoteo",
  "tit": "tito",
  "tt": "tito",
  "titus": "tito",
  "flm": "filemon",
  "phm": "filemon",
  "philemon": "filemon",
  "heb": "hebreos",
  "hb": "hebreos",
  "hebrews": "hebreos",
  "stg": "santiago",
  "stgo": "santiago",
  "sant": "santiago",
  "jm": "santiago",
  "jas": "santiago",
  "james": "santiago",
  "1ped": "1pedro",
  "2ped": "2pedro",
  "1p": "1pedro",
  "2p": "2pedro",
  "1pe": "1pedro",
  "2pe": "2pedro",
  "1pet": "1pedro",
  "2pet": "2pedro",
  "1peter": "1pedro",
  "2peter": "2pedro",
  "1jn": "1juan",
  "2jn": "2juan",
  "3jn": "3juan",
  "1jo": "1juan",
  "2jo": "2juan",
  "3jo": "3juan",
  "1john": "1juan",
  "2john": "2juan",
  "3john": "3juan",
  "jd": "judas",
  "jud": "judas",
  "jude": "judas",
  "ap": "apocalipsis",
  "apo": "apocalipsis",
  "apoc": "apocalipsis",
  "rev": "apocalipsis",
  "revelation": "apocalipsis"
};

function findMatchingBook(data: any[], bookQueryStr: string): any | null {
  const rawNorm = normalizeBookName(bookQueryStr);
  const mappedNorm = bookAliases[rawNorm] || rawNorm;

  // 1. Exact match on normalized book name (e.g. "2reyes" === "2reyes", "juan" === "juan")
  let match = data.find((b: any) => normalizeBookName(b.name) === mappedNorm || normalizeBookName(b.name) === rawNorm);
  if (match) return match;

  // 2. Exact match on raw abbrev
  match = data.find((b: any) => normalizeBookName(b.abbrev) === rawNorm || normalizeBookName(b.abbrev) === mappedNorm);
  if (match) return match;

  // 3. StartsWith match (e.g. "genesis" starts with "gen")
  match = data.find((b: any) => {
    const bNorm = normalizeBookName(b.name);
    return bNorm.startsWith(mappedNorm) || bNorm.startsWith(rawNorm);
  });
  if (match) return match;

  return null;
}

const CURATED_THEMES: Record<string, string[]> = {
  "amor": ["1 Corintios 13:4-7", "Romanos 8:38-39", "1 Juan 4:16", "Juan 3:16", "Colosenses 3:14", "Efesios 4:2"],
  "paz": ["Juan 14:27", "Filipenses 4:6-7", "Salmos 4:8", "Isaías 26:3", "Mateo 11:28", "Romanos 15:13"],
  "fortaleza": ["Isaías 41:10", "Filipenses 4:13", "Salmos 46:1", "Josué 1:9", "Salmos 28:7", "2 Corintios 12:9"],
  "esperanza": ["Jeremías 29:11", "Romanos 15:13", "Hebreos 11:1", "Salmos 39:7", "Romanos 8:24-25", "Lamentaciones 3:24"],
  "sanidad": ["Jeremías 17:14", "Salmos 147:3", "Santiago 5:15", "Isaías 53:5", "Salmos 103:2-3", "Proverbios 4:20-22"],
  "perdon": ["Efesios 4:32", "Colosenses 3:13", "1 Juan 1:9", "Mateo 6:14", "Miqueas 7:18", "Salmos 86:5"],
  "ansiedad": ["1 Pedro 5:7", "Filipenses 4:6-7", "Mateo 6:34", "Salmos 94:19", "Proverbios 12:25", "Salmos 55:22"],
  "sabiduria": ["Proverbios 3:5-6", "Santiago 1:5", "Proverbios 2:6", "Colosenses 3:16", "Proverbios 4:7", "Eclesiastés 2:26"],
  "alegria": ["Nehemías 8:10", "Salmos 118:24", "Romanos 15:13", "Juan 15:11", "Salmos 16:11", "Filipenses 4:4"]
};

export async function searchBible(query: string): Promise<SearchResult> {
  const data = await getBibleData();
  let trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Por favor ingresa un término de búsqueda o pasaje.');
  }

  // Intercept predefined emotion themes to provide curated passages instead of raw text search
  const normalizedTheme = trimmed.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let isCuratedTheme = false;
  if (CURATED_THEMES[normalizedTheme]) {
    const references = CURATED_THEMES[normalizedTheme];
    trimmed = references[Math.floor(Math.random() * references.length)];
    isCuratedTheme = true;
  }

  // Clean up common words like "capitulo", "versiculo"
  const cleanedQuery = trimmed
    .replace(/\b(?:cap[ií]tulo|cap|c)\b\.?\s*/gi, ' ')
    .replace(/\b(?:vers[ií]culo|vers|ver|v)\b\.?\s*/gi, ':')
    .replace(/\s+/g, ' ')
    .trim();

  // Test if the query contains explicit chapter and/or verse numbers (e.g. "Juan 3:16", "Salmos 23", "1 Pedro 2", "2 Reyes capitulo 2", "2 Reyes 2")
  // Format: [Optional Book Prefix/Name] [ChapterNumber] [:VerseNumber] [-EndVerse]
  const referenceMatch = cleanedQuery.match(/^([1-3]?\s*[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+?)\s*(\d+)(?:[\s:,\.]+(\d+)(?:\s*-\s*(\d+))?)?$/);

  if (referenceMatch) {
    const [_, bookStr, chapterStr, startVerseStr, endVerseStr] = referenceMatch;
    const book = findMatchingBook(data, bookStr);

    if (book) {
      const chapterIdx = parseInt(chapterStr, 10) - 1;
      const chapterData = book.chapters[chapterIdx];

      if (chapterData) {
        const verses: Verse[] = [];

        if (startVerseStr) {
          const startVerse = parseInt(startVerseStr, 10);
          const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : startVerse;

          if (startVerse >= 1 && startVerse <= chapterData.length && endVerse >= startVerse) {
            for (let i = startVerse; i <= Math.min(endVerse, chapterData.length); i++) {
              if (chapterData[i - 1]) {
                verses.push({
                  book_id: book.abbrev,
                  book_name: book.name,
                  chapter: chapterIdx + 1,
                  verse: i,
                  text: chapterData[i - 1]
                });
              }
            }
          }
        } else {
          // Whole chapter
          chapterData.forEach((text: string, i: number) => {
            verses.push({
              book_id: book.abbrev,
              book_name: book.name,
              chapter: chapterIdx + 1,
              verse: i + 1,
              text
            });
          });
        }

        if (verses.length > 0) {
          const reference = startVerseStr
            ? (endVerseStr && endVerseStr !== startVerseStr ? `${book.name} ${chapterStr}:${startVerseStr}-${endVerseStr}` : `${book.name} ${chapterStr}:${startVerseStr}`)
            : `${book.name} ${chapterStr}`;

          return {
            type: 'passage',
            query: isCuratedTheme ? query.trim() : trimmed,
            reference,
            verses,
            text: verses.map(v => v.text).join(' '),
            translation_id: 'rvr',
            translation_name: 'Reina Valera 1960',
            translation_note: 'Dominio Público',
            totalChapters: book.chapters.length,
            bookName: book.name
          };
        }
      }
    }
  }

  // --- Check if the query is directly a book name without numbers (e.g. "2 Reyes", "Habacuc", "Salmos") ---
  const directBook = findMatchingBook(data, trimmed);
  if (directBook && directBook.chapters[0]) {
    const verses: Verse[] = directBook.chapters[0].map((text: string, i: number) => ({
      book_id: directBook.abbrev,
      book_name: directBook.name,
      chapter: 1,
      verse: i + 1,
      text
    }));

    return {
      type: 'passage',
      query: trimmed,
      reference: `${directBook.name} 1`,
      verses,
      text: verses.map(v => v.text).join(' '),
      translation_id: 'rvr',
      translation_name: 'Reina Valera 1960',
      translation_note: 'Dominio Público',
      totalChapters: directBook.chapters.length,
      bookName: directBook.name
    };
  }

  // --- KEYWORD & FULL-TEXT SEARCH MODE ---
  // If no specific passage was matched or user searched a word/character/topic (e.g. "Pedro", "amor", "Jesús")
  const normQuery = normalizeSearchText(trimmed);
  const searchWords = normQuery.split(/\s+/).filter(w => w.length > 0);

  const matchingVerses: Verse[] = [];
  const matchingBooks: MatchingBookShortcut[] = [];

  // Check if any books match the name (e.g. "Pedro" -> 1 Pedro, 2 Pedro)
  const normCleanedNoSpaces = normalizeBookName(trimmed);
  data.forEach((b: any) => {
    const bNorm = normalizeBookName(b.name);
    if (bNorm.includes(normCleanedNoSpaces) || normCleanedNoSpaces.includes(bNorm)) {
      matchingBooks.push({
        name: b.name,
        chapters: b.chapters.length,
        abbrev: b.abbrev
      });
    }
  });

  // Search all verses in the entire Bible
  for (const book of data) {
    book.chapters.forEach((chapter: string[], chIdx: number) => {
      chapter.forEach((verseText: string, vIdx: number) => {
        const normVerse = normalizeSearchText(verseText);
        let matches = false;

        if (normVerse.includes(normQuery)) {
          matches = true;
        } else if (searchWords.length > 1 && searchWords.every(w => normVerse.includes(w))) {
          matches = true;
        }

        if (matches) {
          matchingVerses.push({
            book_id: book.abbrev,
            book_name: book.name,
            chapter: chIdx + 1,
            verse: vIdx + 1,
            text: verseText
          });
        }
      });
    });
  }

  if (matchingVerses.length > 0) {
    return {
      type: 'keyword',
      query: trimmed,
      reference: `"${trimmed}" en la Biblia`,
      verses: matchingVerses,
      text: matchingVerses.slice(0, 10).map(v => `${v.book_name} ${v.chapter}:${v.verse} - ${v.text}`).join('\n'),
      translation_id: 'rvr',
      translation_name: 'Reina Valera 1960',
      translation_note: 'Dominio Público',
      totalCount: matchingVerses.length,
      bookShortcuts: matchingBooks
    };
  }

  // If no verse contains the text, but a single book matches without numbers (e.g. "Habacuc")
  if (matchingBooks.length === 1) {
    const targetBook = data.find((b: any) => b.name === matchingBooks[0].name);
    if (targetBook && targetBook.chapters[0]) {
      const verses: Verse[] = targetBook.chapters[0].map((text: string, i: number) => ({
        book_id: targetBook.abbrev,
        book_name: targetBook.name,
        chapter: 1,
        verse: i + 1,
        text
      }));

      return {
        type: 'passage',
        query: trimmed,
        reference: `${targetBook.name} 1`,
        verses,
        text: verses.map(v => v.text).join(' '),
        translation_id: 'rvr',
        translation_name: 'Reina Valera 1960',
        translation_note: 'Dominio Público',
        totalChapters: targetBook.chapters.length,
        bookName: targetBook.name
      };
    }
  }

  throw new Error(`No se encontraron versículos para "${trimmed}". Prueba con otra palabra clave o una cita como "Juan 3:16".`);
}
