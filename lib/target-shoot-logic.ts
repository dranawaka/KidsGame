import { Question, Operation, Target, LevelConfig, LEVEL_CONFIGS, SPEED_MULTIPLIERS } from '@/types/target-shoot';

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

  // Strategy 2: Common mistakes based on operation
  switch (operation) {
    case '+':
      // Addition mistakes
      distractors.add(Math.abs(a - b)); // subtraction instead
      distractors.add(a * b); // multiplication instead
      break;

    case '-':
      // Subtraction mistakes
      distractors.add(a + b); // addition instead
      distractors.add(b - a < 0 ? 0 : b - a); // reversed operands
      break;

    case '×':
      // Multiplication mistakes
      distractors.add(a + b); // addition instead
      if (b > 1) distractors.add(a * (b - 1)); // off by one table
      if (b < 12) distractors.add(a * (b + 1)); // off by one table
      break;

    case '÷':
      // Division mistakes
      if (b > 0) {
        distractors.add(a); // didn't divide
        distractors.add(b); // reversed
        if (correctAnswer > 1) distractors.add(correctAnswer + 1);
        if (correctAnswer < 10) distractors.add(correctAnswer - 1);
      }
      break;
  }

  // Strategy 3: Random plausible values in range
  const rangeMin = Math.max(0, correctAnswer - 10);
  const rangeMax = correctAnswer + 10;
  
  while (distractors.size < count + 5) {
    const random = randomInt(rangeMin, rangeMax);
    if (random !== correctAnswer && random >= 0) {
      distractors.add(random);
    }
  }

  // Convert to array and remove correct answer if accidentally added
  const result = Array.from(distractors)
    .filter(n => n !== correctAnswer)
    .slice(0, count);

  return result;
}

/**
 * Generate targets with one correct answer and distractors
 */
export function generateTargets(
  question: Question,
  targetCount: number,
  minRange: number,
  maxRange: number,
  speedMultiplier: number,
  reduceMotion: boolean
): Target[] {
  const { correctAnswer, operation, operands } = question;

  // Generate distractor values
  const distractorValues = generateDistractors(
    correctAnswer,
    operation,
    operands,
    targetCount - 1,
    minRange,
    maxRange
  );

  // Create target objects
  const targetValues = shuffle([correctAnswer, ...distractorValues]).slice(0, targetCount);

  const targets: Target[] = targetValues.map((value, index) => {
    // Random starting position
    const x = randomInt(5, 90); // 5% to 90% horizontal
    const y = randomInt(15, 75); // 15% to 75% vertical (leave room for header and footer)

    // Random direction
    const direction = Math.random() > 0.5 ? 1 : -1;

    // Base speed with some variation
    const baseSpeed = reduceMotion ? 0.3 : 1.2;
    const speedX = (baseSpeed + Math.random() * 0.8) * speedMultiplier * direction;
    const speedY = (Math.random() * 0.3 - 0.15) * speedMultiplier; // Slight vertical bobbing

    return {
      id: `target-${index}-${Date.now()}`,
      value,
      isCorrect: value === correctAnswer,
      x,
      y,
      speedX,
      speedY,
      direction,
    };
  });

  return targets;
}

/**
 * Update target positions with enhanced bouncing (call this each animation frame)
 */
export function updateTargetPositions(targets: Target[], deltaTime: number = 16): Target[] {
  return targets.map(target => {
    let newX = target.x + (target.speedX * deltaTime) / 16;
    let newY = target.y + (target.speedY * deltaTime) / 16;
    let newDirection = target.direction;
    let newSpeedX = target.speedX;
    let newSpeedY = target.speedY;

    // Bounce off horizontal walls with velocity reversal
    if (newX <= 5) {
      newX = 5;
      newDirection = 1;
      newSpeedX = Math.abs(target.speedX) * 0.95; // Slight dampening on bounce
      // Add small vertical bounce effect when hitting sides
      newSpeedY = target.speedY + (Math.random() - 0.5) * 0.3;
    } else if (newX >= 90) {
      newX = 90;
      newDirection = -1;
      newSpeedX = -Math.abs(target.speedX) * 0.95;
      // Add small vertical bounce effect when hitting sides
      newSpeedY = target.speedY + (Math.random() - 0.5) * 0.3;
    }

    // Bounce off vertical walls with velocity reversal and dampening
    if (newY <= 15) {
      newY = 15;
      newSpeedY = Math.abs(target.speedY) * 0.8; // Bounce back down
    } else if (newY >= 75) {
      newY = 75;
      newSpeedY = -Math.abs(target.speedY) * 0.8; // Bounce back up
    }

    // Apply slight gravity effect for more realistic bouncing
    newSpeedY = newSpeedY + 0.02;

    // Clamp vertical speed to prevent targets from moving too fast vertically
    newSpeedY = Math.max(-1.5, Math.min(1.5, newSpeedY));

    return {
      ...target,
      x: newX,
      y: newY,
      direction: newDirection,
      speedX: newSpeedX,
      speedY: newSpeedY,
    };
  });
}

/**
 * Generate a question appropriate for the current level
 */
export function generateQuestionForLevel(level: number): Question {
  const config = LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];
  const operation = config.operations[randomInt(0, config.operations.length - 1)];
  return generateQuestion(operation, config.minRange, config.maxRange);
}

/**
 * Get speed multiplier for a level
 */
export function getSpeedMultiplier(level: number): number {
  const config = LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];
  return SPEED_MULTIPLIERS[config.targetSpeed];
}

/**
 * Calculate score bonus based on streak
 */
export function calculateStreakBonus(streak: number): number {
  return Math.min(streak, 10); // Max bonus of 10 points
}

/**
 * Calculate time bonus (for time attack mode)
 */
export function calculateTimeBonus(secondsRemaining: number): number {
  return Math.max(0, Math.floor(secondsRemaining));
}

/**
 * Adjust level based on accuracy (adaptive difficulty)
 * Only adjusts after 10 answers
 */
export function adjustLevel(currentLevel: number, accuracyWindow: boolean[]): number {
  if (accuracyWindow.length < 10) {
    return currentLevel; // Not enough data yet
  }

  const recentAnswers = accuracyWindow.slice(-10);
  const correctCount = recentAnswers.filter(Boolean).length;
  const accuracy = correctCount / 10;

  if (accuracy >= 0.85 && currentLevel < 10) {
    return currentLevel + 1; // Level up!
  } else if (accuracy <= 0.55 && currentLevel > 1) {
    return currentLevel - 1; // Level down for more practice
  }

  return currentLevel;
}

/**
 * Get level configuration
 */
export function getLevelConfig(level: number): LevelConfig {
  return LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];
}
