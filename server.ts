import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Service Worker and Manifest explicit routes with proper PWA headers
  app.get('/sw.js', (_req, res) => {
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    const swPath = process.env.NODE_ENV === 'production' 
      ? path.resolve(process.cwd(), 'dist/sw.js')
      : path.resolve(process.cwd(), 'public/sw.js');
    res.sendFile(swPath);
  });

  app.get(['/manifest.webmanifest', '/manifest.json'], (_req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    const manifestPath = process.env.NODE_ENV === 'production'
      ? path.resolve(process.cwd(), 'dist/manifest.json')
      : path.resolve(process.cwd(), 'public/manifest.json');
    res.sendFile(manifestPath);
  });

  // Serve public directory for icons, manifest, favicon
  if (process.env.NODE_ENV !== 'production') {
    app.use(express.static('public'));
  }

  // In-memory cache for the Bible data
  let bibleDataCache: any = null;

  // 66 Canonical Spanish Reina-Valera 1960 book names in exact order
  const CANONICAL_SPANISH_BOOKS = [
    'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut',
    '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías',
    'Ester', 'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías',
    'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás',
    'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
    'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', '1 Corintios', '2 Corintios',
    'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses',
    '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro', '2 Pedro',
    '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis'
  ];

  app.get('/api/bible', async (req, res) => {
    if (bibleDataCache) {
      return res.json(bibleDataCache);
    }
    
    try {
      let response = await fetch('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr1960.json');
      if (!response.ok) {
        response = await fetch('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr.json');
      }
      if (!response.ok) {
        throw new Error(`GitHub responded with status: ${response.status}`);
      }
      
      let text = await response.text();
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      // Clean up unescaped newlines and control characters that break JSON parsing
      text = text.replace(/[\n\r\t]/g, ' ')
                 .replace(/\\(?!["\\/bfnrtu])/g, '\\\\'); // Escape unescaped backslashes

      const data = JSON.parse(text);
      // Map every book to its canonical Spanish Reina-Valera 1960 name
      const sanitizedData = Array.isArray(data)
        ? data.map((book: any, idx: number) => ({
            ...book,
            name: CANONICAL_SPANISH_BOOKS[idx] || book.name
          }))
        : data;

      bibleDataCache = sanitizedData;
      res.json(sanitizedData);
    } catch (error) {
      console.error('Error fetching Bible data:', error);
      res.status(500).json({ error: 'Failed to fetch Bible data' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
