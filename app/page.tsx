'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore } from '@/store/game-store';
import { useFruitShopStore } from '@/store/fruit-shop-store';
import { useTargetShootStore } from '@/store/target-shoot-store';

export default function Home() {
  const bubblePopStats = useGameStore((state) => state.stats);
  const fruitShopStats = useFruitShopStore((state) => state.stats);
  const targetShootStats = useTargetShootStore((state) => state.stats);
  const initGame = useGameStore((state) => state.initGame);
  const initFruitShop = useFruitShopStore((state) => state.initFruitShop);
  const initTargetShoot = useTargetShootStore((state) => state.initGame);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initGame();
    initFruitShop();
    initTargetShoot();
    setMounted(true);
  }, [initGame, initFruitShop, initTargetShoot]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-4xl">🎮</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
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
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Kids Math Games
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
              Choose Your Adventure! 🎮
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-700 mb-12"
          >
            Three fun ways to practice math skills!
          </motion.p>

          {/* Game Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Bubble Pop Math */}
            <Link href="/bubble-pop">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-3xl p-8 shadow-xl cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="text-6xl mb-4">🎈</div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                  Bubble Pop Math
                </h3>
                <p className="text-gray-600 mb-4">
                  Pop bubbles with the right answer! Practice +, -, ×, ÷
                </p>
                {bubblePopStats.bestScore > 0 && (
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-purple-600">{bubblePopStats.bestScore}</div>
                    <div className="text-xs text-gray-600">Best Score</div>
                  </div>
                )}
              </motion.div>
            </Link>

            {/* Fruit Shop */}
            <Link href="/fruit-shop">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-3xl p-8 shadow-xl cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="text-6xl mb-4">🍎💰</div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 mb-2">
                  Fruit Shop
                </h3>
                <p className="text-gray-600 mb-4">
                  Count coins and buy fruit! Learn money math & multiplication
                </p>
                {fruitShopStats.bestScore > 0 && (
                  <div className="bg-orange-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-orange-600">{fruitShopStats.bestScore}</div>
                    <div className="text-xs text-gray-600">Best Score</div>
                  </div>
                )}
              </motion.div>
            </Link>

            {/* Target Shoot */}
            <Link href="/target-shoot">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-3xl p-8 shadow-xl cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-2">
                  Target Shoot
                </h3>
                <p className="text-gray-600 mb-4">
                  Shoot the correct answer! Fast-paced math action game
                </p>
                {targetShootStats.bestScore > 0 && (
                  <div className="bg-red-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-red-600">{targetShootStats.bestScore}</div>
                    <div className="text-xs text-gray-600">Best Score</div>
                  </div>
                )}
              </motion.div>
            </Link>
          </motion.div>

          {/* Combined Stats */}
          {(bubblePopStats.gamesPlayed > 0 || fruitShopStats.gamesPlayed > 0 || targetShootStats.gamesPlayed > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 mb-8 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-700 mb-4">Your Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{bubblePopStats.gamesPlayed + fruitShopStats.gamesPlayed + targetShootStats.gamesPlayed}</p>
                  <p className="text-xs text-gray-600">Total Games</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{bubblePopStats.totalCorrect + fruitShopStats.totalCorrect + targetShootStats.totalCorrect}</p>
                  <p className="text-xs text-gray-600">Correct Answers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {bubblePopStats.totalAttempts + fruitShopStats.totalAttempts + targetShootStats.totalAttempts > 0
                      ? Math.round(((bubblePopStats.totalCorrect + fruitShopStats.totalCorrect + targetShootStats.totalCorrect) / (bubblePopStats.totalAttempts + fruitShopStats.totalAttempts + targetShootStats.totalAttempts)) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-gray-600">Overall Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{Math.max(bubblePopStats.bestScore, fruitShopStats.bestScore, targetShootStats.bestScore)}</p>
                  <p className="text-xs text-gray-600">Highest Score</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-gray-500 text-sm"
          >
            Made with ❤️ for kids who love math
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['🎈', '🍎', '🍌', '💰', '🎯', '⭐'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
