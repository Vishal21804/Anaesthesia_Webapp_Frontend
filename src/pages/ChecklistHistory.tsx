import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Loader,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getChecklistMachines } from '../services/checklist';
import { ChecklistHistory as ChecklistHistoryType, User } from '../types';

type FilterType = 'all' | 'working' | 'pending' | 'issues';

export function ChecklistHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [allSessions, setAllSessions] = useState<ChecklistHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getChecklistMachines(user.id);
        const pending = data.pending.map((m: any) => ({
            ...m,
            status: 'pending',
            date: new Date().toISOString(),
            checked_by: user.name,
        }));
        const completed = data.completed.map((m: any) => ({
            ...m,
            status: m.status === 'Working' ? 'working' : 'issues',
            date: new Date().toISOString(), // This should ideally come from the backend
            checked_by: user.name,
        }));

        setAllSessions([...pending, ...completed]);
      } catch (err) {
        setError("Failed to fetch checklist history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const filteredSessions = allSessions.filter((session) => {
    if (activeFilter === 'working' && session.status !== 'working') return false;
    if (activeFilter === 'pending' && session.status !== 'pending') return false;
    if (activeFilter === 'issues' && session.status !== 'issues') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        session.machine_name.toLowerCase().includes(query) ||
        session.serial_number.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const filterCounts = {
    all: allSessions.length,
    working: allSessions.filter((s) => s.status === 'working').length,
    pending: allSessions.filter((s) => s.status === 'pending').length,
    issues: allSessions.filter((s) => s.status === 'issues').length
  };

 const getStatusBadge = (session: ChecklistHistoryType) => {
    switch (session.status) {
      case 'working':
        return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wide"><CheckCircle className="w-3.5 h-3.5" />Working</div>;
      case 'issues':
        return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wide"><AlertCircle className="w-3.5 h-3.5" />Issues</div>;
      case 'pending':
        return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wide"><Clock className="w-3.5 h-3.5" />Pending</div>;
      case 'resolved': //This status is not available from the API for now
        return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wide"><CheckCircle2 className="w-3.5 h-3.5" />Resolved</div>;
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'working': return 'border-emerald-100 dark:border-emerald-900/30';
      case 'issues': return 'border-rose-100 dark:border-rose-900/30';
      case 'pending': return 'border-amber-100 dark:border-amber-900/30';
      default: return 'border-slate-100 dark:border-slate-700';
    }
  };

  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md lg:max-w-6xl mx-auto px-5 lg:px-8 pt-6">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">History</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Inspection & issue records</p>
          </div>
        </header>

        <div className="lg:flex lg:items-center lg:gap-4 mb-6">
          <div className="relative mb-4 lg:mb-0 lg:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search sessions…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 lg:flex-shrink-0">
            {/* Filter buttons */}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSessions.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">No sessions found</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filter</p>
                </motion.div>
              ) : (
                filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border-2 transition-all ${getBorderColor(session.status)}`}>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">{session.machine_name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{session.machine_type}</p>
                      </div>
                      {getStatusBadge(session)}
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 dark:text-slate-500">Serial Number</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{session.serial_number}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 dark:text-slate-500">Inspection Date</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Checked by: <span className="font-bold text-slate-700 dark:text-slate-300">{session.checked_by}</span>
                      </span>
                      <button disabled className="flex items-center gap-1.5 text-sm font-bold text-slate-400 cursor-not-allowed">
                        View Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
      <BottomNavigation role="technician" />
    </div>);
}