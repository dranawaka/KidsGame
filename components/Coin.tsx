'use client';

import { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Coin } from '@/types/fruit-shop';

interface CoinComponentProps {
  coin: Coin;
  onDragEnd: (coin: Coin, wasDragged: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function CoinComponent({ coin, onDragEnd, disabled = false, size = 'medium' }: CoinComponentProps) {
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    small: 'w-14 h-14 text-sm',
    medium: 'w-20 h-20 text-base',
    large: 'w-24 h-24 text-lg',
  };

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragEndInternal = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;
    setIsDragging(false);
    
    // Calculate distance dragged
    const distance = Math.sqrt(
      Math.pow(info.offset.x, 2) + Math.pow(info.offset.y, 2)
    );
    
    // Consider it a drag if moved more than 50 pixels
    const wasDragged = distance > 50;
    onDragEnd(coin, wasDragged);
  };

  return (
    <motion.div
      drag={!disabled}
      dragSnapToOrigin
      dragElastic={0.2}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndInternal}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`${sizeClasses[size]} rounded-full ${coin.color} shadow-lg flex items-center justify-center font-bold text-white cursor-grab active:cursor-grabbing select-none border-4 border-amber-900/50 ring-2 ring-gray-800 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        touchAction: 'none',
      }}
    >
      <div className="text-center">
        <div className={size === 'small' ? 'text-lg' : 'text-2xl'}>{coin.label}</div>
      </div>
    </motion.div>
  );
}
