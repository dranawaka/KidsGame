'use client';

import { motion } from 'framer-motion';

interface FruitShopGameOverProps {
  score: number;
  bestScore: number;
  correctCount: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function FruitShopGameOver({
  score,
  bestScore,
  correctCount,
  isNewBest,
  onPlayAgain,
  onMainMenu,
}: FruitShopGameOverProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          {/* Title */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {isNewBest ? '🏆' : '🎉'}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isNewBest ? 'New Best Score!' : 'Great Job!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            You&apos;ve earned your coins! 💰
          </p>

          {/* Stats */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-gray-600">Orders Completed</div>
              </div>
            </div>
            
            {isNewBest && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 pt-4 border-t border-orange-200"
              >
                <div className="text-sm text-gray-600">Previous Best</div>
                <div className="text-2xl font-bold text-orange-600">{bestScore}</div>
              </motion.div>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onPlayAgain}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Play Again
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={onMainMenu}
              className="w-full py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              🏠 Main Menu
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
