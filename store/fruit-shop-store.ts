import { create } from 'zustand';
import {
  FruitShopSettings,
  FruitShopState,
  FruitShopStats,
  DEFAULT_FRUIT_SHOP_SETTINGS,
  Coin,
  Order,
} from '@/types/fruit-shop';
import {
  generateOrder,
  generateCoinsForLevel,
  calculatePaidTotal,
  isPaymentCorrect,
  calculateFruitShopScore,
  generateHints,
} from '@/lib/fruit-shop-logic';
import {
  loadFruitShopSettings,
  saveFruitShopSettings,
  loadFruitShopStats,
  recordFruitShopGame,
  loadRecentItems,
  saveRecentItems,
} from '@/lib/fruit-shop-storage';
import { audioManager } from '@/lib/audio';
import { loadPlayer } from '@/lib/player';
import { addLeaderboardEntry } from '@/lib/leaderboard';

interface FruitShopStore extends FruitShopState {
  settings: FruitShopSettings;
  stats: FruitShopStats;
  recentItems: string[];
  
  // Actions
  initFruitShop: () => void;
  startGame: () => void;
  stopGame: () => void;
  addCoinToTray: (coin: Coin) => void;
  removeCoinFromTray: (coinId: string) => void;
  resetTray: () => void;
  submitPayment: () => void;
  nextOrder: () => void;
  updateSettings: (settings: Partial<FruitShopSettings>) => void;
  resetGame: () => void;
  decrementTimer: () => void;
  getHint: () => string | null;
}

const initialState: FruitShopState = {
  score: 0,
  streak: 0,
  questionIndex: 0,
  isPlaying: false,
  currentOrder: null,
  availableCoins: [],
  selectedCoins: [],
  paidTotal: 0,
  hintsUsed: 0,
  maxHints: 3,
};

