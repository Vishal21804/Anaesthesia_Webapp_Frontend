import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  FileText,
  ChevronRight,
  Copy,
  Clock,
  AlertCircle
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMChecklistTemplateBuilder() {
  const navigate = useNavigate();
  const templates = [
    {
      id: 1,
      name: 'Anesthesia Workstation',
      items: 12,
      critical: 4,
      version: '1.2',
      updated: '2 days ago'
    },
    {
      id: 2,
      name: 'Ventilator Safety Check',
      items: 8,
      critical: 3,
      version: '1.0',
      updated: '1 week ago'
    },
    {
      id: 3,
      name: 'Patient Monitor Check',
      items: 5,
      critical: 1,
      version: '2.1',
      updated: '3 days ago'
    },
    {
      id: 4,
      name: 'Defibrillator Daily',
      items: 6,
      critical: 2,
      version: '1.1',
      updated: 'Yesterday'
    }];

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
            onClick={() => navigate('/hm-dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Checklist Templates
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage safety protocols
            </p>
          </div>
        </header>

        <motion.button
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          whileTap={{
            scale: 0.98
          }}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all mb-6">

          <Plus className="w-5 h-5" />
          Create New Template
        </motion.button>

        <div className="space-y-4">
          {templates.map((template, index) =>
            <motion.div
              key={template.id}
              initial={{
                y: 20,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                delay: index * 0.05
              }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      v{template.version} • {template.updated}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-slate-300 rounded-full" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Total Items
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {template.items}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-rose-400 rounded-full" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Critical
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {template.critical}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/management/edit-template/${template.id}`)
                }
                className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">

                Edit Template <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}