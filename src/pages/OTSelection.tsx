import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, Loader, AlertCircle } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { getOtList } from '../services/ot';
import { OT } from '../types';
import { motion } from 'framer-motion';

// Department mapping for OT cards
const otDepartments: Record<string, string> = {
  'ot-1': 'ENT',
  'ot-2': 'OPHTHAL',
  'ot-3': 'ENT',
  icu: 'ICU',
  rec: 'RECOVERY'
};

export function OTSelection() {
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
        setError('Failed to fetch assigned OTs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOts();
  }, []);

  const filteredOTs = useMemo(() => {
    let data = ots;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (ot) =>
          ot.ot_name.toLowerCase().includes(query) ||
          ot.location.toLowerCase().includes(query)
      );
    }
    return data;
  }, [ots, searchQuery]);

  return (
    <div
      className="min-h-[917px] bg-[#F8FAFC] dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="w-full px-5 pt-8">
        {/* Header Section */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            Assigned OTs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select location for safety check
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-health-primary/20 focus:border-health-primary transition-all shadow-sm" />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader className="w-8 h-8 text-health-primary animate-spin" />
            <p className="ml-2 text-slate-500">Loading Locations...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* OT Cards List */}
        {!loading && !error && (
          <div className="space-y-3">
            {filteredOTs.map((ot, index) =>
              <motion.button
                key={ot.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/technician/machines/${ot.id}`)}
                className="w-full bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-left relative overflow-hidden">

                {/* Decorative circle */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-health-secondary dark:bg-slate-700/30 rounded-full -mr-6 -mt-6" />

                <div className="relative z-10 flex items-center gap-4">
                  {/* Teal icon container */}
                  <div className="w-12 h-12 bg-health-primary dark:bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-white" />
                  </div>

                  {/* OT name and machine count */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                      {ot.ot_name}
                    </h3>
                    <p className="text-sm text-health-primary dark:text-teal-400">
                      {ot.machines_assigned} Machines Assigned
                    </p>
                  </div>

                  {/* Department badge */}
                  <div className="flex-shrink-0">
                    <span className="px-3 py-1.5 rounded-full bg-health-secondary/60 dark:bg-teal-900/40 text-health-primary dark:text-teal-400 text-xs font-bold">
                      {otDepartments[ot.id] || 'GENERAL'}
                    </span>
                  </div>
                </div>
              </motion.button>
            )}

            {filteredOTs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 dark:text-slate-500">
                  {searchQuery ? `No locations found matching "${searchQuery}"` : "No assigned OTs found."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation role="technician" />
    </div>);
}