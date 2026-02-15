// Core game types

export type Operation = '+' | '-' | '×' | '÷';

export type GameMode = 'practice' | 'challenge';

export interface Question {
  prompt: string;
  correctAnswer: number;
  operation: Operation;
  operands: number[];
}

export interface BubbleChoice {
  id: string;
  value: number;
  isCorrect: boolean;
}

export interface GameSettings {
  mode: GameMode;
  level: number; // 1-10
  operationsEnabled: Operation[];
  soundOn: boolean;
  voiceOn: boolean;
  reduceMotion: boolean;
  bubbleCount: number; // 6-12
  timerSeconds: number; // for challenge mode
  hearts: number; // optional, 3-5
}

export interface GameState {
  score: number;
  streak: number;
  hearts: number;
  questionIndex: number;
  accuracyWindow: boolean[]; // last 10 answers
  isPlaying: boolean;
  currentQuestion: Question | null;
  bubbles: BubbleChoice[];
  timeRemaining?: number; // for challenge mode
  level: number;
}

export interface GameStats {
  totalCorrect: number;
  totalAttempts: number;
  bestScore: number;
  gamesPlayed: number;
}

export interface LevelConfig {
  level: number;
  operations: Operation[];
  minRange: number;
  maxRange: number;
  description: string;
}

export const DEFAULT_SETTINGS: GameSettings = {
  mode: 'practice',
  level: 1,
  operationsEnabled: ['+'],
  soundOn: true,
  voiceOn: false,
  reduceMotion: false,
  bubbleCount: 8,
  timerSeconds: 90,
  hearts: 3,
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, operations: ['+'], minRange: 0, maxRange: 5, description: 'Counting basics' },
  { level: 2, operations: ['+'], minRange: 0, maxRange: 10, description: 'Simple addition' },
  { level: 3, operations: ['-'], minRange: 0, maxRange: 10, description: 'Basic subtraction' },
  { level: 4, operations: ['+', '-'], minRange: 0, maxRange: 20, description: 'Mixed operations' },
  { level: 5, operations: ['×'], minRange: 0, maxRange: 5, description: 'Times tables intro' },
  { level: 6, operations: ['×'], minRange: 0, maxRange: 10, description: 'More multiplication' },
  { level: 7, operations: ['÷'], minRange: 0, maxRange: 50, description: 'Simple division' },
  { level: 8, operations: ['+', '-'], minRange: 0, maxRange: 100, description: 'Larger numbers' },
  { level: 9, operations: ['×'], minRange: 0, maxRange: 12, description: 'Complete times tables' },
  { level: 10, operations: ['+', '-', '×', '÷'], minRange: 0, maxRange: 100, description: 'Master level' },
];
