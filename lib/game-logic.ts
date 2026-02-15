import { Question, Operation, BubbleChoice, LevelConfig, LEVEL_CONFIGS } from '@/types/game';

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a question based on operation type and difficulty range
 */
export function generateQuestion(operation: Operation, minRange: number, maxRange: number): Question {
  let a: number, b: number, correctAnswer: number, prompt: string;

  switch (operation) {
    case '+':
      a = randomInt(minRange, maxRange);
      b = randomInt(minRange, maxRange - a);
      correctAnswer = a + b;
      prompt = `${a} + ${b} = ?`;
      break;

    case '-':
      // Ensure non-negative result
      a = randomInt(minRange + 1, maxRange);
      b = randomInt(minRange, a);
      correctAnswer = a - b;
      prompt = `${a} - ${b} = ?`;
      break;

    case '×':
      a = randomInt(Math.max(0, minRange), Math.min(12, maxRange));
      b = randomInt(Math.max(0, minRange), Math.min(12, maxRange));
      correctAnswer = a * b;
      prompt = `${a} × ${b} = ?`;
      break;

    case '÷':
      // Generate clean division (whole number result)
      b = randomInt(Math.max(1, minRange), Math.min(12, Math.floor(maxRange / 5)));
      const quotient = randomInt(Math.max(1, minRange), Math.min(10, Math.floor(maxRange / b)));
      a = b * quotient;
      correctAnswer = quotient;
      prompt = `${a} ÷ ${b} = ?`;
      break;

    default:
      a = randomInt(minRange, maxRange);
      b = randomInt(minRange, maxRange);
      correctAnswer = a + b;
      prompt = `${a} + ${b} = ?`;
  }

  return {
    prompt,
    correctAnswer,
    operation,
    operands: [a, b],
  };
}

/**
 * Generate distractor (wrong) answers that are plausible
 */
function generateDistractors(
  correctAnswer: number,
  operation: Operation,
  operands: number[],
  count: number,
  minRange: number,
  maxRange: number
): number[] {
  const distractors = new Set<number>();
  const [a, b] = operands;

  // Strategy 1: Near misses
  const nearMisses = [
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 3,
    correctAnswer - 3,
  ].filter(n => n >= minRange && n <= maxRange * 2 && n !== correctAnswer && n >= 0);

  nearMisses.forEach(n => distractors.add(n));

  // Strategy 2: Common mistakes
  if (operation === '-' && a - b >= 0) {
    const swapped = b - a;
    if (swapped >= 0 && swapped !== correctAnswer) {
      distractors.add(swapped);
    }
  }

  if (operation === '×') {
    // Common mistake: adding instead of multiplying
    if (a + b !== correctAnswer) distractors.add(a + b);
    // Off by one in multiplication
    if (a * (b + 1) !== correctAnswer) distractors.add(a * (b + 1));
    if (a * (b - 1) >= 0 && a * (b - 1) !== correctAnswer) distractors.add(a * (b - 1));
  }

  if (operation === '÷') {
    // Common mistakes in division
    if (a !== correctAnswer) distractors.add(a); // using dividend
    if (b !== correctAnswer) distractors.add(b); // using divisor
  }

  // Strategy 3: Fill with randoms if needed
  const maxAttempts = 50;
  let attempts = 0;
  while (distractors.size < count && attempts < maxAttempts) {
    const range = maxRange - minRange;
    const random = randomInt(
      Math.max(0, correctAnswer - range),
      correctAnswer + range
    );
    if (random !== correctAnswer && random >= 0) {
      distractors.add(random);
    }
    attempts++;
  }

  return Array.from(distractors).slice(0, count);
}

/**
 * Generate bubble choices for a question
 */
export function generateBubbles(
  question: Question,
  count: number,
  minRange: number,
  maxRange: number
): BubbleChoice[] {
  const distractorCount = count - 1;
  const distractors = generateDistractors(
    question.correctAnswer,
    question.operation,
    question.operands,
    distractorCount,
    minRange,
    maxRange
  );

  const choices: BubbleChoice[] = [
    {
      id: 'correct',
      value: question.correctAnswer,
      isCorrect: true,
    },
    ...distractors.map((value, idx) => ({
      id: `distractor-${idx}`,
      value,
      isCorrect: false,
    })),
  ];

  return shuffle(choices);
}

/**
 * Get level configuration
 */
export function getLevelConfig(level: number): LevelConfig {
  const clampedLevel = Math.max(1, Math.min(10, level));
  return LEVEL_CONFIGS[clampedLevel - 1];
}

/**
 * Generate a complete question with bubbles for the current level
 */
export function generateQuestionForLevel(level: number, bubbleCount: number): {
  question: Question;
  bubbles: BubbleChoice[];
} {
  const config = getLevelConfig(level);
  
  // Pick a random operation from available operations
  const operation = config.operations[randomInt(0, config.operations.length - 1)];
  
  const question = generateQuestion(operation, config.minRange, config.maxRange);
  const bubbles = generateBubbles(question, bubbleCount, config.minRange, config.maxRange);

  return { question, bubbles };
}

/**
 * Calculate score for a correct answer
 */
export function calculateScore(streak: number, isCorrect: boolean, mode: 'practice' | 'challenge'): number {
  if (!isCorrect) {
    return mode === 'challenge' ? -2 : 0;
  }

  const basePoints = 10;
  const streakBonus = Math.min(20, 2 * streak);
  return basePoints + streakBonus;
}

/**
 * Determine if level should be adjusted based on recent accuracy
 */
export function shouldAdjustLevel(accuracyWindow: boolean[]): {
  shouldIncrease: boolean;
  shouldDecrease: boolean;
} {
  if (accuracyWindow.length < 10) {
    return { shouldIncrease: false, shouldDecrease: false };
  }

  const recentAnswers = accuracyWindow.slice(-10);
  const correctCount = recentAnswers.filter(Boolean).length;
  const accuracy = correctCount / 10;

  return {
    shouldIncrease: accuracy > 0.85,
    shouldDecrease: accuracy < 0.55,
  };
}

/**
 * Adjust level based on performance
 */
export function adjustLevel(currentLevel: number, accuracyWindow: boolean[]): number {
  const { shouldIncrease, shouldDecrease } = shouldAdjustLevel(accuracyWindow);

  if (shouldIncrease) {
    return Math.min(10, currentLevel + 1);
  }

  if (shouldDecrease) {
    return Math.max(1, currentLevel - 1);
  }

  return currentLevel;
}
