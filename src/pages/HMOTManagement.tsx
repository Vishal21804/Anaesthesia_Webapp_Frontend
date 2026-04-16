import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, SearchIcon, Loader } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { OTCard } from '../components/OTCard';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export function HMOTManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOT = location.pathname.includes("/management/ot");
  const isMachine = location.pathname.includes("/management/machines");
  const [searchQuery, setSearchQuery] = useState('');
  const [ots, setOts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/ot/list`);

        if (response.data?.status) {
          const otList = response.data.data || [];

          // Fetch machines for each OT to get accurate count
          const otsWithMachines = await Promise.all(
            otList.map(async (ot: any) => {
              try {
                const machineRes = await api.get(`/api/ot/${ot.id}/machines`);
                return {
                  ...ot,
                  machines: machineRes.data?.data || [],
                  machines_assigned: (machineRes.data?.data || []).length
                };
              } catch (err) {
                console.error(`Failed to load machines for OT ${ot.id}`, err);
                return { ...ot, machines: [], machines_assigned: 0 };
              }
            })
          );

          const formattedOTs = otsWithMachines.map((ot: any) => ({
            ...ot,
            name: ot.ot_name,
            machineCount: ot.machines_assigned
          }));

          setOts(formattedOTs);
        } else {
          setOts([]);
        }
      } catch (error) {
        console.error("Failed to load OTs", error);
        setError("Failed to fetch OT list");
      } finally {
        setLoading(false);
      }
    };

    fetchOts();
  }, []);

  // Filter logic
  const filteredOTRooms = useMemo(() => {
    return (ots || []).filter((room: any) => {
      const matchesSearch = (room.ot_name || room.name || '').
        toLowerCase().
        includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [ots, searchQuery]);

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
              OT Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure Operation Theatres
            </p>
          </div>
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
          onClick={() => navigate('/management/add-ot')}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all mb-6">

          <Plus className="w-5 h-5" />
          Add New OT
        </motion.button>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search OT rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
              {error}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOTRooms.map((ot: any, index: number) => (
                <motion.div
                  key={ot.id}
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
                  className="relative group">

                  <OTCard
                    ot={ot}
                    onClick={() => navigate(`/management/edit-ot/${ot.id}`)} />

                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {filteredOTRooms.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No OT rooms available
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>
  );
}