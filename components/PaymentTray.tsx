'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coin } from '@/types/fruit-shop';

interface PaymentTrayProps {
  coins: Coin[];
  paidTotal: number;
  requiredTotal: number;
  onRemoveCoin: (coinId: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function PaymentTray({
  coins,
  paidTotal,
  requiredTotal,
  onRemoveCoin,
  onReset,
  onSubmit,
  disabled = false,
}: PaymentTrayProps) {
  const isPerfect = paidTotal === requiredTotal;
  const isOverpaid = paidTotal > requiredTotal;

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">💵 Payment Tray</h3>
      
      {/* Total Display — only show what they paid; kid calculates the required total */}
      <div className="bg-white rounded-xl p-4 mb-4 text-center">
        <div className="text-sm text-gray-600 mb-1">You paid:</div>
        <div className={`text-4xl font-bold ${
          isPerfect ? 'text-green-600' : isOverpaid ? 'text-orange-600' : 'text-blue-600'
        }`}>
          ${paidTotal}
        </div>
      </div>

      {/* Status Message — no hints; let the kid figure it out */}

      {/* Coins in Tray */}
      <div className="min-h-[120px] bg-white/50 rounded-xl p-4 mb-4">
        {coins.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {coins.map(coin => (
                <motion.button
                  key={coin.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => !disabled && onRemoveCoin(coin.id)}
                  disabled={disabled}
                  whileHover={!disabled ? { scale: 1.1 } : {}}
                  whileTap={!disabled ? { scale: 0.95 } : {}}
                  className={`w-14 h-14 rounded-full ${coin.color} shadow-lg flex items-center justify-center font-bold text-white border-4 border-amber-900/50 ring-2 ring-gray-800 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="text-xs">{coin.label}</div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            Drag coins here or click from the bank
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onReset}
          disabled={disabled || coins.length === 0}
          className="px-4 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
        >
          🔄 Reset
        </button>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
