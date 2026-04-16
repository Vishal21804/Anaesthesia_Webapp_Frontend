import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Wrench,
  FileText,
  Users,
  ChevronRight,
  LayoutGrid,
  Settings,
  AlertCircle,
  Loader
} from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { ProfileHeader } from '../components/ProfileHeader';
import { motion } from 'framer-motion';
import { getHMDashboard } from '../services/dashboard';
import api from '../services/api';
import { User } from '../types';

export function HMDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: 'Total OTs', value: '0', icon: LayoutGrid, color: 'purple' },
    { label: 'Total Machines', value: '0', icon: Wrench, color: 'blue' },
    { label: 'Technicians', value: '0', icon: Users, color: 'blue' },
    { label: 'Machines With Issues', value: '0', icon: AlertCircle, color: 'rose' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setProfilePic] = useState<string | undefined>(localStorage.getItem("profile_pic") || undefined);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      setUser(userData);

      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const [dashboardData, profileResponse] = await Promise.all([
            getHMDashboard(userData.id),
            api.get(`/profile/${userData.id}`)
          ]);
          setStats([
            { label: 'Total OTs', value: dashboardData.total_ots.toString(), icon: LayoutGrid, color: 'purple' },
            { label: 'Total Machines', value: dashboardData.total_machines.toString(), icon: Wrench, color: 'blue' },
            { label: 'Technicians', value: dashboardData.technicians.toString(), icon: Users, color: 'blue' },
            { label: 'Machines With Issues', value: dashboardData.machines_with_issues.toString(), icon: AlertCircle, color: 'rose' }
          ]);

          if (profileResponse.data?.status) {
            const pic = profileResponse.data.data.profile_pic || "";
            localStorage.setItem("profile_pic", pic);
            setProfilePic(pic);
          }
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
  }, [navigate]);

  const navigationCards = [
    { id: 'management', title: 'OT Management', description: 'OT Administration', icon: Settings, color: 'slate', path: '/management/ot' },
    { id: 'user-access', title: 'User Access Management', description: 'Control user access & permissions', icon: Shield, color: 'purple', path: '/management/user-access' },
    { id: 'machines', title: 'Machines', description: 'Inventory & Maintenance', icon: Wrench, color: 'blue', path: '/management/machines' },
    { id: 'assignment', title: 'Assignment', description: 'Assign technicians to OTs', icon: Users, color: 'purple', path: '/management/technician-assignment' },
    { id: 'reports', title: 'Report History', description: 'OT & Machine reports', icon: FileText, color: 'emerald', path: '/management/report-history' },

    { id: 'profile', title: 'Profile', description: 'Account & settings', icon: Shield, color: 'slate', path: '/profile' }
  ];

  const getIconColorClass = (color: string) => {
    const colors: Record<string, string> = {
      slate: 'text-slate-600 dark:text-slate-400',
      amber: 'text-amber-600 dark:text-amber-500',
      emerald: 'text-emerald-600 dark:text-emerald-500',
      blue: 'text-blue-600 dark:text-blue-500',
      purple: 'text-purple-600 dark:text-purple-400',
      rose: 'text-rose-600 dark:text-rose-400'
    };
    return colors[color] || colors.slate;
  };
  const getIconBgClass = (color: string) => {
    const colors: Record<string, string> = {
      slate: 'bg-slate-100 dark:bg-slate-800',
      amber: 'bg-amber-50 dark:bg-amber-950/30',
      emerald: 'bg-emerald-50 dark:bg-emerald-950/30',
      blue: 'bg-blue-50 dark:bg-blue-950/30',
      purple: 'bg-purple-50 dark:bg-purple-950/30',
      rose: 'bg-rose-50 dark:bg-rose-950/30'
    };
    return colors[color] || colors.slate;
  };
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors overflow-y-auto text-left"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      {/* Profile Header */}
      <div className="px-5">
        <ProfileHeader
          name={user?.name || "Admin"}
          role="management"
          profilePic={profilePic}
          notificationCount={0}
          hideStatusDot={true}
          actionIcon={<Settings className="w-6 h-6" />}
          onActionClick={() => navigate('/management/hospital-settings')} />

      </div>

      {/* Summary Cards */}
      <div className="px-5 pb-2">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
          Overview
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader className="animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${getIconBgClass(stat.color)}`}>
                    <Icon
                      className={`w-5 h-5 ${getIconColorClass(stat.color)}`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>);

            })}
          </div>
        )}
      </div>

      {/* Navigation Cards */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
          Quick Navigation
        </h2>
        <div className="space-y-3">
          {navigationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                initial={{
                  y: 10,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                transition={{
                  delay: 0.3 + index * 0.06
                }}
                onClick={() => navigate(card.path)}
                className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-4 text-left transition-colors active:bg-slate-50 dark:active:bg-slate-800">

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBgClass(card.color)}`}>

                  <Icon
                    className={`w-5 h-5 ${getIconColorClass(card.color)}`} />

                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {card.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              </motion.button>);

          })}
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);
}
