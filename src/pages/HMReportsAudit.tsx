import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Download, Calendar } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockMachines } from '../data/mockData';
import { motion } from 'framer-motion';
export function HMReportsAudit() {
  const navigate = useNavigate();
  // Mock inspection history data derived from machines
  const inspectionHistory = mockMachines.map((m, i) => ({
    id: `insp-${i}`,
    machineName: m.name,
    otId: m.otId,
    date: m.lastChecked,
    status: m.status,
    technician: 'Alex Taylor'
  }));
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
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Reports & Audit
          </h1>
        </header>

        {/* Filters Section */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">

          <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400 font-bold text-sm">
            <Filter className="w-4 h-4" />
            Filter Reports
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-purple-500/20">
              <option>All OTs</option>
              <option>OT-1</option>
              <option>OT-2</option>
              <option>ICU</option>
            </select>

            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-purple-500/20">
              <option>All Status</option>
              <option>Working</option>
              <option>Broken</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-4">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Last 30 Days</span>
          </div>

          <button className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all">
            Apply Filters
          </button>
        </motion.div>

        {/* History List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Recent Inspections
            </h2>
            <button className="text-purple-600 text-xs font-bold flex items-center gap-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>

          {inspectionHistory.map((item, index) =>
            <motion.div
              key={item.id}
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
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">

              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {item.machineName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {item.otId.toUpperCase()} • {item.date}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  By {item.technician}
                </p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.status === 'working' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'}`}>

                {item.status}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
