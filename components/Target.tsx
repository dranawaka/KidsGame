'use client';

import { motion } from 'framer-motion';
import { Target as TargetType } from '@/types/target-shoot';

interface TargetProps {
  target: TargetType;
  onShoot: (targetId: string) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}

const TARGET_COLORS = [
  'from-red-400 to-red-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-orange-400 to-orange-600',
  'from-teal-400 to-teal-600',
];

export default function Target({ target, onShoot, disabled, reduceMotion }: TargetProps) {
  const colorClass = TARGET_COLORS[Math.abs(target.value) % TARGET_COLORS.length];

  const handleClick = () => {
    if (!disabled) {
      onShoot(target.id);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${colorClass} 
        shadow-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl
        border-4 border-white cursor-crosshair hover:scale-110 active:scale-95
        transition-transform disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-yellow-400`}
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
      }}
      exit={{ 
        scale: 0, 
        rotate: 180,
        transition: { duration: 0.3 }
      }}
      whileHover={!reduceMotion ? { 
        scale: 1.15,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        rotate: [0, -5, 5, 0],
      } : {}}
      whileTap={{ 
        scale: 0.85,
        rotate: [0, -10, 10, 0],
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      aria-label={`Target with value ${target.value}`}
    >
      {/* Bouncing pulse effect */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-full bg-white/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      
      {/* Bullseye rings */}
      <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
      <div className="absolute inset-2 rounded-full border-2 border-white/20"></div>
      
      {/* Number */}
      <span className="relative z-10 drop-shadow-lg">{target.value}</span>
      
      {/* Shimmer effect */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
}

interface ShootEffectProps {
  x: number;
  y: number;
  isCorrect: boolean;
  onComplete: () => void;
}

export function ShootEffect({ x, y, isCorrect, onComplete }: ShootEffectProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      onAnimationComplete={onComplete}
    >
      {isCorrect ? (
        // Explosion effect for correct answer
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 12) * 60,
                y: Math.sin((i * Math.PI * 2) / 12) * 60,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
          {/* Star burst */}
          <motion.div
            className="text-6xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 0.6 }}
          >
            ⭐
          </motion.div>
          {/* Confetti */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute text-2xl"
              initial={{ y: 0, x: 0, opacity: 1 }}
              animate={{
                y: Math.random() * -100 - 50,
                x: (Math.random() - 0.5) * 100,
                rotate: Math.random() * 720,
                opacity: 0,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {['🎉', '✨', '🌟', '💫'][i % 4]}
            </motion.div>
          ))}
        </>
      ) : (
        // Miss effect for wrong answer
        <>
          <motion.div
            className="text-6xl"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 0] }}
            transition={{ duration: 0.5 }}
          >
            ❌
          </motion.div>
          {/* Shake effect */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-red-500 rounded-full"
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
