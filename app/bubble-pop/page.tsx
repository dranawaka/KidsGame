'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import GameScreen from '@/components/GameScreen';
import Settings from '@/components/Settings';
import GameOver from '@/components/GameOver';
import Link from 'next/link';

export default function BubblePopPage() {
  const { isPlaying, score, stats, startGame, resetGame, initGame } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initGame();
    setMounted(true);
  }, [initGame]);

  useEffect(() => {
    if (!isPlaying && score > 0) {
      setIsNewBest(score > stats.bestScore);
      setShowGameOver(true);
    }
  }, [isPlaying, score, stats.bestScore]);

  const handleStartGame = () => {
    setShowGameOver(false);
    startGame();
  };

  const handlePlayAgain = () => {
    setShowGameOver(false);
    resetGame();
    startGame();
  };

  const handleMainMenu = () => {
    setShowGameOver(false);
    resetGame();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-4xl">🎈</div>
      </div>
    );
  }

  if (isPlaying) {
    return <GameScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Menu */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          {/* Logo/Title */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Bubble Pop
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Math! 🎈
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-700 mb-12"
          >
            Pop the bubble with the correct answer!
          </motion.p>

          {/* Stats Display */}
          {stats.bestScore > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 mb-8 shadow-lg"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-purple-600">{stats.bestScore}</p>
                  <p className="text-sm text-gray-600">Best Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{stats.gamesPlayed}</p>
                  <p className="text-sm text-gray-600">Games Played</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <button
              onClick={handleStartGame}
              className="w-full px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              🎮 Start Game
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full px-8 py-6 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              ⚙️ Settings
            </button>

            <Link href="/">
              <button className="w-full px-8 py-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300">
                🏠 Back to Games
              </button>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-gray-500 text-sm"
          >
            Made with ❤️ for kids who love math
          </motion.p>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        {showGameOver && (
          <GameOver
            score={score}
            bestScore={stats.bestScore}
            isNewBest={isNewBest}
            onPlayAgain={handlePlayAgain}
            onMainMenu={handleMainMenu}
          />
        )}
      </AnimatePresence>

      {/* Decorative floating bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
