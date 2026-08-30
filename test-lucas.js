import fs from 'fs';

let content = fs.readFileSync('public/es_rvr.json', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
const data = JSON.parse(content);

function normalizeBookName(name) {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, '') // remove spaces
    .replace(/^(\d+)(ra|da|ta|ma|er|o|a)?de/, '$1') // 1ra de -> 1
    .replace(/^primera(?:de)?/, '1')
    .replace(/^segunda(?:de)?/, '2')
    .replace(/^tercera(?:de)?/, '3');
}

const bookAliases = {
  "salmos": "psalms",
  "genesis": "genesis",
  "juan": "john",
  "mateo": "matthew",
  "lucas": "luke",
  "marcos": "mark",
  "hechos": "acts",
  "romanos": "romans",
  "corintios": "corinthians",
  "apocalipsis": "revelation",
};

function searchBible(query) {
  const cleanedQuery = query
    .replace(/\b(?:cap[ií]tulo|cap)\b\.?\s*/gi, ' ')
    .replace(/\b(?:vers[ií]culo|ver|v)\b\.?\s*/gi, ':')
    .replace(/\s+/g, ' ')
    .trim();

  const match = cleanedQuery.match(/^(.+?)(?:\s+(\d+)(?:[\s:,\.]+(\d+)(?:\s*-\s*(\d+))?)?)?$/);
  
  if (!match) {
    throw new Error('Formato no válido');
  }
  
  let [_, bookStr, chapterStr = "1", startVerseStr, endVerseStr] = match;
  let normalizedQueryBook = normalizeBookName(bookStr);
  
  if (bookAliases[normalizedQueryBook]) {
    normalizedQueryBook = bookAliases[normalizedQueryBook];
  } else {
    for (const [spa, eng] of Object.entries(bookAliases)) {
      if (normalizedQueryBook.includes(spa)) {
        normalizedQueryBook = normalizedQueryBook.replace(spa, eng);
      }
    }
  }

  const book = data.find(b => normalizeBookName(b.name).includes(normalizedQueryBook) || normalizeBookName(b.abbrev) === normalizedQueryBook);
  
  if (!book) throw new Error(`No se encontró el libro: ${bookStr}`);
  
  return `${book.name} ${chapterStr}`;
}

console.log(searchBible("lucas"));
console.log(searchBible("salmos"));
console.log(searchBible("1 juan"));
