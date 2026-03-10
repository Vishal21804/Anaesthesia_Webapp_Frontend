import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MapPin,
  ChevronRight,
  Edit2,
  Trash2,
  Search,
  Loader,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { getOtList } from '../services/ot';
import { OT } from '../types';

export function HMOTRoomManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [ots, setOts] = useState<OT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOts = async () => {
      try {
        setLoading(true);
        const data = await getOtList();
        setOts(data);
      } catch (err) {
        setError('Failed to fetch OT rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOts();
  }, []);

  const filteredOTs = ots.filter(
    (ot) =>
      ot.ot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onClick={() => navigate('/hm/dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              OT Room Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage operation theatres
            </p>
          </div>
        </header>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/hm/add-ot')}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all mb-6">
          <Plus className="w-5 h-5" />
          Add New OT
        </motion.button>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="ml-2 text-slate-500">Loading OTs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {filteredOTs.map((ot, index) =>
              <motion.div
                key={ot.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">
                        {ot.ot_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ot.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3 border-t border-slate-50 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Machines
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-100">
                      {ot.machines_assigned}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${ot.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <p
                        className={`font-bold ${ot.status === 'Active' ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>
                        {ot.status}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    {/* Toggle Switch Placeholder */}
                    <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/management/assign-machines/${ot.id}`)}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  Manage Inventory <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}
            {filteredOTs.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-slate-500">No OT rooms found.</p>
                </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation role="management" />
    </div>);
}