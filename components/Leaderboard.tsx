'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaderboardEntry, GameType, getLeaderboardForGame } from '@/lib/leaderboard';

interface LeaderboardProps {
  onClose: () => void;
}

const GAME_LABELS: Record<GameType, { name: string; emoji: string; color: string }> = {
  'bubble-pop': { name: 'Bubble Pop Math', emoji: '🎈', color: 'purple' },
  'fruit-shop': { name: 'Fruit Shop', emoji: '🍎', color: 'orange' },
};

function getMedalEmoji(rank: number): string {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return `#${rank + 1}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [activeGame, setActiveGame] = useState<GameType>('bubble-pop');
  const entries = getLeaderboardForGame(activeGame);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">🏆</div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
            Leaderboard
          </h2>
        </div>

        {/* Game Tabs */}
        <div className="flex gap-2 mb-5">
          {(Object.keys(GAME_LABELS) as GameType[]).map((game) => {
            const { name, emoji, color } = GAME_LABELS[game];
            const isActive = activeGame === game;
            return (
              <button
                key={game}
                onClick={() => setActiveGame(game)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? `bg-${color}-100 text-${color}-700 ring-2 ring-${color}-300`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: color === 'purple' ? '#f3e8ff' : '#fff7ed',
                        color: color === 'purple' ? '#7e22ce' : '#c2410c',
                        boxShadow: `0 0 0 2px ${color === 'purple' ? '#c084fc' : '#fb923c'}`,
                      }
                    : undefined
                }
              >
                {emoji} {name}
              </button>
            );
          })}
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {entries.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="text-lg font-medium">No scores yet!</p>
                  <p className="text-sm">Play a game to get on the board.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry, index) => (
                    <LeaderboardRow key={`${entry.date}-${index}`} entry={entry} rank={index} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-lg transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

function LeaderboardRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const isTop3 = rank < 3;
  const medal = getMedalEmoji(rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${
        isTop3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
      }`}
    >
      <div className={`text-2xl w-10 text-center font-bold ${!isTop3 ? 'text-gray-400 text-base' : ''}`}>
        {medal}
      </div>

      <div className="text-2xl">{entry.avatar}</div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 truncate">{entry.playerName}</p>
        <p className="text-xs text-gray-400">{formatDate(entry.date)}</p>
      </div>

      <div className={`text-xl font-bold ${isTop3 ? 'text-yellow-600' : 'text-gray-600'}`}>
        {entry.score}
      </div>
    </motion.div>
  );
}
