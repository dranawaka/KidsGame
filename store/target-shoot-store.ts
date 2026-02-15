import { create } from 'zustand';
import { GameState, GameSettings, GameStats, DEFAULT_SETTINGS, Question, Target, TARGET_SPEED_MULTIPLIERS } from '@/types/target-shoot';
import {
  generateQuestionForLevel,
  generateTargets,
  getSpeedMultiplier,
  calculateStreakBonus,
  calculateTimeBonus,
  adjustLevel,
  getLevelConfig,
  updateTargetPositions,
} from '@/lib/target-shoot-logic';
import { loadGameData, saveSettings, saveStats } from '@/lib/target-shoot-storage';

interface TargetShootStore {
  // Game state
  gameState: GameState;
  settings: GameSettings;
  stats: GameStats;
  
  // Actions
  initGame: () => void;
  startGame: () => void;
  shootTarget: (targetId: string) => void;
  nextQuestion: () => void;
  endGame: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  updateTargets: (deltaTime?: number) => void;
  
  // Timer
  tickTimer: () => void;
}

const initialGameState: GameState = {
  score: 0,
  streak: 0,
  questionIndex: 0,
  accuracyWindow: [],
  isPlaying: false,
  currentQuestion: null,
  targets: [],
  timeRemaining: undefined,
  level: 1,
  correctAnswers: 0,
  wrongAnswers: 0,
};

export const useTargetShootStore = create<TargetShootStore>((set, get) => ({
  gameState: initialGameState,
  settings: DEFAULT_SETTINGS,
  stats: {
    totalCorrect: 0,
    totalAttempts: 0,
    bestScore: 0,
    gamesPlayed: 0,
    bestStreak: 0,
  },

  initGame: () => {
    const { settings, stats } = loadGameData();
    set({ settings, stats });
  },

  startGame: () => {
    const { settings } = get();
    const question = generateQuestionForLevel(settings.level);
    const levelSpeedMultiplier = getSpeedMultiplier(settings.level);
    const userSpeedMultiplier = TARGET_SPEED_MULTIPLIERS[settings.targetSpeed];
    const finalSpeedMultiplier = levelSpeedMultiplier * userSpeedMultiplier;
    const config = getLevelConfig(settings.level);
    
    const targets = generateTargets(
      question,
      settings.targetCount,
      config.minRange,
      config.maxRange,
      finalSpeedMultiplier,
      settings.reduceMotion
    );

    set({
      gameState: {
        ...initialGameState,
        isPlaying: true,
        currentQuestion: question,
        targets,
        timeRemaining: settings.mode === 'timeAttack' ? settings.timerSeconds : undefined,
        level: settings.level,
      },
    });
  },

  shootTarget: (targetId: string) => {
    const { gameState, settings, stats } = get();
    const target = gameState.targets.find(t => t.id === targetId);
    
    if (!target || !gameState.currentQuestion) return;

    const isCorrect = target.isCorrect;
    const newAccuracyWindow = [...gameState.accuracyWindow, isCorrect];
    
    // Update stats
    const newStats = {
      ...stats,
      totalAttempts: stats.totalAttempts + 1,
      totalCorrect: stats.totalCorrect + (isCorrect ? 1 : 0),
    };

    if (isCorrect) {
      // Correct answer
      const newStreak = gameState.streak + 1;
      const streakBonus = calculateStreakBonus(newStreak);
      const newScore = gameState.score + 10 + streakBonus;
      
      // Check for best streak
      if (newStreak > newStats.bestStreak) {
        newStats.bestStreak = newStreak;
      }

      set({
        gameState: {
          ...gameState,
          score: newScore,
          streak: newStreak,
          accuracyWindow: newAccuracyWindow,
          correctAnswers: gameState.correctAnswers + 1,
        },
        stats: newStats,
      });

      // Save stats immediately
      saveStats(newStats);

      // Generate next question after brief delay (handled in component)
      setTimeout(() => {
        get().nextQuestion();
      }, 800);
    } else {
      // Wrong answer
      set({
        gameState: {
          ...gameState,
          streak: 0, // Reset streak
          accuracyWindow: newAccuracyWindow,
          wrongAnswers: gameState.wrongAnswers + 1,
        },
        stats: newStats,
      });

      // Save stats
      saveStats(newStats);

      // Continue playing (in practice mode) or show feedback
      setTimeout(() => {
        get().nextQuestion();
      }, 1000);
    }
  },

  nextQuestion: () => {
    const { gameState, settings } = get();
    
    // Check if we should adjust level (adaptive difficulty)
    const newLevel = adjustLevel(gameState.level, gameState.accuracyWindow);
    
    // Generate new question
    const question = generateQuestionForLevel(newLevel);
    const levelSpeedMultiplier = getSpeedMultiplier(newLevel);
    const userSpeedMultiplier = TARGET_SPEED_MULTIPLIERS[settings.targetSpeed];
    const finalSpeedMultiplier = levelSpeedMultiplier * userSpeedMultiplier;
    const config = getLevelConfig(newLevel);
    
    const targets = generateTargets(
      question,
      settings.targetCount,
      config.minRange,
      config.maxRange,
      finalSpeedMultiplier,
      settings.reduceMotion
    );

    set({
      gameState: {
        ...gameState,
        currentQuestion: question,
        targets,
        questionIndex: gameState.questionIndex + 1,
        level: newLevel,
      },
    });
  },

  endGame: () => {
    const { gameState, stats } = get();
    
    // Calculate final score with time bonus (if time attack mode)
    let finalScore = gameState.score;
    if (gameState.timeRemaining !== undefined && gameState.timeRemaining > 0) {
      const timeBonus = calculateTimeBonus(gameState.timeRemaining);
      finalScore += timeBonus;
    }

    // Update best score
    const newStats = {
      ...stats,
      bestScore: Math.max(stats.bestScore, finalScore),
      gamesPlayed: stats.gamesPlayed + 1,
    };

    set({
      gameState: {
        ...gameState,
        isPlaying: false,
        score: finalScore,
      },
      stats: newStats,
    });

    saveStats(newStats);
  },

  updateSettings: (newSettings: Partial<GameSettings>) => {
    const { settings } = get();
    const updatedSettings = { ...settings, ...newSettings };
    set({ settings: updatedSettings });
    saveSettings(updatedSettings);
  },

  updateTargets: (deltaTime = 16) => {
    const { gameState } = get();
    if (!gameState.isPlaying || gameState.targets.length === 0) return;

    const updatedTargets = updateTargetPositions(gameState.targets, deltaTime);
    set({
      gameState: {
        ...gameState,
        targets: updatedTargets,
      },
    });
  },

  tickTimer: () => {
    const { gameState, settings } = get();
    
    if (settings.mode !== 'timeAttack' || gameState.timeRemaining === undefined) {
      return;
    }

    const newTimeRemaining = Math.max(0, gameState.timeRemaining - 1);
    
    set({
      gameState: {
        ...gameState,
        timeRemaining: newTimeRemaining,
      },
    });

    // End game if time runs out
    if (newTimeRemaining === 0) {
      get().endGame();
    }
  },
}));
