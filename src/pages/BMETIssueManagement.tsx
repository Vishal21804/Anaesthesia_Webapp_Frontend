import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion } from 'framer-motion';
import api from '../services/api';

export function BMETIssueManagement() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await api.get('/api/issues/machines', {
          params: { creator_id: user.id }
        });
        setIssues(res.data.data || []);
      } catch (error) {
        console.error("Failed to load issue management data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="w-full px-6 pt-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/bmet-dashboard')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-md text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Issue Management
          </h1>
        </header>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-teal-500/20 text-sm placeholder:text-slate-300 transition-all font-medium"
            />
          </div>
          <button className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-300 hover:text-teal-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Issue Cards */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : issues.map((item, index) => (
            <motion.div
              key={item.machine_id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 w-full"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                  {item.machine_name}
                </h2>

                <span className={`
                    px-3 py-1 rounded-[1.2rem] border text-[10px] font-bold tracking-wider
                    ${item.priority === 'High' || item.priority === 'Critical'
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : item.priority === 'Medium'
                      ? 'bg-orange-50 text-orange-500 border-orange-200'
                      : 'bg-green-50 text-green-500 border-green-200'}
                  `}>
                  {item.priority?.toUpperCase()}
                </span>
              </div>

              {/* Issue Status */}
              <p className="text-gray-600 mb-6 text-left">
                <span className="font-bold text-gray-800">Issue: </span>
                {item.issue || item.at_issue || item.status || "Not Working"}
              </p>

              {/* Card Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Serial Number</span>
                  <span className="text-gray-800 font-bold">{item.serial_number}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-800 font-bold">{item.location}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Inspection Date</span>
                  <span className="text-gray-800 font-bold whitespace-nowrap">{item.reported_at}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <p className="text-sm">
                  <span className="text-gray-500">Checked by:</span>{' '}
                  <span className="text-gray-800 font-bold">{item.checked_by}</span>
                </p>
                <button
                  onClick={() => navigate(`/bmet/issue/${item.machine_id}`)}
                  className="text-blue-600 font-bold text-sm tracking-tight flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View more →
                </button>
              </div>
            </motion.div>
          ))}

          {!loading && issues.length === 0 && (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-medium tracking-tight">Only healthy machines in inventory.</p>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation role="bmet" />
    </div>
  );
}
