import { GameSettings, GameStats, DEFAULT_SETTINGS } from '@/types/game';

const STORAGE_KEYS = {
  SETTINGS: 'bubble-pop-settings',
  STATS: 'bubble-pop-stats',
  BEST_SCORE: 'bubble-pop-best-score',
} as const;

/**
 * Load game settings from localStorage
 */
export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Save game settings to localStorage
 */
export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

/**
 * Load game stats from localStorage
 */
export function loadStats(): GameStats {
  if (typeof window === 'undefined') {
    return {
      totalCorrect: 0,
      totalAttempts: 0,
      bestScore: 0,
      gamesPlayed: 0,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }

  return {
    totalCorrect: 0,
    totalAttempts: 0,
    bestScore: 0,
    gamesPlayed: 0,
  };
}

/**
 * Save game stats to localStorage
 */
export function saveStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

/**
 * Update best score if current score is higher
 */
export function updateBestScore(score: number): boolean {
  const stats = loadStats();
  if (score > stats.bestScore) {
    stats.bestScore = score;
    saveStats(stats);
    return true; // New best score!
  }
  return false;
}

/**
 * Record a game completion
 */
export function recordGame(correct: number, total: number, finalScore: number): void {
  const stats = loadStats();
  stats.totalCorrect += correct;
  stats.totalAttempts += total;
  stats.gamesPlayed += 1;
  
  if (finalScore > stats.bestScore) {
    stats.bestScore = finalScore;
  }

  saveStats(stats);
}

/**
 * Clear all stored data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.BEST_SCORE);
  } catch (e) {
    console.error('Failed to clear data:', e);
  }
}
