'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTargetShootStore } from '@/store/target-shoot-store';
import Target, { ShootEffect } from './Target';
import { audioManager } from '@/lib/audio';

interface ShootEffectState {
  id: string;
  x: number;
  y: number;
  isCorrect: boolean;
}

export default function TargetShootGameScreen() {
  const gameState = useTargetShootStore((state) => state.gameState);
  const settings = useTargetShootStore((state) => state.settings);
  const shootTarget = useTargetShootStore((state) => state.shootTarget);
  const updateTargets = useTargetShootStore((state) => state.updateTargets);
  const tickTimer = useTargetShootStore((state) => state.tickTimer);
  
  const [shootEffects, setShootEffects] = useState<ShootEffectState[]>([]);
  const [lastShot, setLastShot] = useState<{ targetId: string; isCorrect: boolean } | null>(null);
  
  const animationFrameRef = useRef<number>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();

  // Animation loop for moving targets
  useEffect(() => {
    if (!gameState.isPlaying) return;

    let lastTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      updateTargets(deltaTime);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, updateTargets]);

  // Timer for Time Attack mode
  useEffect(() => {
    if (settings.mode !== 'timeAttack' || !gameState.isPlaying) return;

    timerIntervalRef.current = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [settings.mode, gameState.isPlaying, tickTimer]);

  const handleShoot = (targetId: string) => {
    const target = gameState.targets.find(t => t.id === targetId);
    if (!target) return;

    // Add shoot effect
    setShootEffects(prev => [...prev, {
      id: targetId,
      x: target.x,
      y: target.y,
      isCorrect: target.isCorrect,
    }]);

    // Play sound
    if (settings.soundOn) {
      if (target.isCorrect) {
        audioManager.playCorrect();
      } else {
        audioManager.playIncorrect();
      }
    }

    // Track last shot for feedback
    setLastShot({ targetId, isCorrect: target.isCorrect });

    // Process the shot
    shootTarget(targetId);

    // Clear last shot feedback after delay
    setTimeout(() => {
      setLastShot(null);
    }, 1500);
  };

  const removeShootEffect = (id: string) => {
    setShootEffects(prev => prev.filter(effect => effect.id !== id));
  };

  if (!gameState.currentQuestion) {
    return null;
  }

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
      {/* Header - Question and Stats */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 bg-white/90 backdrop-blur shadow-lg p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Question */}
          <motion.div
            key={gameState.questionIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {gameState.currentQuestion.prompt}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Shoot the correct target! 🎯
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-4 text-center">
            {/* Score */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl px-4 py-2 shadow-md min-w-[100px]">
              <div className="text-2xl md:text-3xl font-bold">{gameState.score}</div>
              <div className="text-xs md:text-sm opacity-90">Score</div>
            </div>

            {/* Streak */}
            <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white rounded-xl px-4 py-2 shadow-md min-w-[100px]">
              <div className="text-2xl md:text-3xl font-bold">
                {gameState.streak > 0 && '🔥'} {gameState.streak}
              </div>
              <div className="text-xs md:text-sm opacity-90">Streak</div>
            </div>

            {/* Level */}
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-xl px-4 py-2 shadow-md min-w-[100px]">
              <div className="text-2xl md:text-3xl font-bold">{gameState.level}</div>
              <div className="text-xs md:text-sm opacity-90">Level</div>
            </div>

            {/* Timer (Time Attack mode only) */}
            {settings.mode === 'timeAttack' && gameState.timeRemaining !== undefined && (
              <div className={`bg-gradient-to-br ${
                gameState.timeRemaining <= 10 ? 'from-red-400 to-red-600 animate-pulse' : 'from-purple-400 to-purple-600'
              } text-white rounded-xl px-4 py-2 shadow-md min-w-[100px]`}>
                <div className="text-2xl md:text-3xl font-bold">{gameState.timeRemaining}s</div>
                <div className="text-xs md:text-sm opacity-90">Time</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Game Area - Moving Targets */}
      <div className="relative h-[calc(100%-140px)] w-full">
        {/* Crosshair cursor indicator */}
        <div className="absolute inset-0 cursor-crosshair">
          <AnimatePresence>
            {gameState.targets.map((target) => (
              <Target
                key={target.id}
                target={target}
                onShoot={handleShoot}
                disabled={lastShot !== null}
                reduceMotion={settings.reduceMotion}
              />
            ))}
          </AnimatePresence>

          {/* Shoot Effects */}
          <AnimatePresence>
            {shootEffects.map((effect) => (
              <ShootEffect
                key={effect.id}
                x={effect.x}
                y={effect.y}
                isCorrect={effect.isCorrect}
                onComplete={() => removeShootEffect(effect.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {lastShot && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
            >
              <div className={`text-6xl md:text-8xl font-bold ${
                lastShot.isCorrect ? 'text-green-500' : 'text-red-500'
              } drop-shadow-2xl`}>
                {lastShot.isCorrect ? '✓' : '✗'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak Effects */}
        {gameState.streak >= 5 && !settings.reduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(255,215,0,0) 0%, rgba(255,215,0,0) 100%)',
                'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%)',
                'radial-gradient(circle at 50% 50%, rgba(255,215,0,0) 0%, rgba(255,215,0,0) 100%)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {gameState.streak >= 10 && !settings.reduceMotion && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                ⭐
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative background elements */}
      {!settings.reduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🎯', '🎪', '🎨', '🎭'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-10"
              style={{
                left: `${10 + i * 25}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
