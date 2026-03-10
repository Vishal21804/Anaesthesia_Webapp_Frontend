import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Key,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Save } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMHospitalSettings() {
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
      navigate('/management/dashboard');
    }, 1000);
  };
  const sections = [
  {
    id: 'general',
    title: 'Hospital Details',
    icon: Building2,
    content:
    <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Hospital Name
            </label>
            <input
          type="text"
          defaultValue="City General Hospital"
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />

          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Contact Email
            </label>
            <input
          type="email"
          defaultValue="admin@citygeneral.com"
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />

          </div>
        </div>

  },
  {
    id: 'passwords',
    title: 'Default Passwords',
    icon: Key,
    content:
    <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Default Password for Technicians (AT)
            </label>
            <input
          type="text"
          defaultValue="Tech@123"
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />

            <p className="text-[10px] text-slate-400 mt-1">
              New technicians will use this password on their first login.
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Default Password for BMET
            </label>
            <input
          type="text"
          defaultValue="Bmet@123"
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />

            <p className="text-[10px] text-slate-400 mt-1">
              New BMET staff will use this password on their first login.
            </p>
          </div>
        </div>

  },
  {
    id: 'security',
    title: 'Security Policies',
    icon: ShieldCheck,
    content:
    <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Require Password Change
              </span>
              <span className="text-[10px] text-slate-400">
                Force users to change default password on first login
              </span>
            </div>
            <div className="w-10 h-6 bg-purple-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                Session Timeout
              </span>
              <span className="text-[10px] text-slate-400">
                Auto-logout after inactivity
              </span>
            </div>
            <select className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all">
              <option>15 mins</option>
              <option>30 mins</option>
              <option>1 hour</option>
              <option>Never</option>
            </select>
          </div>
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
              Hospital Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage hospital details & defaults
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
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">

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