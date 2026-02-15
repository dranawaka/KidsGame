// Target Shoot game types

export type Operation = '+' | '-' | '×' | '÷';

export type GameMode = 'practice' | 'timeAttack';

export interface Question {
  prompt: string;
  correctAnswer: number;
  operation: Operation;
  operands: number[];
}

export interface Target {
  id: string;
  value: number;
  isCorrect: boolean;
  x: number; // position as percentage (0-100)
  y: number; // position as percentage (0-100)
  speedX: number; // pixels per frame
  speedY: number; // pixels per frame
  direction: 1 | -1; // 1 for right, -1 for left
}

export type TargetSpeedSetting = 'very-slow' | 'slow' | 'normal' | 'fast' | 'very-fast';

export interface GameSettings {
  mode: GameMode;
  level: number; // 1-10
  soundOn: boolean;
  reduceMotion: boolean;
  targetCount: number; // 6-10
  timerSeconds: number; // for time attack mode
  targetSpeed: TargetSpeedSetting; // User-controlled speed multiplier
}

export interface GameState {
  score: number;
  streak: number;
  questionIndex: number;
  accuracyWindow: boolean[]; // last 10 answers
  isPlaying: boolean;
  currentQuestion: Question | null;
  targets: Target[];
  timeRemaining?: number; // for time attack mode
  level: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface GameStats {
  totalCorrect: number;
  totalAttempts: number;
  bestScore: number;
  gamesPlayed: number;
  bestStreak: number;
}

export interface LevelConfig {
  level: number;
  operations: Operation[];
  minRange: number;
  maxRange: number;
  targetSpeed: 'slow' | 'medium' | 'fast';
  description: string;
}

export const DEFAULT_SETTINGS: GameSettings = {
  mode: 'practice',
  level: 1,
  soundOn: true,
  reduceMotion: false,
  targetCount: 8,
  timerSeconds: 60,
  targetSpeed: 'normal',
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, operations: ['+'], minRange: 0, maxRange: 5, targetSpeed: 'slow', description: 'Simple addition (0-5)' },
  { level: 2, operations: ['+'], minRange: 0, maxRange: 10, targetSpeed: 'slow', description: 'Addition (0-10)' },
  { level: 3, operations: ['-'], minRange: 0, maxRange: 10, targetSpeed: 'slow', description: 'Subtraction (0-10)' },
  { level: 4, operations: ['+', '-'], minRange: 0, maxRange: 20, targetSpeed: 'medium', description: 'Mixed +/- (0-20)' },
  { level: 5, operations: ['×'], minRange: 0, maxRange: 5, targetSpeed: 'medium', description: 'Multiplication (0-5)' },
  { level: 6, operations: ['×'], minRange: 0, maxRange: 10, targetSpeed: 'medium', description: 'Multiplication (0-10)' },
  { level: 7, operations: ['÷'], minRange: 0, maxRange: 50, targetSpeed: 'fast', description: 'Division' },
  { level: 8, operations: ['+', '-', '×'], minRange: 0, maxRange: 100, targetSpeed: 'fast', description: 'Mixed operations (0-100)' },
  { level: 9, operations: ['×'], minRange: 0, maxRange: 12, targetSpeed: 'fast', description: 'Times tables (0-12)' },
  { level: 10, operations: ['+', '-', '×', '÷'], minRange: 0, maxRange: 100, targetSpeed: 'fast', description: 'Master level' },
];

// Speed multipliers for different difficulty levels
export const SPEED_MULTIPLIERS = {
  slow: 1,
  medium: 1.5,
  fast: 2.2,
};

// User-controlled speed multipliers
export const TARGET_SPEED_MULTIPLIERS: Record<TargetSpeedSetting, number> = {
  'very-slow': 0.4,
  'slow': 0.7,
  'normal': 1.0,
  'fast': 1.4,
  'very-fast': 2.0,
};
