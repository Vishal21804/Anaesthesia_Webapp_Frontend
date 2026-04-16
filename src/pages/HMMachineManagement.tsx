import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SearchIcon,
  ArrowLeft,
  Plus,
  Loader
} from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';
export function HMMachineManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOT = location.pathname.includes("/management/ot");
  const isMachine = location.pathname.includes("/management/machines");
  const [searchQuery, setSearchQuery] = useState('');
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/machine/templates', {
        params: { creator_id: user.id }
      });
      setMachines(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to load machines", err);
      const message =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Failed to fetch machines. Please try again.";
      const errorStr = typeof message === 'string' ? message : "Failed to fetch machines.";
      setError(errorStr);
      toast.error(errorStr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);


  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const filteredMachines = useMemo(() => {
    if (!Array.isArray(machines)) return [];
    return machines.filter((m) => {
      const nameMatch = (m.machine_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const brandMatch = (m.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || brandMatch;
    });
  }, [machines, searchQuery]);
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/hm-dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Machine Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hospital Inventory
            </p>
          </div>
          <button
            onClick={() => navigate('/management/add-machine')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30">

            <Plus className="w-5 h-5" />
            <span>Add</span>
          </button>
        </header>

        {/* Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 mb-6">
          <button
            onClick={() => navigate("/management/ot")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isOT
              ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            OT ROOMS
          </button>
          <button
            onClick={() => navigate("/management/machines")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isMachine
              ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            MACHINES
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Machines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors" />
          </div>
        </div>

        {/* Filter Panel Removed */}

        {/* Add New Machine Button */}
        <button
          onClick={() => navigate('/management/add-machine')}
          className="w-full py-4 mb-6 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-colors">

          <Plus className="w-5 h-5" />
          Add New Machine
        </button>

        {/* Machine List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
              {typeof error === "string" ? error : "Something went wrong"}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMachines.map((machine, index) => (
                <motion.div
                  key={machine.id}
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
                  }}>

                  <div
                    onClick={() => navigate(`/hm-edit-machine/${machine.id}`, { state: { machine } })}
                    className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/20 rounded-[1.2rem] flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 7h12M4 17h12M17 4v6M17 14v6" />
                          <circle cx="9" cy="7" r="1" />
                          <circle cx="15" cy="17" r="1" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-0.5">
                          {machine.machine_name}
                        </h3>
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                          {machine.machine_type_name || machine.machine_type || "Anesthesia Workstation"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {filteredMachines.length === 0 && !loading && !error &&
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No machines found matching your search.
              </p>
            </div>
          }
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm max-h-[80vh] rounded-[2rem] p-6 flex flex-col shadow-2xl"
            >
              <h2 className="text-xl font-bold text-center mb-1 text-slate-800 dark:text-slate-100">
                Assign Machine
              </h2>
              <p className="text-center text-xs text-slate-500 mb-6 font-medium uppercase tracking-widest">
                Select from templates
              </p>

              <div className="overflow-y-auto space-y-3 flex-1 px-1 custom-scrollbar">
                {machines.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleSelect(m.id)}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                      ${selected.includes(m.id)
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm"
                        : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}
                    `}
                  >
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg">
                      📍
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {m.machine_name}
                    </span>
                    {selected.includes(m.id) && (
                      <div className="ml-auto w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 py-4 rounded-xl font-bold cursor-not-allowed"
                  disabled
                >
                  ASSIGN SELECTED MACHINES
                </button>

                <button
                  onClick={() => navigate('/management/add-machine')}
                  className="w-full border-2 border-purple-500 text-purple-600 dark:text-purple-400 py-3.5 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  + ADD NEW MACHINE
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation role="management" />
    </div>);

}
