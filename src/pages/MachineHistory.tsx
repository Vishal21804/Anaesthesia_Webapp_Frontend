import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  Filter,
  Loader
} from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getMachineDetails, getMachineHistoryById } from '../services/machine';
type HistoryStatus = 'working' | 'not-working' | 'resolved';
type FilterType = 'all' | 'working' | 'not-working' | 'resolved';
interface HistoryItem {
  id: number;
  date: string;
  rawDate: Date;
  status: HistoryStatus;
  itemsChecked: number;
  totalItems: number;
  checkedBy: string;
  resolvedBy?: string;
  resolvedAt?: string;
}
// Helper to group items by time period
function getTimeGroup(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekAgo) return 'This Week';
  return 'Older';
}
export function MachineHistory() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const [machine, setMachine] = useState<any>(null);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const [machineData, historyData] = await Promise.all([
          getMachineDetails(Number(machineId), user.id),
          getMachineHistoryById(Number(machineId), user.id)
        ]);
        setMachine(machineData);
        setHistoryItems(historyData || []);
      } catch (err) {
        console.error("Failed to fetch machine history");
      } finally {
        setLoading(false);
      }
    };
    if (machineId) fetchData();
  }, [machineId]);
  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return historyItems;
    return historyItems.filter((item) => item.status === activeFilter);
  }, [historyItems, activeFilter]);

  // Group items by time period
  const groupedItems = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const order = ['Today', 'Yesterday', 'This Week', 'Older'];
    filteredItems.forEach((item: any) => {
      const date = new Date(item.rawDate || item.date || item.resolved_at);
      const group = getTimeGroup(date);
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    // Return in order
    return order.
      filter((key) => groups[key]?.length > 0).
      map((key) => ({
        label: key,
        items: groups[key]
      }));
  }, [filteredItems]);
  // Count for filters
  const filterCounts = useMemo(
    () => ({
      all: historyItems.length,
      working: historyItems.filter((i) => i.status === 'working').length,
      'not-working': historyItems.filter((i) => i.status === 'not-working').
        length,
      resolved: historyItems.filter((i) => i.status === 'resolved').length
    }),
    [historyItems]
  );
  const handleViewMore = (item: any) => {
    if (machine) {
      navigate(`/technician/inspection/${machineId}`, {
        state: {
          inspection: {
            machineId: machine.id,
            machineName: machine.name,
            otName: machine.otId.toUpperCase(),
            date: item.date.split(',')[0],
            time: item.date.split(', ')[1] || '',
            status: item.status === 'working' ? 'working' : 'broken',
            failedItems:
              item.status !== 'working' ?
                [
                  {
                    id: 'c-2',
                    label: 'Check high-pressure system & cylinder contents',
                    notes: 'Pressure gauge showing inconsistent readings'
                  }] :

                [],
            lifecycle: {
              checkedBy: item.checkedBy,
              resolvedBy: item.resolvedBy,
              resolvedAt: item.resolvedAt
            }
          }
        }
      });
    }
  };
  // Render status badge
  const renderStatusBadge = (status: HistoryStatus) => {
    switch (status) {
      case 'working':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            Working
          </div>);

      case 'not-working':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            Not Working
          </div>);

      case 'resolved':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </div>);

    }
  };
  if (loading) {
    return <div className="p-6 text-center"><Loader className="animate-spin" /></div>;
  }

  if (!machine) {
    return <div className="p-6 text-center">Machine not found</div>;
  }
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Machine History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {machine.name} • {machine.otId.toUpperCase()}
            </p>
          </div>
        </header>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'all' ? 'bg-health-primary text-white shadow-lg shadow-health-primary/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>

            All ({filterCounts.all})
          </button>
          <button
            onClick={() => setActiveFilter('working')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'working' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>

            Working ({filterCounts.working})
          </button>
          <button
            onClick={() => setActiveFilter('not-working')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'not-working' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>

            Not Working ({filterCounts['not-working']})
          </button>
          <button
            onClick={() => setActiveFilter('resolved')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'resolved' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>

            Resolved ({filterCounts.resolved})
          </button>
        </div>

        {/* Grouped History Items */}
        <AnimatePresence mode="popLayout">
          {groupedItems.length === 0 ?
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="text-center py-12">

              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center  mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                No records found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your filter
              </p>
            </motion.div> :

            groupedItems.map((group: any, groupIndex: number) => (
              <div key={group.label} className="mb-6">
                {/* Time Group Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {group.label}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                <div className="space-y-3">
                  {group.items.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{
                        y: 20,
                        opacity: 0
                      }}
                      animate={{
                        y: 0,
                        opacity: 1
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95
                      }}
                      transition={{
                        delay: (groupIndex * group.items.length + index) * 0.05
                      }}
                      className={`bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border-2 transition-all ${item.status === 'working' ? 'border-emerald-100 dark:border-emerald-900/30' : item.status === 'not-working' ? 'border-rose-100 dark:border-rose-900/30' : 'border-blue-100 dark:border-blue-900/30'}`}>

                      {/* Machine Name as Primary Title */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-0.5">
                            {machine.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {machine.model}
                          </p>
                        </div>
                        {renderStatusBadge(item.status)}
                      </div>

                      {/* Date/Time and Technician */}
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{item.checkedBy}</span>
                        </div>
                      </div>

                      {/* Lifecycle indicator for resolved items */}
                      {item.status === 'resolved' && item.resolvedBy &&
                        <div className="mb-3 p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            <span className="font-semibold">
                              Fault Reported → Resolved
                            </span>
                            {item.resolvedAt &&
                              <span className="text-blue-600 dark:text-blue-500">
                                {' '}
                                • {item.resolvedAt}
                              </span>
                            }
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">
                            Resolved by:{' '}
                            <span className="font-semibold">
                              {item.resolvedBy}
                            </span>
                          </p>
                        </div>
                      }

                      {/* View More button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleViewMore(item)}
                          className="flex items-center gap-1 text-sm font-bold text-health-primary hover:text-teal-600 dark:hover:text-teal-400 transition-colors group">

                          View Details
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          }
        </AnimatePresence>
      </div>
      <BottomNavigation role="technician" />
    </div>);

}
