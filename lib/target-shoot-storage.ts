import { GameSettings, GameStats, DEFAULT_SETTINGS } from '@/types/target-shoot';

const STORAGE_KEY = 'target-shoot-game';

interface StoredData {
  settings: GameSettings;
  stats: GameStats;
  lastPlayed?: number;
}

/**
 * Load game data from localStorage
 */
export function loadGameData(): { settings: GameSettings; stats: GameStats } {
  if (typeof window === 'undefined') {
    return {
      settings: DEFAULT_SETTINGS,
      stats: {
        totalCorrect: 0,
        totalAttempts: 0,
        bestScore: 0,
        gamesPlayed: 0,
        bestStreak: 0,
      },
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        settings: DEFAULT_SETTINGS,
        stats: {
          totalCorrect: 0,
          totalAttempts: 0,
          bestScore: 0,
          gamesPlayed: 0,
          bestStreak: 0,
        },
      };
    }

    const data: StoredData = JSON.parse(stored);
    return {
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
      stats: data.stats || {
        totalCorrect: 0,
        totalAttempts: 0,
        bestScore: 0,
        gamesPlayed: 0,
        bestStreak: 0,
      },
    };
  } catch (error) {
    console.error('Failed to load game data:', error);
    return {
      settings: DEFAULT_SETTINGS,
      stats: {
        totalCorrect: 0,
        totalAttempts: 0,
        bestScore: 0,
        gamesPlayed: 0,
        bestStreak: 0,
      },
    };
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = loadGameData();
    const data: StoredData = {
      settings,
      stats: stored.stats,
      lastPlayed: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Save stats to localStorage
 */
export function saveStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = loadGameData();
    const data: StoredData = {
      settings: stored.settings,
      stats,
      lastPlayed: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

/**
 * Clear all stored data (useful for reset)
 */
export function clearGameData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game data:', error);
  }
}

/**
 * Get last played timestamp
 */
export function getLastPlayed(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: StoredData = JSON.parse(stored);
    return data.lastPlayed || null;
  } catch (error) {
    console.error('Failed to get last played:', error);
    return null;
  }
}
