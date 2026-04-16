import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import api from '../services/api';
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
import { getAssignedOTs } from '../services/ot';
import { User } from '../types';

export function TechnicianDashboard() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ checked: 0, issues: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedOTs, setAssignedOTs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      setUser(userData);

      const fetchData = async () => {
        try {
          setLoading(true);
          const [dashboardData, otsData, profileResponse] = await Promise.all([
            getATDashboard(userData.id),
            getAssignedOTs(userData.id, userData.id),
            api.get(`/profile/${userData.id}`)
          ]);
          setStats(dashboardData);
          setAssignedOTs(otsData.data || []);
          if (profileResponse.data?.status) {
            console.log("Homepage profile:", profileResponse.data.data);
            setProfile(profileResponse.data.data);
            localStorage.setItem("profile_pic", profileResponse.data.data.profile_pic || "");
          }
        } catch (err) {
          setError('Failed to fetch dashboard data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
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
    if (assignedOTs && assignedOTs.length > 0) {
      const otId = assignedOTs[0].id;
      navigate(`/technician/history/${otId}`);
    } else {
      alert("No OT assigned yet. Please contact Hospital Management to assign an OT.");
    }
  };

  const handleSeeAllOTs = () => {
    navigate('/technician/ot-selection');
  };

  const profilePic = profile?.profile_pic || localStorage.getItem("profile_pic") || undefined;

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
          profilePic={profilePic}
          hideAction={true} />

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-2 mb-5">
          <div className="bg-gradient-to-br from-health-primary to-teal-600 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-5 text-white shadow-lg shadow-teal-200/50 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-slate-600/10 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="relative z-10 text-left">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold">Today's Overview</h2>
                {!isOnline && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 rounded-lg">
                    <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-[10px] font-bold text-amber-300">Offline</span>
                  </div>
                )}
              </div>
              <p className="text-teal-50 dark:text-slate-300 text-sm mb-6 opacity-90">
                {todayDate}
              </p>

              {loading ? (
                <div className="flex justify-center items-center h-24"><Loader className="animate-spin" /></div>
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
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
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
          <div className="grid grid-cols-1 gap-4 mt-4">
            {assignedOTs.length > 0 ? (
              assignedOTs.map((ot, index) => (
                <motion.button
                  key={ot.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/technician/checklist/${ot.id}`)}
                  className="w-full bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-left relative overflow-hidden">

                  {/* Decorative circle */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-health-secondary/30 dark:bg-slate-700/30 rounded-full -mr-6 -mt-6" />

                  <div className="relative z-10 flex items-center gap-4">
                    {/* Teal icon  */}
                    <div className="w-12 h-12 bg-health-primary dark:bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-6 h-6 text-white" />
                    </div>

                    {/* OT name and machine count */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                        {ot.ot_name}
                      </h3>
                      <p className="text-sm text-health-primary dark:text-teal-400 font-medium">
                        {ot.machine_count || 0} Machines Assigned
                      </p>
                    </div>

                    {/* Department badge */}
                    <div className="flex-shrink-0">
                      <span className="px-3 py-1.5 rounded-full bg-health-secondary/60 dark:bg-teal-900/40 text-health-primary dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
                        {ot.ot_type || "OT"}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <Activity className=" w-8 h-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">No OTs assigned to you.</p>
              </div>
            )}
          </div>
        </section>

      </div>

      <BottomNavigation role="technician" />
    </div>);
}