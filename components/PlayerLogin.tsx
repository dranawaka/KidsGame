'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Player, getAvatars, getRandomAvatar } from '@/lib/player';

interface PlayerLoginProps {
  onLogin: (player: Player) => void;
}

export default function PlayerLogin({ onLogin }: PlayerLoginProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(getRandomAvatar());
  const [error, setError] = useState('');
  const avatars = getAvatars();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Please enter your name!');
      return;
    }

    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters!');
      return;
    }

    onLogin({ name: trimmed, avatar: selectedAvatar });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center mb-6"
        >
          <div className="text-7xl mb-4">{selectedAvatar}</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Who&apos;s Playing?
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="player-name" className="block text-sm font-bold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Type your name..."
              maxLength={20}
              autoFocus
              className="w-full px-5 py-4 text-xl border-3 border-purple-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-center font-bold text-gray-700 placeholder-gray-300"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 text-center font-medium"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 text-center">Pick Your Avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((avatar) => (
                <motion.button
                  key={avatar}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-3xl p-2 rounded-xl transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-purple-100 ring-3 ring-purple-400 shadow-md'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {avatar}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-xl shadow-lg transition-all"
          >
            Let&apos;s Play! 🎮
          </motion.button>
        </form>
      </motion.div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['🎈', '⭐', '🎮', '🏆', '🎉'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-15"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
