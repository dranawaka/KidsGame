'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { LEVEL_CONFIGS } from '@/types/game';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { settings, updateSettings } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold focus:outline-none"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Game Mode */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateSettings({ mode: 'practice' })}
                className={`p-4 rounded-xl font-medium transition-all ${
                  settings.mode === 'practice'
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">📚</div>
                <div>Practice</div>
                <div className="text-xs opacity-75">No pressure</div>
              </button>
              <button
                onClick={() => updateSettings({ mode: 'challenge' })}
                className={`p-4 rounded-xl font-medium transition-all ${
                  settings.mode === 'challenge'
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">⚡</div>
                <div>Challenge</div>
                <div className="text-xs opacity-75">Beat the clock</div>
              </button>
            </div>
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Difficulty Level: {settings.level}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.level}
              onChange={(e) => updateSettings({ level: parseInt(e.target.value) })}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              {LEVEL_CONFIGS[settings.level - 1].description}
            </p>
          </div>

          {/* Bubble Count */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Number of Bubbles: {settings.bubbleCount}
            </label>
            <input
              type="range"
              min="6"
              max="12"
              value={settings.bubbleCount}
              onChange={(e) => updateSettings({ bubbleCount: parseInt(e.target.value) })}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Challenge Mode Settings */}
          {settings.mode === 'challenge' && (
            <>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Timer: {settings.timerSeconds}s
                </label>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="30"
                  value={settings.timerSeconds}
                  onChange={(e) => updateSettings({ timerSeconds: parseInt(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Hearts: {settings.hearts}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={settings.hearts}
                  onChange={(e) => updateSettings({ hearts: parseInt(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </>
          )}

          {/* Toggle Settings */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-lg font-medium text-gray-700">🔊 Sound Effects</span>
              <input
                type="checkbox"
                checked={settings.soundOn}
                onChange={(e) => updateSettings({ soundOn: e.target.checked })}
                className="w-6 h-6 accent-purple-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-lg font-medium text-gray-700">🎤 Voice Prompts</span>
              <input
                type="checkbox"
                checked={settings.voiceOn}
                onChange={(e) => updateSettings({ voiceOn: e.target.checked })}
                className="w-6 h-6 accent-purple-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-lg font-medium text-gray-700">♿ Reduce Motion</span>
              <input
                type="checkbox"
                checked={settings.reduceMotion}
                onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
                className="w-6 h-6 accent-purple-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
}
