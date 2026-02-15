'use client';

import { motion } from 'framer-motion';
import { useTargetShootStore } from '@/store/target-shoot-store';

interface TargetShootGameOverProps {
  onPlayAgain: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
}

export default function TargetShootGameOver({ onPlayAgain, onSettings, onMainMenu }: TargetShootGameOverProps) {
  const gameState = useTargetShootStore((state) => state.gameState);
  const stats = useTargetShootStore((state) => state.stats);
  const settings = useTargetShootStore((state) => state.settings);

  const accuracy = gameState.correctAnswers + gameState.wrongAnswers > 0
    ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.wrongAnswers)) * 100)
    : 0;

  const isNewBestScore = gameState.score === stats.bestScore && gameState.score > 0;
  const isNewBestStreak = gameState.streak === stats.bestStreak && gameState.streak > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 15 }}
          className="text-center mb-6"
        >
          <div className="text-6xl md:text-8xl mb-4">
            {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🌟' : accuracy >= 50 ? '👍' : '🎯'}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            {accuracy >= 90 ? 'Amazing!' : accuracy >= 70 ? 'Great Job!' : accuracy >= 50 ? 'Good Work!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-600">
            {settings.mode === 'timeAttack' ? "Time's up!" : 'Game complete!'}
          </p>
        </motion.div>

        {/* Score Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 15 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 mb-6 text-center text-white shadow-xl"
        >
          <div className="text-5xl md:text-7xl font-bold mb-2">
            {gameState.score}
            {isNewBestScore && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 }}
                className="ml-3 text-4xl"
              >
                🆕
              </motion.span>
            )}
          </div>
          <div className="text-lg opacity-90">
            {isNewBestScore ? 'New Best Score!' : 'Final Score'}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {/* Correct */}
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{gameState.correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>

          {/* Wrong */}
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{gameState.wrongAnswers}</div>
            <div className="text-sm text-gray-600">Wrong</div>
          </div>

          {/* Accuracy */}
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>

          {/* Best Streak */}
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {gameState.streak}
              {isNewBestStreak && <span className="text-lg ml-1">🆕</span>}
            </div>
            <div className="text-sm text-gray-600">
              {isNewBestStreak ? 'New Streak!' : 'Best Streak'}
            </div>
          </div>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-2 text-center">All-Time Stats</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.gamesPlayed}</div>
              <div className="text-xs text-gray-600">Games Played</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">{stats.bestScore}</div>
              <div className="text-xs text-gray-600">Best Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">{stats.bestStreak}</div>
              <div className="text-xs text-gray-600">Best Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mb-6"
        >
          {accuracy >= 90 && (
            <p className="text-gray-700 font-medium">You&apos;re a math sharpshooter! 🎯✨</p>
          )}
          {accuracy >= 70 && accuracy < 90 && (
            <p className="text-gray-700 font-medium">Excellent aim! Keep it up! 🌟</p>
          )}
          {accuracy >= 50 && accuracy < 70 && (
            <p className="text-gray-700 font-medium">Nice work! Practice makes perfect! 👏</p>
          )}
          {accuracy < 50 && (
            <p className="text-gray-700 font-medium">Keep practicing - you&apos;re improving! 💪</p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="space-y-3"
        >
          <button
            onClick={onPlayAgain}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-lg transition-all transform hover:scale-105"
          >
            🎯 Play Again
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onSettings}
              className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={onMainMenu}
              className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
            >
              🏠 Main Menu
            </button>
          </div>
        </motion.div>

        {/* Confetti Animation */}
        {(isNewBestScore || isNewBestStreak) && (
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 720],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              >
                {['🎉', '🎊', '⭐', '✨', '🌟', '💫'][i % 6]}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
