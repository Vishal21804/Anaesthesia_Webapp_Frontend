import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
export function SettingsScreen() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'var(--safe-area-bottom)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Settings
          </h1>
        </header>

        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-1">
            Appearance
          </h2>

          <div className="space-y-3">
            <motion.button
              whileTap={{
                scale: 0.98
              }}
              onClick={() => setTheme('light')}
              className={`
                w-full bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border-2 transition-all text-left
                ${theme === 'light' ? 'border-health-primary dark:border-health-primary' : 'border-slate-100 dark:border-slate-700'}
              `}>

              <div className="flex items-center gap-4">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-colors
                  ${theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                `}>

                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    Light Theme
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Bright and clear interface
                  </p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileTap={{
                scale: 0.98
              }}
              onClick={() => setTheme('dark')}
              className={`
                w-full bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border-2 transition-all text-left
                ${theme === 'dark' ? 'border-health-primary dark:border-health-primary' : 'border-slate-100 dark:border-slate-700'}
              `}>

              <div className="flex items-center gap-4">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-colors
                  ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                `}>

                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    Dark Theme
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Easy on the eyes in low light
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </section>

        <div className="bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold">Note:</span> Theme preference is saved
            locally and will persist across sessions.
          </p>
        </div>
      </div>
    </div>);

}