export const useFruitShopStore = create<FruitShopStore>((set, get) => ({
  ...initialState,
  settings: DEFAULT_FRUIT_SHOP_SETTINGS,
  stats: {
    totalCorrect: 0,
    totalAttempts: 0,
    bestScore: 0,
    gamesPlayed: 0,
    totalEarned: 0,
  },
  recentItems: [],

  initFruitShop: () => {
    const settings = loadFruitShopSettings();
    const stats = loadFruitShopStats();
    const recentItems = loadRecentItems();
    audioManager.setEnabled(settings.soundOn);
    
    set({
      settings,
      stats,
      recentItems,
    });
  },

  startGame: () => {
    const { settings, recentItems } = get();
    const order = generateOrder(settings.level, recentItems);
    const coins = generateCoinsForLevel(settings.level, order.total);

    set({
      isPlaying: true,
      score: 0,
      streak: 0,
      questionIndex: 0,
      currentOrder: order,
      availableCoins: coins,
      selectedCoins: [],
      paidTotal: 0,
      hintsUsed: 0,
      maxHints: settings.mode === 'practice' ? 999 : 3,
      timeRemaining: settings.mode === 'timeattack' ? settings.timerSeconds : undefined,
      recentItems: [...recentItems, order.item.id],
    });

    // Save updated recent items
    saveRecentItems([...recentItems, order.item.id]);
  },

  stopGame: () => {
    const { score, stats, questionIndex } = get();
    const correctCount = questionIndex;
    
    recordFruitShopGame(correctCount, questionIndex, score, 0);

    const player = loadPlayer();
    if (player && score > 0) {
      addLeaderboardEntry(player.name, player.avatar, score, 'fruit-shop');
    }

    if (score > stats.bestScore) {
      audioManager.playCelebration();
    } else {
      audioManager.playGameOver();
    }

    set({
      isPlaying: false,
      stats: loadFruitShopStats(),
    });
  },

  addCoinToTray: (coin: Coin) => {
    const state = get();
    if (!state.isPlaying || !state.currentOrder) return;

    // Remove coin from available
    const newAvailableCoins = state.availableCoins.filter(c => c.id !== coin.id);
    const newSelectedCoins = [...state.selectedCoins, coin];
    const newPaidTotal = calculatePaidTotal(newSelectedCoins);

    // Play sound
    audioManager.playPop();

    // Check if overpaid (without exact change requirement)
    if (!state.settings.exactChangeRequired && newPaidTotal > state.currentOrder.total) {
      // Allow overpayment in basic mode, but provide gentle feedback
      // In advanced mode with exactChangeRequired, we'll handle this differently
    }

    set({
      availableCoins: newAvailableCoins,
      selectedCoins: newSelectedCoins,
      paidTotal: newPaidTotal,
    });
  },

  removeCoinFromTray: (coinId: string) => {
    const state = get();
    if (!state.isPlaying) return;

    const coin = state.selectedCoins.find(c => c.id === coinId);
    if (!coin) return;

    const newSelectedCoins = state.selectedCoins.filter(c => c.id !== coinId);
    const newAvailableCoins = [...state.availableCoins, coin];
    const newPaidTotal = calculatePaidTotal(newSelectedCoins);

    audioManager.playPop();

    set({
      availableCoins: newAvailableCoins,
      selectedCoins: newSelectedCoins,
      paidTotal: newPaidTotal,
    });
  },

  resetTray: () => {
    const state = get();
    if (!state.isPlaying) return;

    // Return all selected coins to available
    const newAvailableCoins = [...state.availableCoins, ...state.selectedCoins];

    set({
      availableCoins: newAvailableCoins,
      selectedCoins: [],
      paidTotal: 0,
    });
  },

  submitPayment: () => {
    const state = get();
    if (!state.isPlaying || !state.currentOrder) return;

    const isCorrect = isPaymentCorrect(
      state.paidTotal,
      state.currentOrder.total,
      state.settings.exactChangeRequired
    );

    if (isCorrect) {
      audioManager.playCorrect();
      
      const newStreak = state.streak + 1;
      const points = calculateFruitShopScore(
        state.streak,
        true,
        state.settings.mode,
        state.currentOrder.total
      );
      const newScore = state.score + points;

      // Streak milestones
      if (newStreak === 5) {
        // Show "Hot streak!" message
      } else if (newStreak === 10) {
        audioManager.playCelebration();
      }

      set({
        score: newScore,
        streak: newStreak,
        questionIndex: state.questionIndex + 1,
      });

      // Generate next order after a brief delay
      setTimeout(() => {
        get().nextOrder();
      }, 1000);
    } else {
      audioManager.playIncorrect();
      
      // Wrong payment
      const newStreak = 0;
      const points = calculateFruitShopScore(
        state.streak,
        false,
        state.settings.mode,
        state.currentOrder.total
      );
      const newScore = Math.max(0, state.score + points);

      set({
        score: newScore,
        streak: newStreak,
      });
    }
  },

  nextOrder: () => {
    const { settings, recentItems, isPlaying } = get();
    if (!isPlaying) return;

    const order = generateOrder(settings.level, recentItems);
    const coins = generateCoinsForLevel(settings.level, order.total);

    const newRecentItems = [...recentItems, order.item.id].slice(-5);
    saveRecentItems(newRecentItems);

    set({
      currentOrder: order,
      availableCoins: coins,
      selectedCoins: [],
      paidTotal: 0,
      recentItems: newRecentItems,
    });
  },

  updateSettings: (newSettings: Partial<FruitShopSettings>) => {
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    saveFruitShopSettings(updatedSettings);
    audioManager.setEnabled(updatedSettings.soundOn);
    
    set({
      settings: updatedSettings,
    });
  },

  resetGame: () => {
    set({
      ...initialState,
      settings: get().settings,
      stats: get().stats,
      recentItems: get().recentItems,
    });
  },

  decrementTimer: () => {
    const { timeRemaining, isPlaying } = get();
    if (!isPlaying || timeRemaining === undefined) return;

    const newTime = timeRemaining - 1;

    if (newTime <= 0) {
      get().stopGame();
    } else {
      set({ timeRemaining: newTime });
    }
  },

  getHint: () => {
    const state = get();
    if (!state.currentOrder) return null;
    
    const hints = generateHints(state.currentOrder);
    const currentHintIndex = Math.min(state.hintsUsed, hints.length - 1);
    
    set({ hintsUsed: state.hintsUsed + 1 });
    
    return hints[currentHintIndex];
  },
}));
