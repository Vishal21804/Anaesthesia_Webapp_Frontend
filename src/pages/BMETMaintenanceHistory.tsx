import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Loader } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion } from 'framer-motion';
import { getMachineHistory } from '../services/machine';

export function BMETMaintenanceHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await getMachineHistory(user.id);
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to fetch maintenance history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="w-full px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/bmet-dashboard')}
            className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border shadow-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Maintenance History
          </h1>
        </header>

        {/* Date Filter */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-4 mb-8 shadow-sm border border-slate-50 dark:border-slate-800">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Last 30 Days</span>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading history...</p>
            </div>
          ) : history.length > 0 ? (
            history.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/bmet/inspection/${item.id}`)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-50 dark:border-slate-800 w-full cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Machine Name */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight text-left">
                  {item.machine_name}
                </h2>

                {/* Info Rows */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Serial Number</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">{item.serial_number}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">OT</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">{item.ot_name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Resolved Time</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">{item.resolved_time}</span>
                  </div>
                </div>

                {/* Issue Box */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-4 text-left">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Issue:</p>
                  <p className="text-sm text-gray-500 italic">
                    {item.at_issue}
                  </p>
                </div>

                {/* Maintenance Notes Box */}
                <div className="bg-blue-50/20 dark:bg-blue-900/10 border border-blue-500/50 rounded-2xl p-5 text-left">
                  <p className="text-sm font-bold text-blue-600 mb-1">Maintenance Notes:</p>
                  <p className="text-sm text-blue-500">
                    {item.maintenance_notes}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <Clock size={48} className="mx-auto text-gray-300 mb-4 opacity-50" />
              <p className="text-gray-400 font-medium">No maintenance history recorded.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation role="bmet" />
    </div>
  );
}