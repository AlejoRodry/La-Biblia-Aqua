export interface LastReadInfo {
  bookName: string;
  chapter: number;
  verse?: number;
  timestamp: number;
}

export interface ReadingProgressData {
  completedChapters: Record<string, boolean>; // e.g. "Génesis 1": true
  lastRead: LastReadInfo | null;
  dailyGoal: number; // default: 1 chapter
  dailyHistory: Record<string, number>; // date "YYYY-MM-DD" -> count of chapters read
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null; // "YYYY-MM-DD"
}

const STORAGE_KEY = 'bible_reading_progress_v2';

export const TOTAL_BIBLE_CHAPTERS = 1189;
export const TOTAL_BIBLE_BOOKS = 66;

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadReadingProgress(): ReadingProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        completedChapters: data.completedChapters || {},
        lastRead: data.lastRead || null,
        dailyGoal: data.dailyGoal || 1,
        dailyHistory: data.dailyHistory || {},
        currentStreak: data.currentStreak || 0,
        bestStreak: data.bestStreak || 0,
        lastActiveDate: data.lastActiveDate || null,
      };
    }
  } catch (e) {
    console.error('Error loading reading progress', e);
  }

  // Fallback / Initial
  return {
    completedChapters: {},
    lastRead: null,
    dailyGoal: 1,
    dailyHistory: {},
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: null,
  };
}

export function saveReadingProgress(data: ReadingProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving reading progress', e);
  }
}

export function calculateStreak(data: ReadingProgressData): { currentStreak: number; bestStreak: number } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  
  const lastActive = data.lastActiveDate;
  let currentStreak = data.currentStreak;
  let bestStreak = data.bestStreak;

  if (!lastActive) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // If last active was before yesterday, streak is broken unless read today
  if (lastActive !== today && lastActive !== yesterday) {
    currentStreak = 0;
  }

  return { currentStreak, bestStreak };
}

export function recordChapterRead(
  data: ReadingProgressData,
  bookName: string,
  chapter: number
): ReadingProgressData {
  const chapterKey = `${bookName} ${chapter}`;
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const isAlreadyRead = !!data.completedChapters[chapterKey];
  const newCompletedChapters = {
    ...data.completedChapters,
    [chapterKey]: true,
  };

  const todayCount = (data.dailyHistory[today] || 0) + (isAlreadyRead ? 0 : 1);
  const newDailyHistory = {
    ...data.dailyHistory,
    [today]: todayCount,
  };

  let currentStreak = data.currentStreak;
  let bestStreak = data.bestStreak;
  let lastActive = data.lastActiveDate;

  if (!isAlreadyRead || lastActive !== today) {
    if (lastActive === yesterday) {
      currentStreak += 1;
    } else if (lastActive === today) {
      // already active today, keep streak
    } else {
      // streak reset or new
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
    lastActive = today;
  }

  const updated: ReadingProgressData = {
    ...data,
    completedChapters: newCompletedChapters,
    lastRead: {
      bookName,
      chapter,
      timestamp: Date.now(),
    },
    dailyHistory: newDailyHistory,
    currentStreak,
    bestStreak,
    lastActiveDate: lastActive,
  };

  saveReadingProgress(updated);
  return updated;
}

export function toggleChapterCompleted(
  data: ReadingProgressData,
  bookName: string,
  chapter: number
): ReadingProgressData {
  const chapterKey = `${bookName} ${chapter}`;
  const isCompleted = !!data.completedChapters[chapterKey];

  if (!isCompleted) {
    return recordChapterRead(data, bookName, chapter);
  }

  // If unmarking
  const newCompleted = { ...data.completedChapters };
  delete newCompleted[chapterKey];

  const updated: ReadingProgressData = {
    ...data,
    completedChapters: newCompleted,
  };

  saveReadingProgress(updated);
  return updated;
}

export function setDailyGoal(data: ReadingProgressData, goal: number): ReadingProgressData {
  const updated: ReadingProgressData = {
    ...data,
    dailyGoal: Math.max(1, Math.min(20, goal)),
  };
  saveReadingProgress(updated);
  return updated;
}

export function getWeekActivity(dailyHistory: Record<string, number>): {
  dayName: string;
  dateStr: string;
  count: number;
  isToday: boolean;
}[] {
  const days: { dayName: string; dateStr: string; count: number; isToday: boolean }[] = [];
  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = getTodayDateString();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayName = dayLabels[d.getDay()];

    days.push({
      dayName,
      dateStr,
      count: dailyHistory[dateStr] || 0,
      isToday: dateStr === today,
    });
  }

  return days;
}

export function getGlobalProgressStats(
  completedChapters: Record<string, boolean>,
  toc: { name: string; chapters: number }[]
) {
  const totalCompleted = Object.keys(completedChapters).length;
  const percentage = Math.min(100, (totalCompleted / TOTAL_BIBLE_CHAPTERS) * 100);

  let completedBooks = 0;
  if (toc && toc.length > 0) {
    toc.forEach((book) => {
      let bookAllDone = true;
      for (let c = 1; c <= book.chapters; c++) {
        if (!completedChapters[`${book.name} ${c}`]) {
          bookAllDone = false;
          break;
        }
      }
      if (bookAllDone && book.chapters > 0) {
        completedBooks++;
      }
    });
  }

  return {
    totalCompleted,
    totalChapters: TOTAL_BIBLE_CHAPTERS,
    percentage: Number(percentage.toFixed(1)),
    completedBooks,
    totalBooks: TOTAL_BIBLE_BOOKS,
  };
}
