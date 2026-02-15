'use client';

import { motion } from 'framer-motion';
import { useFruitShopStore } from '@/store/fruit-shop-store';
import { FRUIT_SHOP_LEVELS } from '@/types/fruit-shop';

interface FruitShopSettingsProps {
  onClose: () => void;
}

export default function FruitShopSettings({ onClose }: FruitShopSettingsProps) {
  const { settings, updateSettings } = useFruitShopStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ⚙️ Fruit Shop Settings
        </h2>

        {/* Game Mode */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Game Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateSettings({ mode: 'practice' })}
              className={`p-4 rounded-xl font-bold transition-all ${
                settings.mode === 'practice'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎯 Practice
              <div className="text-xs mt-1 font-normal">No timer, learn at your pace</div>
            </button>
            <button
              onClick={() => updateSettings({ mode: 'timeattack' })}
              className={`p-4 rounded-xl font-bold transition-all ${
                settings.mode === 'timeattack'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ⏱️ Time Attack
              <div className="text-xs mt-1 font-normal">Race against the clock</div>
            </button>
          </div>
        </div>

        {/* Level */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Level: {settings.level}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.level}
            onChange={(e) => updateSettings({ level: parseInt(e.target.value) })}
            className="w-full h-3 bg-gradient-to-r from-green-200 to-red-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-2 text-sm text-gray-600 bg-gray-100 rounded-lg p-3">
            {FRUIT_SHOP_LEVELS[settings.level - 1].description}
          </div>
        </div>

        {/* Timer (for Time Attack) */}
        {settings.mode === 'timeattack' && (
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Timer: {settings.timerSeconds}s
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => updateSettings({ timerSeconds: seconds })}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    settings.timerSeconds === seconds
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {seconds}s
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-semibold text-gray-700">Sound Effects</div>
              <div className="text-sm text-gray-500">Play sounds for actions</div>
            </div>
            <button
              onClick={() => updateSettings({ soundOn: !settings.soundOn })}
              className={`w-16 h-8 rounded-full transition-all ${
                settings.soundOn ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                  settings.soundOn ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-semibold text-gray-700">Show Hints</div>
              <div className="text-sm text-gray-500">Display hint button</div>
            </div>
            <button
              onClick={() => updateSettings({ showHints: !settings.showHints })}
              className={`w-16 h-8 rounded-full transition-all ${
                settings.showHints ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                  settings.showHints ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-semibold text-gray-700">Exact Change Required</div>
              <div className="text-sm text-gray-500">Advanced: Must pay exact amount</div>
            </div>
            <button
              onClick={() => updateSettings({ exactChangeRequired: !settings.exactChangeRequired })}
              className={`w-16 h-8 rounded-full transition-all ${
                settings.exactChangeRequired ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                  settings.exactChangeRequired ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
}
