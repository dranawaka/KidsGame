'use client';

import { motion } from 'framer-motion';
import { BubbleChoice } from '@/types/game';

interface BubbleProps {
  bubble: BubbleChoice;
  onPop: (id: string) => void;
  delay?: number;
  reduceMotion?: boolean;
  index?: number;
}

export default function Bubble({ bubble, onPop, delay = 0, reduceMotion = false, index }: BubbleProps) {
  const colors = [
    'from-pink-400 to-pink-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-purple-400 to-purple-600',
    'from-orange-400 to-orange-600',
    'from-red-400 to-red-600',
    'from-cyan-400 to-cyan-600',
  ];

  const colorClass = colors[Math.floor(Math.random() * colors.length)];

  const floatAnimation = reduceMotion
    ? {}
    : {
        y: [0, -20, 0],
        transition: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, ...floatAnimation }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={reduceMotion ? {} : { scale: 1.1 }}
      whileTap={reduceMotion ? {} : { scale: 0.9 }}
      transition={{ duration: 0.3, delay }}
      onClick={() => onPop(bubble.id)}
      className={`
        relative min-w-[80px] min-h-[80px] md:min-w-[100px] md:min-h-[100px]
        rounded-full bg-gradient-to-br ${colorClass}
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        text-white font-bold text-2xl md:text-3xl
        cursor-pointer
        border-4 border-white/30
        focus:outline-none focus:ring-4 focus:ring-white/50
        active:shadow-inner
        transition-shadow
      `}
      aria-label={`${index !== undefined ? `Option ${index + 1}: ` : ''}Answer: ${bubble.value}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPop(bubble.id);
        }
      }}
    >
      <span className="drop-shadow-lg">{bubble.value}</span>
      {index !== undefined && (
        <span className="absolute top-1 right-1 text-xs bg-white/50 rounded-full w-5 h-5 flex items-center justify-center text-gray-700">
          {index + 1}
        </span>
      )}
      
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent opacity-50" />
    </motion.button>
  );
}
