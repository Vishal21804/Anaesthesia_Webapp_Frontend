import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Activity,
  ChevronRight,
  Loader,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { getAssignedOTs } from '../services/ot';

export function ATOTDetails() {
  const navigate = useNavigate();
  const [ots, setOTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadAssignedOTs();
  }, []);

  const loadAssignedOTs = async () => {
    try {
      setLoading(true);
      const data = await getAssignedOTs(user.id, user.id);
      setOTs(data.data || []);
    } catch (e) {
      console.error("Failed to load assigned OTs", e);
      setError("Failed to load assigned OTs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Assigned OTs
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select location for safety check
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-10 h-10 text-health-primary animate-spin mb-4" />
            <p className="text-slate-500">Loading your assigned OTs...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-4 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : ots.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center  mb-4">
              <Activity className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">No OTs assigned</h3>
            <p className="text-sm text-slate-500">Contact your manager if this is an error.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ots.map((ot, index) => (
              <motion.button
                key={ot.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/technician/checklist/${ot.id}`)}
                className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 text-left hover:shadow-md transition-all relative overflow-hidden group">

                <div className="absolute top-0 right-0 w-24 h-24 bg-health-primary/5 dark:bg-teal-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-health-primary/10 transition-colors" />

                <div className="w-12 h-12 bg-health-primary dark:bg-teal-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Activity className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">
                      {ot.ot_name}
                    </h3>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider">
                      {ot.ot_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {ot.location}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {ot.machine_count} Machines
                      </span>
                    </div>
                    {ot.completed_count !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {ot.completed_count} Checked
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-health-primary transition-colors" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation role="technician" />
    </div>
  );
}