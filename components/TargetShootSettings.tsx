'use client';

import { motion } from 'framer-motion';
import { useTargetShootStore } from '@/store/target-shoot-store';
import { LEVEL_CONFIGS, GameMode, TargetSpeedSetting } from '@/types/target-shoot';

interface TargetShootSettingsProps {
  onClose: () => void;
  onStartGame: () => void;
}

export default function TargetShootSettings({ onClose, onStartGame }: TargetShootSettingsProps) {
  const settings = useTargetShootStore((state) => state.settings);
  const updateSettings = useTargetShootStore((state) => state.updateSettings);

  const handleModeChange = (mode: GameMode) => {
    updateSettings({ mode });
  };

  const handleLevelChange = (level: number) => {
    updateSettings({ level });
  };

  const handleTargetCountChange = (targetCount: number) => {
    updateSettings({ targetCount });
  };

  const handleTimerChange = (timerSeconds: number) => {
    updateSettings({ timerSeconds });
  };

  const handleSpeedChange = (targetSpeed: TargetSpeedSetting) => {
    updateSettings({ targetSpeed });
  };

  const toggleSound = () => {
    updateSettings({ soundOn: !settings.soundOn });
  };

  const toggleMotion = () => {
    updateSettings({ reduceMotion: !settings.reduceMotion });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            ⚙️ Game Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Game Mode */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Game Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleModeChange('practice')}
              className={`p-4 rounded-xl border-2 transition-all ${
                settings.mode === 'practice'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-bold text-gray-800">Practice Mode</div>
              <div className="text-sm text-gray-600">No timer, unlimited play</div>
            </button>
            <button
              onClick={() => handleModeChange('timeAttack')}
              className={`p-4 rounded-xl border-2 transition-all ${
                settings.mode === 'timeAttack'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">⏱️</div>
              <div className="font-bold text-gray-800">Time Attack</div>
              <div className="text-sm text-gray-600">Race against the clock</div>
            </button>
          </div>
        </div>

        {/* Timer Duration (Time Attack only) */}
        {settings.mode === 'timeAttack' && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Time Limit</h3>
            <div className="flex gap-2">
              {[30, 60, 90, 120].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => handleTimerChange(seconds)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    settings.timerSeconds === seconds
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {seconds}s
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty Level */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Starting Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {LEVEL_CONFIGS.map((config) => (
              <button
                key={config.level}
                onClick={() => handleLevelChange(config.level)}
                className={`py-3 px-2 rounded-xl font-bold transition-all ${
                  settings.level === config.level
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={config.description}
              >
                {config.level}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            {LEVEL_CONFIGS[settings.level - 1]?.description}
          </div>
        </div>

        {/* Target Count */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Number of Targets</h3>
          <div className="flex gap-2">
            {[6, 8, 10].map((count) => (
              <button
                key={count}
                onClick={() => handleTargetCountChange(count)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  settings.targetCount === count
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            More targets = more challenge!
          </div>
        </div>

        {/* Target Speed Control */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Target Speed 🎯</h3>
          <div className="grid grid-cols-5 gap-2">
            {[
              { value: 'very-slow', label: '🐌', name: 'Very Slow' },
              { value: 'slow', label: '🚶', name: 'Slow' },
              { value: 'normal', label: '🏃', name: 'Normal' },
              { value: 'fast', label: '🚀', name: 'Fast' },
              { value: 'very-fast', label: '⚡', name: 'Very Fast' },
            ].map((speed) => (
              <button
                key={speed.value}
                onClick={() => handleSpeedChange(speed.value as TargetSpeedSetting)}
                className={`py-3 px-2 rounded-xl font-bold transition-all ${
                  settings.targetSpeed === speed.value
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={speed.name}
              >
                <div className="text-2xl mb-1">{speed.label}</div>
                <div className="text-xs">{speed.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            Control how fast targets move across the screen
          </div>
        </div>

        {/* Audio Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Audio & Visual</h3>
          <div className="space-y-3">
            <button
              onClick={toggleSound}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                settings.soundOn
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{settings.soundOn ? '🔊' : '🔇'}</span>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Sound Effects</div>
                  <div className="text-sm text-gray-600">
                    {settings.soundOn ? 'On' : 'Off'}
                  </div>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.soundOn ? 'bg-green-500' : 'bg-gray-300'
              } relative`}>
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  animate={{ x: settings.soundOn ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </button>

            <button
              onClick={toggleMotion}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                settings.reduceMotion
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎬</span>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Reduce Motion</div>
                  <div className="text-sm text-gray-600">
                    {settings.reduceMotion ? 'Slower animations' : 'Full animations'}
                  </div>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.reduceMotion ? 'bg-blue-500' : 'bg-gray-300'
              } relative`}>
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  animate={{ x: settings.reduceMotion ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onStartGame();
              onClose();
            }}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg transition-all"
          >
            Start Game! 🚀
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
