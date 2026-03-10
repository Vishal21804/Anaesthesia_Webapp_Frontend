import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
export function ThemePreviewScreen() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Theme Preview
          </h1>
        </header>

        <div className="space-y-6 mb-8">
          <motion.div
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">

            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-800">Light Mode</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Bright and clear interface optimized for well-lit environments
            </p>
            <div className="space-y-2">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-sm font-bold text-slate-700">
                  Card Background
                </p>
              </div>
              <div className="bg-health-primary text-white p-3 rounded-xl">
                <p className="text-sm font-bold">Primary Action</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{
              y: 20,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            transition={{
              delay: 0.1
            }}
            className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-700">

            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-6 h-6 text-slate-300" />
              <h2 className="text-xl font-bold text-slate-100">Dark Mode</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Easy on the eyes in low-light conditions with reduced eye strain
            </p>
            <div className="space-y-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-700">
                <p className="text-sm font-bold text-slate-200">
                  Card Background
                </p>
              </div>
              <div className="bg-health-primary text-white p-3 rounded-xl">
                <p className="text-sm font-bold">Primary Action</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.2
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">

          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            Current Theme
          </h3>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-slate-700 text-slate-300'}`}>

              {theme === 'light' ?
              <Sun className="w-6 h-6" /> :

              <Moon className="w-6 h-6" />
              }
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Currently active
              </p>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => navigate('/settings')}
          className="w-full bg-health-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-health-primary/30 hover:bg-teal-600 transition-all active:scale-95">

          Change Theme
        </button>
      </div>
    </div>);

}