'use client';

import { motion } from 'framer-motion';
import { Coin, COIN_DEFINITIONS } from '@/types/fruit-shop';

interface CoinBankProps {
  coins: Coin[];
  onCoinClick: (coin: Coin) => void;
  disabled?: boolean;
}

const COIN_VALUES_ORDERED = [1, 2, 5, 10, 20];

export default function CoinBank({ coins, onCoinClick, disabled = false }: CoinBankProps) {
  // Group coins by value for organized display
  const coinsByValue: Record<number, Coin[]> = {};
  coins.forEach(coin => {
    if (!coinsByValue[coin.value]) {
      coinsByValue[coin.value] = [];
    }
    coinsByValue[coin.value].push(coin);
  });

  const sortedValues = Object.keys(coinsByValue)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="bg-gradient-to-br from-amber-100 to-yellow-200 backdrop-blur rounded-2xl p-6 shadow-xl border-3 border-amber-400">
      <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">💰 Coin Bank</h3>

      {/* Color legend: $1 amber-600, $2 emerald-600, $5 blue-600, $10 purple-600, $20 pink-600 */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {COIN_VALUES_ORDERED.map((value) => {
          const def = COIN_DEFINITIONS[value];
          if (!def) return null;
          return (
            <div
              key={value}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${def.color} border-2 border-gray-800 text-white text-sm font-bold shadow`}
            >
              <span>{def.label}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {sortedValues.map(value => (
          <div key={value} className="space-y-2">
            <div className="text-sm text-gray-800 font-bold bg-white/50 px-3 py-1 rounded-lg inline-block">
              {coinsByValue[value][0].label} coins ({coinsByValue[value].length})
            </div>
            <div className="flex flex-wrap gap-2">
              {coinsByValue[value].map(coin => (
                <motion.button
                  key={coin.id}
                  onClick={() => !disabled && onCoinClick(coin)}
                  disabled={disabled}
                  whileHover={!disabled ? { scale: 1.1 } : {}}
                  whileTap={!disabled ? { scale: 0.95 } : {}}
                  className={`w-16 h-16 rounded-full ${coin.color} shadow-xl flex items-center justify-center font-bold text-black border-4 border-gray-800 transition-all ring-2 ring-white ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl hover:ring-4'
                  }`}
                >
                  <div className="text-base font-extrabold">{coin.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {coins.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          All coins used!
        </div>
      )}
    </div>
  );
}
