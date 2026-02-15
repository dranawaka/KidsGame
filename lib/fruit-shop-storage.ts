import { FruitShopSettings, FruitShopStats, DEFAULT_FRUIT_SHOP_SETTINGS } from '@/types/fruit-shop';

const STORAGE_KEYS = {
  SETTINGS: 'fruit-shop-settings',
  STATS: 'fruit-shop-stats',
  RECENT_ITEMS: 'fruit-shop-recent-items',
} as const;

/**
 * Load Fruit Shop settings from localStorage
 */
export function loadFruitShopSettings(): FruitShopSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_FRUIT_SHOP_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_FRUIT_SHOP_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load Fruit Shop settings:', e);
  }

  return DEFAULT_FRUIT_SHOP_SETTINGS;
}

/**
 * Save Fruit Shop settings to localStorage
 */
export function saveFruitShopSettings(settings: FruitShopSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save Fruit Shop settings:', e);
  }
}

/**
 * Load Fruit Shop stats from localStorage
 */
export function loadFruitShopStats(): FruitShopStats {
  if (typeof window === 'undefined') {
    return {
      totalCorrect: 0,
      totalAttempts: 0,
      bestScore: 0,
      gamesPlayed: 0,
      totalEarned: 0,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load Fruit Shop stats:', e);
  }

  return {
    totalCorrect: 0,
    totalAttempts: 0,
    bestScore: 0,
    gamesPlayed: 0,
    totalEarned: 0,
  };
}

/**
 * Save Fruit Shop stats to localStorage
 */
export function saveFruitShopStats(stats: FruitShopStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save Fruit Shop stats:', e);
  }
}

/**
 * Record a Fruit Shop game completion
 */
export function recordFruitShopGame(correct: number, total: number, finalScore: number, totalEarned: number): void {
  const stats = loadFruitShopStats();
  stats.totalCorrect += correct;
  stats.totalAttempts += total;
  stats.gamesPlayed += 1;
  stats.totalEarned += totalEarned;
  
  if (finalScore > stats.bestScore) {
    stats.bestScore = finalScore;
  }

  saveFruitShopStats(stats);
}

/**
 * Load recent item IDs (to avoid repetition)
 */
export function loadRecentItems(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_ITEMS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load recent items:', e);
  }

  return [];
}

/**
 * Save recent item IDs
 */
export function saveRecentItems(itemIds: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Keep only last 5 items
    const recentItems = itemIds.slice(-5);
    localStorage.setItem(STORAGE_KEYS.RECENT_ITEMS, JSON.stringify(recentItems));
  } catch (e) {
    console.error('Failed to save recent items:', e);
  }
}

/**
 * Clear all Fruit Shop data
 */
export function clearFruitShopData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.RECENT_ITEMS);
  } catch (e) {
    console.error('Failed to clear Fruit Shop data:', e);
  }
}
