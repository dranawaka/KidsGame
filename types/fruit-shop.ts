// Fruit Shop game types

export type FruitShopGameMode = 'practice' | 'timeattack';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface FruitItem {
  id: string;
  name: string;
  emoji: string;
  category: 'fruit' | 'snack' | 'drink';
}

export interface Order {
  id: string;
  item: FruitItem;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Coin {
  id: string;
  value: number;
  label: string;
  color: string;
}

export interface DraggedCoin extends Coin {
  position: { x: number; y: number };
  isDragging: boolean;
}

export interface FruitShopSettings {
  mode: FruitShopGameMode;
  level: number; // 1-10
  difficultyLevel: DifficultyLevel;
  soundOn: boolean;
  timerSeconds: number; // for time attack mode
  showHints: boolean;
  exactChangeRequired: boolean; // advanced mode
}

export interface FruitShopState {
  score: number;
  streak: number;
  questionIndex: number;
  isPlaying: boolean;
  currentOrder: Order | null;
  availableCoins: Coin[];
  selectedCoins: Coin[];
  paidTotal: number;
  timeRemaining?: number;
  hintsUsed: number;
  maxHints: number;
}

export interface FruitShopStats {
  totalCorrect: number;
  totalAttempts: number;
  bestScore: number;
  gamesPlayed: number;
  totalEarned: number; // total money counted correctly
}

export interface LevelConfig {
  level: number;
  difficultyLevel: DifficultyLevel;
  quantityRange: [number, number];
  priceRange: [number, number];
  maxTotal: number;
  availableCoinValues: number[];
  description: string;
}

// Available fruit items
export const FRUIT_ITEMS: FruitItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'fruit' },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'fruit' },
  { id: 'orange', name: 'Orange', emoji: '🍊', category: 'fruit' },
  { id: 'grape', name: 'Grapes', emoji: '🍇', category: 'fruit' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'fruit' },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'fruit' },
  { id: 'cookie', name: 'Cookie', emoji: '🍪', category: 'snack' },
  { id: 'donut', name: 'Donut', emoji: '🍩', category: 'snack' },
  { id: 'candy', name: 'Candy', emoji: '🍬', category: 'snack' },
  { id: 'juice', name: 'Juice', emoji: '🧃', category: 'drink' },
];

// Coin definitions
export const COIN_DEFINITIONS: Record<number, { label: string; color: string }> = {
  1: { label: '$1', color: 'bg-amber-400' },
  2: { label: '$2', color: 'bg-emerald-400' },
  5: { label: '$5', color: 'bg-blue-400' },
  10: { label: '$10', color: 'bg-purple-400' },
  20: { label: '$20', color: 'bg-pink-400' },
};

// Level configurations
export const FRUIT_SHOP_LEVELS: LevelConfig[] = [
  // Beginner (Ages 4-5)
  {
    level: 1,
    difficultyLevel: 'beginner',
    quantityRange: [1, 3],
    priceRange: [1, 1],
    maxTotal: 5,
    availableCoinValues: [1],
    description: 'Count to 5 with $1 coins',
  },
  {
    level: 2,
    difficultyLevel: 'beginner',
    quantityRange: [1, 5],
    priceRange: [1, 2],
    maxTotal: 10,
    availableCoinValues: [1],
    description: 'Count to 10 with $1 coins',
  },
  {
    level: 3,
    difficultyLevel: 'beginner',
    quantityRange: [2, 5],
    priceRange: [1, 2],
    maxTotal: 10,
    availableCoinValues: [1, 2],
    description: 'Use $1 and $2 coins',
  },
  
  // Intermediate (Ages 6-7)
  {
    level: 4,
    difficultyLevel: 'intermediate',
    quantityRange: [2, 6],
    priceRange: [1, 3],
    maxTotal: 15,
    availableCoinValues: [1, 2, 5],
    description: 'Counting by 2s and 5s',
  },
  {
    level: 5,
    difficultyLevel: 'intermediate',
    quantityRange: [3, 8],
    priceRange: [1, 4],
    maxTotal: 25,
    availableCoinValues: [1, 2, 5],
    description: 'Practice multiplication',
  },
  {
    level: 6,
    difficultyLevel: 'intermediate',
    quantityRange: [3, 10],
    priceRange: [1, 5],
    maxTotal: 30,
    availableCoinValues: [1, 2, 5],
    description: 'Larger totals',
  },
  
  // Advanced (Ages 8-10)
  {
    level: 7,
    difficultyLevel: 'advanced',
    quantityRange: [4, 10],
    priceRange: [2, 6],
    maxTotal: 40,
    availableCoinValues: [1, 2, 5, 10],
    description: 'Add $10 bills',
  },
  {
    level: 8,
    difficultyLevel: 'advanced',
    quantityRange: [5, 12],
    priceRange: [2, 8],
    maxTotal: 50,
    availableCoinValues: [1, 2, 5, 10],
    description: 'Larger multiplication',
  },
  {
    level: 9,
    difficultyLevel: 'advanced',
    quantityRange: [4, 12],
    priceRange: [3, 10],
    maxTotal: 60,
    availableCoinValues: [1, 2, 5, 10, 20],
    description: 'Master level with $20',
  },
  {
    level: 10,
    difficultyLevel: 'advanced',
    quantityRange: [5, 15],
    priceRange: [3, 10],
    maxTotal: 80,
    availableCoinValues: [1, 2, 5, 10, 20],
    description: 'Expert money math',
  },
];

export const DEFAULT_FRUIT_SHOP_SETTINGS: FruitShopSettings = {
  mode: 'practice',
  level: 1,
  difficultyLevel: 'beginner',
  soundOn: true,
  timerSeconds: 60,
  showHints: true,
  exactChangeRequired: false,
};
