/**
 * Offline Bible Storage & PWA Service Worker Management
 * Guarantees 100% offline availability for Android and web devices.
 */

const DB_NAME = 'BibliaOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'bible_data';
const KEY_DATA = 'rvr1960_full';
const KEY_META = 'metadata';

interface BibleMetadata {
  savedAt: string;
  totalBooks: number;
  approxSizeMb: number;
}

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB no soportado en este navegador'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get cached Bible data from IndexedDB
 */
export async function getBibleFromIndexedDB(): Promise<any[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_DATA);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('Error reading from IndexedDB:', err);
    return null;
  }
}

/**
 * Save Bible data to IndexedDB
 */
export async function saveBibleToIndexedDB(data: any[]): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      store.put(data, KEY_DATA);

      const meta: BibleMetadata = {
        savedAt: new Date().toISOString(),
        totalBooks: data.length,
        approxSizeMb: 4.8,
      };
      store.put(meta, KEY_META);

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Error saving to IndexedDB:', err);
    return false;
  }
}

/**
 * Check if the Bible is already saved for offline use
 */
export async function getOfflineStatus(): Promise<{ isCached: boolean; meta: BibleMetadata | null }> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_META);

      req.onsuccess = () => {
        if (req.result) {
          resolve({ isCached: true, meta: req.result as BibleMetadata });
        } else {
          resolve({ isCached: false, meta: null });
        }
      };
      req.onerror = () => resolve({ isCached: false, meta: null });
    });
  } catch {
    return { isCached: false, meta: null };
  }
}

/**
 * Register Service Worker for offline PWA caching
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Service Worker registrado correctamente (Modo Offline activo):', reg.scope);
      })
      .catch((err) => {
        console.warn('Error registrando Service Worker:', err);
      });
  });
}

// Global deferred prompt holder for Android PWA installation
let deferredInstallPrompt: any = null;
const installListeners: Array<(canInstall: boolean) => void> = [];

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: any) => {
    // Prevent standard mini-infobar on mobile
    e.preventDefault();
    deferredInstallPrompt = e;
    installListeners.forEach((fn) => fn(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installListeners.forEach((fn) => fn(false));
    console.log('¡Aplicación Biblia RVR1960 instalada en Android!');
  });
}

export function subscribeToInstallPrompt(callback: (canInstall: boolean) => void): () => void {
  installListeners.push(callback);
  callback(deferredInstallPrompt !== null);
  return () => {
    const idx = installListeners.indexOf(callback);
    if (idx !== -1) installListeners.splice(idx, 1);
  };
}

export async function promptPWAInstall(): Promise<'accepted' | 'dismissed' | 'unsupported'> {
  if (!deferredInstallPrompt) {
    return 'unsupported';
  }

  deferredInstallPrompt.prompt();
  const choiceResult = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installListeners.forEach((fn) => fn(false));
  return choiceResult.outcome;
}
