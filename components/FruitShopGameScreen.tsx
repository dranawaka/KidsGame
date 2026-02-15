'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFruitShopStore } from '@/store/fruit-shop-store';
import { Coin } from '@/types/fruit-shop';
import OrderCard from './OrderCard';
import CoinBank from './CoinBank';
import PaymentTray from './PaymentTray';

export default function FruitShopGameScreen() {
  const {
    isPlaying,
    currentOrder,
    availableCoins,
    selectedCoins,
    paidTotal,
    score,
    streak,
    timeRemaining,
    settings,
    addCoinToTray,
    removeCoinFromTray,
    resetTray,
    submitPayment,
    decrementTimer,
    stopGame,
    getHint,
  } = useFruitShopStore();

  const [showHint, setShowHint] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || timeRemaining === undefined) return;

    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, decrementTimer]);

  const handleHint = () => {
    const hint = getHint();
    if (hint) {
      setShowHint(hint);
      setTimeout(() => setShowHint(null), 5000);
    }
  };

  const handleCoinClick = (coin: Coin) => {
    addCoinToTray(coin);
  };

  if (!mounted || !isPlaying || !currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-green-100 flex items-center justify-center">
        <div className="text-4xl">🍎</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-green-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between items-center flex-wrap gap-4">
            {/* Score */}
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-purple-600">{score}</div>
              </div>
              
              {/* Streak */}
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-full font-bold"
                >
                  🔥 {streak} Streak!
                </motion.div>
              )}
            </div>

            {/* Timer */}
            {timeRemaining !== undefined && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">Time:</div>
                <div className={`text-2xl font-bold ${timeRemaining < 10 ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )}

            {/* Quit Button */}
            <button
              onClick={stopGame}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
            >
              ❌ Quit
            </button>
          </div>
        </div>
      </div>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-center font-semibold text-gray-700">
              {showHint}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order Card + Hint Button */}
          <div className="space-y-4">
            <OrderCard order={currentOrder} />
            
            {settings.showHints && (
              <button
                onClick={handleHint}
                className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                💡 Get Hint
              </button>
            )}
          </div>

          {/* Center: Payment Tray */}
          <div>
            <PaymentTray
              coins={selectedCoins}
              paidTotal={paidTotal}
              requiredTotal={currentOrder.total}
              onRemoveCoin={removeCoinFromTray}
              onReset={resetTray}
              onSubmit={submitPayment}
            />
          </div>

          {/* Right: Coin Bank */}
          <div>
            <CoinBank
              coins={availableCoins}
              onCoinClick={handleCoinClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="max-w-7xl mx-auto mt-6 lg:hidden">
        <div className="bg-blue-100 rounded-xl p-4 text-center text-sm text-gray-700">
          💡 Tap coins from the bank to add them to your payment!
        </div>
      </div>

      {/* Streak Milestones */}
      <AnimatePresence>
        {streak === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-4xl font-bold px-12 py-8 rounded-3xl shadow-2xl">
              🔥 HOT STREAK! 🔥
            </div>
          </motion.div>
        )}
        {streak === 10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-4xl font-bold px-12 py-8 rounded-3xl shadow-2xl">
              ⭐ SUPERSTAR! ⭐
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
