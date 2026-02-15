'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTargetShootStore } from '@/store/target-shoot-store';
import TargetShootGameScreen from '@/components/TargetShootGameScreen';
import TargetShootSettings from '@/components/TargetShootSettings';
import TargetShootGameOver from '@/components/TargetShootGameOver';

type Screen = 'menu' | 'settings' | 'playing' | 'gameOver';

export default function TargetShootGame() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [mounted, setMounted] = useState(false);

  const gameState = useTargetShootStore((state) => state.gameState);
  const stats = useTargetShootStore((state) => state.stats);
  const settings = useTargetShootStore((state) => state.settings);
  const initGame = useTargetShootStore((state) => state.initGame);
  const startGame = useTargetShootStore((state) => state.startGame);

  useEffect(() => {
    initGame();
    setMounted(true);
  }, [initGame]);

  useEffect(() => {
    if (!gameState.isPlaying && currentScreen === 'playing') {
      // Game ended
      setTimeout(() => {
        setCurrentScreen('gameOver');
      }, 500);
    }
  }, [gameState.isPlaying, currentScreen]);

  const handleStartGame = () => {
    startGame();
    setCurrentScreen('playing');
  };

  const handlePlayAgain = () => {
    startGame();
    setCurrentScreen('playing');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    setCurrentScreen('menu');
  };

  const handleMainMenu = () => {
    router.push('/');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex items-center justify-center">
        <div className="text-6xl">🎯</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100">
      <AnimatePresence mode="wait">
        {/* Main Menu */}
        {currentScreen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full">
              {/* Header */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="text-8xl mb-4"
                >
                  🎯
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  Target Shoot
                </h1>
                <p className="text-xl md:text-2xl text-gray-700">
                  Shoot the correct answer! 🎪
                </p>
              </motion.div>

              {/* Best Score Display */}
              {stats.bestScore > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/80 backdrop-blur rounded-2xl p-6 mb-6 shadow-xl"
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">{stats.bestScore}</div>
                      <div className="text-sm text-gray-600">Best Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-pink-600">{stats.gamesPlayed}</div>
                      <div className="text-sm text-gray-600">Games Played</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">{stats.bestStreak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Game Mode Cards */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartGame}
                  className="w-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">🎯</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
                        Quick Play
                      </h3>
                      <p className="text-gray-600">
                        Start with current settings (Level {settings.level}, {settings.mode === 'practice' ? 'Practice' : 'Time Attack'})
                      </p>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenSettings}
                  className="w-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">⚙️</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        Settings
                      </h3>
                      <p className="text-gray-600">
                        Customize difficulty, mode, and preferences
                      </p>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </motion.button>
              </motion.div>

              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={handleMainMenu}
                  className="w-full py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
                >
                  ← Back to Main Menu
                </button>
              </motion.div>

              {/* How to Play */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 bg-white/60 backdrop-blur rounded-xl p-4 text-center"
              >
                <h4 className="font-bold text-gray-700 mb-2">How to Play</h4>
                <p className="text-sm text-gray-600">
                  🎯 Click targets with the correct answer<br/>
                  ⭐ Build streaks for bonus points<br/>
                  🏆 Beat your high score!
                </p>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
              {['🎯', '🎪', '⭐', '🎨'].map((emoji, i) => (
                <motion.div
                  key={i}
                  className="absolute text-6xl opacity-20"
                  style={{
                    left: `${10 + i * 30}%`,
                    top: `${20 + (i % 2) * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Screen */}
        {currentScreen === 'settings' && (
          <TargetShootSettings
            onClose={handleCloseSettings}
            onStartGame={handleStartGame}
          />
        )}

        {/* Playing Screen */}
        {currentScreen === 'playing' && gameState.isPlaying && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <TargetShootGameScreen />
            
            {/* Pause/Exit Button */}
            <button
              onClick={() => setCurrentScreen('menu')}
              className="fixed top-4 left-4 z-30 bg-white/90 backdrop-blur hover:bg-white rounded-xl px-4 py-2 font-bold text-gray-700 shadow-lg transition-all"
            >
              ← Exit
            </button>
          </motion.div>
        )}

        {/* Game Over Screen */}
        {currentScreen === 'gameOver' && (
          <TargetShootGameOver
            onPlayAgain={handlePlayAgain}
            onSettings={handleOpenSettings}
            onMainMenu={handleMainMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
