import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Database,
  ChevronDown,
  ChevronUp,
  Save } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMSystemSettings() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'general'
  );
  const [loading, setLoading] = useState(false);
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const sections = [
  {
    id: 'general',
    title: 'General Settings',
    icon: Settings,
    content:
    <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Hospital Name
            </label>
            <input
          type="text"
          defaultValue="City General Hospital"
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm" />

          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Timezone
            </label>
            <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
              <option>UTC-05:00 (Eastern Time)</option>
              <option>UTC-08:00 (Pacific Time)</option>
              <option>UTC+00:00 (GMT)</option>
            </select>
          </div>
        </div>

  },
  {
    id: 'notifications',
    title: 'Notification Settings',
    icon: Bell,
    content:
    <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Alerts
            </span>
            <div className="w-10 h-6 bg-purple-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Push Notifications
            </span>
            <div className="w-10 h-6 bg-purple-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Critical Issue SMS
            </span>
            <div className="w-10 h-6 bg-slate-300 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>

  },
  {
    id: 'compliance',
    title: 'Compliance Settings',
    icon: Shield,
    content:
    <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Overdue Threshold (Hours)
            </label>
            <input
          type="number"
          defaultValue="24"
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm" />

          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Auto-Escalate Critical Issues
            </span>
            <div className="w-10 h-6 bg-purple-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>

  },
  {
    id: 'data',
    title: 'Data Management',
    icon: Database,
    content:
    <div className="space-y-3">
          <button className="w-full py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            Export Audit Logs (CSV)
          </button>
          <button className="w-full py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            Backup System Data
          </button>
        </div>

  }];

  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/management/dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              System Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure application parameters
            </p>
          </div>
        </header>

        <div className="space-y-4 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            return (
              <div
                key={section.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">

                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {section.title}
                    </span>
                  </div>
                  {isExpanded ?
                  <ChevronUp className="w-5 h-5 text-slate-400" /> :

                  <ChevronDown className="w-5 h-5 text-slate-400" />
                  }
                </button>
                <AnimatePresence>
                  {isExpanded &&
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1
                    }}
                    exit={{
                      height: 0,
                      opacity: 0
                    }}
                    className="overflow-hidden">

                      <div className="p-4 pt-0 border-t border-slate-50 dark:border-slate-800">
                        <div className="mt-4">{section.content}</div>
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>);

          })}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

          {loading ?
          <span className="animate-pulse">Saving Settings...</span> :

          <>
              Save All Changes <Save className="w-5 h-5" />
            </>
          }
        </button>
      </div>

      <BottomNavigation role="management" />
    </div>);

}