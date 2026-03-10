import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import {
  ClipboardCheck,
  Clock,
  WifiOff,
  ChevronRight,
  Activity,
  AlertCircle,
  Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getATDashboard } from '../services/dashboard';
import { User } from '../types';

export function TechnicianDashboard() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ checked: 0, issues: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      setUser(userData);

      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const data = await getATDashboard(userData.id);
          setStats(data);
        } catch (err) {
          setError('Failed to fetch dashboard data.');
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    } else {
      navigate('/login');
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [navigate]);

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const handleChecklistAction = () => {
    navigate('/technician/ot-selection');
  };

  const handleViewHistory = () => {
    navigate('/technician/history');
  };
  
  const handleSeeAllOTs = () => {
    navigate('/technician/ot-selection');
  };

  return (
    <div
      className="min-h-[917px] bg-[#F8FAFC] dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="w-full px-5">
        <ProfileHeader
          name={user?.name || "Technician"}
          role="technician"
          notificationCount={2} />

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-2 mb-5">
          <div className="bg-gradient-to-br from-health-primary to-teal-600 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-5 text-white shadow-lg shadow-teal-200/50 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-slate-600/10 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold">Today's Overview</h2>
                {!isOnline && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 rounded-lg">
                    <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-[10px] font-bold text-amber-300">Offline</span>
                  </div>
                )}
              </div>
              <p className="text-teal-50 dark:text-slate-300 text-sm mb-5 opacity-90">
                {todayDate}
              </p>

              {loading ? (
                 <div className="flex justify-center items-center h-24"><Loader className="animate-spin"/></div>
              ) : error ? (
                <div className="text-amber-300 text-center">{error}</div>
              ) : (
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ClipboardCheck className="w-3.5 h-3.5 text-white" />
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Checked</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.checked}</p>
                  </div>
                  <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-white" />
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Issues</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.issues}</p>
                  </div>
                  <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-white" />
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Remaining</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleChecklistAction}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 transition-all">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">
                Start Checklist
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleViewHistory}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 transition-all">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Clock className="w-7 h-7" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">
                View History
              </span>
            </motion.button>
          </div>
        </section>
        
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Assigned OT's
            </h2>
            <button
              onClick={handleSeeAllOTs}
              className="text-sm font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-0.5">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* This part can be populated with another API call if needed */}
          <div className="text-center py-10 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <Activity className="mx-auto w-8 h-8 text-slate-400"/>
              <p className="mt-2 text-sm text-slate-500">OT list will be shown here.</p>
          </div>
        </section>

      </div>

      <BottomNavigation role="technician" />
    </div>);
}