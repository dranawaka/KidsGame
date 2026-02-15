'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { announceToScreenReader } from '@/lib/accessibility';
import Bubble from './Bubble';

export default function GameScreen() {
  const {
    isPlaying,
    currentQuestion,
    bubbles,
    score,
    streak,
    hearts,
    level,
    timeRemaining,
    settings,
    answerQuestion,
    stopGame,
    decrementTimer,
  } = useGameStore();

  // Timer effect for challenge mode
  useEffect(() => {
    if (!isPlaying || settings.mode !== 'challenge' || timeRemaining === undefined) {
      return;
    }

    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, settings.mode, timeRemaining, decrementTimer]);

  // Announce new question to screen readers
  useEffect(() => {
    if (currentQuestion && isPlaying) {
      announceToScreenReader(`New question: ${currentQuestion.prompt}`);
    }
  }, [currentQuestion, isPlaying]);

  // Keyboard support
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= bubbles.length) {
        const bubble = bubbles[key - 1];
        if (bubble) {
          answerQuestion(bubble.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, bubbles, answerQuestion]);

  if (!isPlaying || !currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      {/* Header with score, hearts, timer */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Score</p>
              <p className="text-2xl font-bold text-purple-600">{score}</p>
            </div>
            
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center bg-yellow-400 px-3 py-1 rounded-full"
              >
                <p className="text-sm font-bold text-yellow-900">🔥 {streak}</p>
              </motion.div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Level</p>
            <p className="text-2xl font-bold text-blue-600">{level}</p>
          </div>

          {settings.mode === 'challenge' && (
            <>
              <div className="flex gap-1">
                {Array.from({ length: settings.hearts }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 1 }}
                    animate={i >= hearts ? { scale: 0, opacity: 0 } : { scale: 1 }}
                    className="text-2xl"
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">Time</p>
                <p className={`text-2xl font-bold ${timeRemaining && timeRemaining < 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
                  {timeRemaining}s
                </p>
              </div>
            </>
          )}

          <button
            onClick={stopGame}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            End Game
          </button>
        </div>

        {/* Question Display */}
        <motion.div
          key={currentQuestion.prompt}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-white rounded-3xl px-8 py-6 shadow-2xl border-4 border-purple-300">
            <p className="text-5xl md:text-7xl font-bold text-gray-800">
              {currentQuestion.prompt}
            </p>
          </div>
        </motion.div>

        {/* Bubbles */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto" role="group" aria-label="Answer choices">
          <AnimatePresence mode="wait">
            {bubbles.map((bubble, index) => (
              <Bubble
                key={bubble.id}
                bubble={bubble}
                onPop={answerQuestion}
                delay={index * 0.1}
                reduceMotion={settings.reduceMotion}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            {settings.mode === 'practice' ? '💡 Take your time!' : '⚡ Quick thinking!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
