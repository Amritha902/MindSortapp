import React from 'react';
import { useTheme } from './ThemeProvider';

interface CalmModeProps {
  isActive: boolean;
  onToggle: () => void;
}

export function CalmMode({ isActive, onToggle }: CalmModeProps) {
  const { theme } = useTheme();

  return (
    <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
      isActive ? 'bg-blue-50/30 dark:bg-blue-950/30' : ''
    }`}>
      {isActive && (
        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="bg-blue-100 dark:bg-blue-900/50 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                🌸 Calm Mode Active
              </h3>
              <button
                onClick={onToggle}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
              Take a moment to breathe. You're doing great. 💙
            </p>
            <div className="space-y-2">
              <button className="w-full text-xs bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 py-2 rounded hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors">
                🧘 Quick Meditation (2 min)
              </button>
              <button className="w-full text-xs bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 py-2 rounded hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors">
                🌬️ Breathing Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
