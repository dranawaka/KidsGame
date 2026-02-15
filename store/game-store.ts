import { create } from 'zustand';
import { GameSettings, GameState, GameStats, DEFAULT_SETTINGS } from '@/types/game';
import { generateQuestionForLevel, calculateScore, adjustLevel } from '@/lib/game-logic';
import { loadSettings, saveSettings, loadStats, recordGame } from '@/lib/storage';
import { audioManager } from '@/lib/audio';

interface GameStore extends GameState {
  settings: GameSettings;
  stats: GameStats;
  
  // Actions
  initGame: () => void;
  startGame: () => void;
  stopGame: () => void;
  answerQuestion: (bubbleId: string) => void;
  nextQuestion: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetGame: () => void;
  decrementTimer: () => void;
}

const initialState: GameState = {
  score: 0,
  streak: 0,
  hearts: 3,
  questionIndex: 0,
  accuracyWindow: [],
  isPlaying: false,
  currentQuestion: null,
  bubbles: [],
  level: 1,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  settings: DEFAULT_SETTINGS,
  stats: {
    totalCorrect: 0,
    totalAttempts: 0,
    bestScore: 0,
    gamesPlayed: 0,
  },

  initGame: () => {
    const settings = loadSettings();
    const stats = loadStats();
    audioManager.setEnabled(settings.soundOn);
    
    set({
      settings,
      stats,
      level: settings.level,
      hearts: settings.hearts,
    });
  },

  startGame: () => {
    const { settings } = get();
    const { question, bubbles } = generateQuestionForLevel(settings.level, settings.bubbleCount);

    // Speak the question if voice is enabled
    if (settings.voiceOn) {
      audioManager.speak(question.prompt, true);
    }

    set({
      isPlaying: true,
      score: 0,
      streak: 0,
      hearts: settings.hearts,
      questionIndex: 0,
      accuracyWindow: [],
      currentQuestion: question,
      bubbles,
      level: settings.level,
      timeRemaining: settings.mode === 'challenge' ? settings.timerSeconds : undefined,
    });
  },

  stopGame: () => {
    const { score, stats, questionIndex, accuracyWindow } = get();
    const correctCount = accuracyWindow.filter(Boolean).length;
    
    recordGame(correctCount, questionIndex, score);

    // Check for new best score
    if (score > stats.bestScore) {
      audioManager.playCelebration();
    } else {
      audioManager.playGameOver();
    }

    set({
      isPlaying: false,
      stats: loadStats(), // Reload updated stats
    });
  },

  answerQuestion: (bubbleId: string) => {
    const state = get();
    if (!state.isPlaying || !state.currentQuestion) return;

    const selectedBubble = state.bubbles.find(b => b.id === bubbleId);
    if (!selectedBubble) return;

    const isCorrect = selectedBubble.isCorrect;
    
    // Play sound
    audioManager.playPop();
    
    setTimeout(() => {
      if (isCorrect) {
        audioManager.playCorrect();
      } else {
        audioManager.playIncorrect();
      }
    }, 100);

    // Update accuracy window
    const newAccuracyWindow = [...state.accuracyWindow, isCorrect];
    if (newAccuracyWindow.length > 10) {
      newAccuracyWindow.shift();
    }

    // Calculate score
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const points = calculateScore(state.streak, isCorrect, state.settings.mode);
    const newScore = Math.max(0, state.score + points);

    // Update hearts
    let newHearts = state.hearts;
    if (!isCorrect && state.settings.mode === 'challenge') {
      newHearts = Math.max(0, state.hearts - 1);
    }

    // Check for level adjustment
    const newLevel = adjustLevel(state.level, newAccuracyWindow);
    if (newLevel !== state.level) {
      if (newLevel > state.level) {
        audioManager.playCelebration();
      }
    }

    // Check for game over
    const shouldEndGame = 
      (state.settings.mode === 'challenge' && newHearts === 0) ||
      (state.timeRemaining !== undefined && state.timeRemaining <= 0);

    if (shouldEndGame) {
      set({
        score: newScore,
        streak: newStreak,
        hearts: newHearts,
        accuracyWindow: newAccuracyWindow,
        level: newLevel,
      });
      get().stopGame();
      return;
    }

    set({
      score: newScore,
      streak: newStreak,
      hearts: newHearts,
      questionIndex: state.questionIndex + 1,
      accuracyWindow: newAccuracyWindow,
      level: newLevel,
    });

    // Generate next question after a brief delay
    setTimeout(() => {
      get().nextQuestion();
    }, 1000);
  },

  nextQuestion: () => {
    const { settings, level, isPlaying } = get();
    if (!isPlaying) return;

    const { question, bubbles } = generateQuestionForLevel(level, settings.bubbleCount);

    // Speak the question if voice is enabled
    if (settings.voiceOn) {
      audioManager.speak(question.prompt, true);
    }

    set({
      currentQuestion: question,
      bubbles,
    });
  },

  updateSettings: (newSettings: Partial<GameSettings>) => {
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    saveSettings(updatedSettings);
    audioManager.setEnabled(updatedSettings.soundOn);
    
    set({
      settings: updatedSettings,
      level: updatedSettings.level,
      hearts: updatedSettings.hearts,
    });
  },

  resetGame: () => {
    set({
      ...initialState,
      settings: get().settings,
      stats: get().stats,
      level: get().settings.level,
      hearts: get().settings.hearts,
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
}));
