import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Type,
  Layers,
  AlertTriangle,
  HelpCircle,
  Save } from
'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMAddChecklistItem() {
  const navigate = useNavigate();
  const [isCritical, setIsCritical] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Add Checklist Item
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Define safety check step
            </p>
          </div>
        </header>

        <motion.form
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          onSubmit={handleAdd}
          className="space-y-6">

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Item Label <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Check O2 pressure"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  required />

              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Category
              </label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 appearance-none">
                  <option>Pre-Use Check</option>
                  <option>During Use</option>
                  <option>Post-Use</option>
                  <option>Maintenance</option>
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle
                    className={`w-4 h-4 ${isCritical ? 'text-rose-500' : 'text-slate-400'}`} />

                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    Mark as Critical
                  </span>
                </div>
                <p className="text-xs text-slate-500">Must pass to proceed</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCritical(!isCritical)}
                className={`w-12 h-7 rounded-full transition-colors relative ${isCritical ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-700'}`}>

                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isCritical ? 'left-6' : 'left-1'}`} />

              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Help Text (Optional)
              </label>
              <div className="relative">
                <HelpCircle className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="Instructions for the technician..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none" />

              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

            {loading ?
            <span className="animate-pulse">Adding Item...</span> :

            <>
                Add Item <Save className="w-5 h-5" />
              </>
            }
          </button>
        </motion.form>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
