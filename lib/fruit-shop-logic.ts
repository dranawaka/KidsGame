import {
  Order,
  Coin,
  FruitItem,
  LevelConfig,
  FRUIT_ITEMS,
  FRUIT_SHOP_LEVELS,
  COIN_DEFINITIONS,
} from '@/types/fruit-shop';

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
 * Get level configuration
 */
export function getLevelConfig(level: number): LevelConfig {
  const clampedLevel = Math.max(1, Math.min(10, level));
  return FRUIT_SHOP_LEVELS[clampedLevel - 1];
}

/**
 * Generate an order for the current level
 */
export function generateOrder(level: number, previousItems: string[] = []): Order {
  const config = getLevelConfig(level);
  
  // Filter out recently used items to avoid repetition
  let availableItems = FRUIT_ITEMS;
  if (previousItems.length > 0) {
    availableItems = FRUIT_ITEMS.filter(item => !previousItems.includes(item.id));
    if (availableItems.length === 0) {
      availableItems = FRUIT_ITEMS; // Reset if all have been used
    }
  }
  
  // Pick a random item
  const item = availableItems[randomInt(0, availableItems.length - 1)];
  
  // Generate quantity and price within range
  const quantity = randomInt(config.quantityRange[0], config.quantityRange[1]);
  const unitPrice = randomInt(config.priceRange[0], config.priceRange[1]);
  
  // Calculate total
  const total = quantity * unitPrice;
  
  // Ensure total doesn't exceed max
  if (total > config.maxTotal) {
    // Adjust quantity to fit
    const adjustedQuantity = Math.floor(config.maxTotal / unitPrice);
    return {
      id: `order-${Date.now()}`,
      item,
      quantity: Math.max(1, adjustedQuantity),
      unitPrice,
      total: Math.max(1, adjustedQuantity) * unitPrice,
    };
  }
  
  return {
    id: `order-${Date.now()}`,
    item,
    quantity,
    unitPrice,
    total,
  };
}

/**
 * Generate available coins for the level with smart quantities
 */
export function generateCoinsForLevel(level: number, orderTotal: number): Coin[] {
  const config = getLevelConfig(level);
  const coins: Coin[] = [];
  
  // Calculate how many of each coin to provide
  const coinCounts: Record<number, number> = {};
  
  config.availableCoinValues.forEach(value => {
    // Base count - ensure we have enough to make the total
    let count = Math.ceil(orderTotal / value) + 2; // Extra coins for flexibility
    
    // Adjust counts to be reasonable
    if (value === 1) {
      count = Math.min(12, count); // Max 12 $1 coins
    } else if (value === 2) {
      count = Math.min(8, count); // Max 8 $2 coins
    } else if (value === 5) {
      count = Math.min(6, count); // Max 6 $5 coins
    } else if (value === 10) {
      count = Math.min(4, count); // Max 4 $10 bills
    } else if (value === 20) {
      count = Math.min(3, count); // Max 3 $20 bills
    }
    
    coinCounts[value] = count;
  });
  
  // Create coin objects
  let coinId = 0;
  Object.entries(coinCounts).forEach(([value, count]) => {
    const coinValue = parseInt(value);
    const def = COIN_DEFINITIONS[coinValue];
    
    for (let i = 0; i < count; i++) {
      coins.push({
        id: `coin-${coinValue}-${coinId++}`,
        value: coinValue,
        label: def.label,
        color: def.color,
      });
    }
  });
  
  return shuffle(coins);
}

/**
 * Calculate the total value of selected coins
 */
export function calculatePaidTotal(coins: Coin[]): number {
  return coins.reduce((sum, coin) => sum + coin.value, 0);
}

/**
 * Check if payment is correct
 */
export function isPaymentCorrect(
  paidTotal: number,
  requiredTotal: number,
  exactChangeRequired: boolean
): boolean {
  if (exactChangeRequired) {
    return paidTotal === requiredTotal;
  }
  return paidTotal >= requiredTotal;
}

/**
 * Generate hints for the current order
 */
export function generateHints(order: Order): string[] {
  const { quantity, unitPrice, total } = order;
  
  const hints: string[] = [];
  
  // Hint 1: Show the multiplication
  hints.push(`💡 Total = ${quantity} × $${unitPrice}`);
  
  // Hint 2: Show repeated addition
  if (quantity <= 5) {
    const additions = Array(quantity).fill(`$${unitPrice}`).join(' + ');
    hints.push(`💡 ${additions} = $${total}`);
  } else {
    hints.push(`💡 Count by ${unitPrice}s: ${quantity} times`);
  }
  
  // Hint 3: Suggest coin combination
  const suggestion = suggestCoins(total);
  hints.push(`💡 Try: ${suggestion}`);
  
  return hints;
}

/**
 * Suggest an efficient coin combination for a total
 */
function suggestCoins(total: number): string {
  const suggestions: string[] = [];
  let remaining = total;
  
  // Greedy algorithm - use largest coins first
  const denominations = [20, 10, 5, 2, 1];
  
  for (const denom of denominations) {
    if (remaining >= denom) {
      const count = Math.floor(remaining / denom);
      if (count > 0) {
        suggestions.push(`${count}×$${denom}`);
        remaining -= count * denom;
      }
    }
  }
  
  return suggestions.join(' + ');
}

/**
 * Calculate score for correct payment
 */
export function calculateFruitShopScore(
  streak: number,
  isCorrect: boolean,
  mode: 'practice' | 'timeattack',
  orderTotal: number
): number {
  if (!isCorrect) {
    return mode === 'timeattack' ? -2 : 0;
  }
  
  const basePoints = 10;
  const streakBonus = Math.min(streak, 10); // Max +10 bonus
  const valueBonus = Math.floor(orderTotal / 5); // Bonus for larger amounts
  
  return basePoints + streakBonus + valueBonus;
}

/**
 * Get random item that hasn't been used recently
 */
export function getRandomItem(excludeIds: string[]): FruitItem {
  let availableItems = FRUIT_ITEMS.filter(item => !excludeIds.includes(item.id));
  
  if (availableItems.length === 0) {
    availableItems = FRUIT_ITEMS;
  }
  
  return availableItems[randomInt(0, availableItems.length - 1)];
}

/**
 * Format money value for display
 */
export function formatMoney(amount: number): string {
  return `$${amount}`;
}
