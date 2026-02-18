'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadPlayer } from '@/lib/player';
import Leaderboard from './Leaderboard';

interface GameOverProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function GameOver({ score, bestScore, isNewBest, onPlayAgain, onMainMenu }: GameOverProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const player = loadPlayer();

  const getStars = (score: number) => {
    if (score === 0) return 0;
    if (score < 50) return 1;
    if (score < 100) return 2;
    return 3;
  };

  const stars = getStars(score);
  const messages = [
    "Keep practicing! 💪",
    "Nice work! 👍",
    "Great job! 🎉",
    "Amazing! You're a math star! 🌟",
  ];

  if (showLeaderboard) {
    return <Leaderboard onClose={() => setShowLeaderboard(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: i <= stars ? 1 : 0.3, rotate: 0 }}
              transition={{ delay: i * 0.2, type: 'spring' }}
              className="text-6xl"
            >
              {i <= stars ? '⭐' : '☆'}
            </motion.div>
          ))}
        </div>

        {/* Player */}
        {player && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-3"
          >
            <span className="text-2xl">{player.avatar}</span>
            <span className="ml-2 font-bold text-gray-700">{player.name}</span>
          </motion.div>
        )}

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          {messages[stars]}
        </motion.h2>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <p className="text-6xl font-bold text-purple-600 mb-2">{score}</p>
          <p className="text-lg text-gray-600">Final Score</p>
          
          {isNewBest && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="mt-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full inline-block font-bold"
            >
              🏆 New Best Score!
            </motion.div>
          )}
          
          {!isNewBest && bestScore > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Best: {bestScore}
            </p>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <button
            onClick={onPlayAgain}
            className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Play Again
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={onMainMenu}
            className="w-full px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Main Menu
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
