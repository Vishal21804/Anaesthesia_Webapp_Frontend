import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion } from 'framer-motion';
export function BMETMaintenanceHistory() {
  const navigate = useNavigate();
  // Mock resolved issues history
  const history = [
  {
    id: 'res-1',
    machineName: 'Drager Fabius GS',
    otName: 'OT-1',
    description: 'O2 sensor calibration required',
    resolution: 'Sensor replaced and calibrated',
    date: 'Today, 10:30 AM',
    technician: 'David Chen'
  },
  {
    id: 'res-2',
    machineName: 'Philips IntelliVue',
    otName: 'ICU',
    description: 'Display flickering',
    resolution: 'Loose cable connection fixed',
    date: 'Yesterday, 2:15 PM',
    technician: 'David Chen'
  },
  {
    id: 'res-3',
    machineName: 'Mindray WATO',
    otName: 'OT-2',
    description: 'Gas mixer alarm',
    resolution: 'Firmware updated to v2.4',
    date: 'May 12, 09:45 AM',
    technician: 'David Chen'
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
            onClick={() => navigate('/bmet/dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Maintenance History
          </h1>
        </header>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-3 mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Last 30 Days</span>
        </div>

        <div className="space-y-4">
          {history.map((item, index) =>
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
              delay: index * 0.1
            }}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">

              <div className="absolute top-0 right-0 p-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>

              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                {item.machineName}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                {item.otName} • {item.date}
              </p>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-3">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Issue:
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                  Resolution:
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {item.resolution}
                </p>
              </div>

              <p className="text-xs text-slate-400 mt-3 text-right">
                Resolved by {item.technician}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="bmet" />
    </div>);

}