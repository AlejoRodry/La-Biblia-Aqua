import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Service Worker and Manifest explicit routes with proper PWA headers
  // Serve public directory for icons, manifest, favicon
  app.use(express.static('public'));

  app.get('/sw.js', (_req, res) => {
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    const publicPath = path.resolve(process.cwd(), 'public/sw.js');
    res.sendFile(publicPath);
  });

  app.get(['/manifest.webmanifest', '/manifest.json'], (_req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    const publicPath = path.resolve(process.cwd(), 'public/manifest.json');
    res.sendFile(publicPath);
  });

  // In-memory cache for the Bible data
  let bibleDataCache: any = null;

  app.get('/api/bible', async (req, res) => {
    if (bibleDataCache) {
      return res.json(bibleDataCache);
    }
    
    try {
      const response = await fetch('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr.json');
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
      bibleDataCache = data;
      res.json(data);
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
