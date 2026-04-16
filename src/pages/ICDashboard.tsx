import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  FileText
} from
  'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion } from 'framer-motion';
import { ProfileHeader } from '../components/ProfileHeader';
import { useEffect, useState } from 'react';
import api from '../services/api';

export function ICDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<string | undefined>(localStorage.getItem("profile_pic") || undefined);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const u = JSON.parse(userString);
      setUserData(u);

      const fetchProfile = async () => {
        try {
          const response = await api.get(`/profile/${u.id}`);
          if (response.data?.status) {
            const pic = response.data.data.profile_pic || "";
            localStorage.setItem("profile_pic", pic);
            setProfilePic(pic);
          }
        } catch (err) {
          console.error("Failed to fetch IC profile");
        }
      };
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [navigate]);
  const stats = [
    {
      label: 'Pending Reviews',
      value: '5',
      context: 'Awaiting approval',
      icon: Clock,
      color: 'amber'
    },
    {
      label: 'Approved Today',
      value: '12',
      context: 'Machines ready',
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      label: 'Rejected',
      value: '1',
      context: 'Needs correction',
      icon: XCircle,
      color: 'rose'
    },
    {
      label: 'OTs Ready',
      value: '2/5',
      context: 'Fully compliant',
      icon: Activity,
      color: 'blue'
    }];

  const quickActions = [
    {
      id: 'review',
      title: 'Review Checklists',
      description: '5 pending submissions',
      icon: CheckSquare,
      color: 'amber',
      path: '/incharge/reviews',
      badge: 5
    },
    {
      id: 'readiness',
      title: 'OT Readiness',
      description: 'View daily status board',
      icon: Activity,
      color: 'blue',
      path: '/incharge/readiness'
    },
    {
      id: 'machines',
      title: 'Machine Status',
      description: 'Overview by OT',
      icon: FileText,
      color: 'slate',
      path: '/incharge/machines'
    }];

  const recentSubmissions = [
    {
      id: 'sub-1',
      machine: 'Drager Fabius GS',
      ot: 'OT-1',
      tech: 'Alex Taylor',
      time: '10 mins ago',
      status: 'pending'
    },
    {
      id: 'sub-2',
      machine: 'GE Datex-Ohmeda',
      ot: 'OT-1',
      tech: 'Alex Taylor',
      time: '25 mins ago',
      status: 'pending'
    },
    {
      id: 'sub-3',
      machine: 'Mindray WATO EX-65',
      ot: 'OT-2',
      tech: 'Maria Garcia',
      time: '1 hour ago',
      status: 'approved'
    }];

  const getIconColorClass = (color: string) => {
    const colors: Record<string, string> = {
      slate: 'text-slate-600 dark:text-slate-400',
      amber: 'text-amber-600 dark:text-amber-500',
      emerald: 'text-emerald-600 dark:text-emerald-500',
      rose: 'text-rose-600 dark:text-rose-500',
      blue: 'text-blue-600 dark:text-blue-500'
    };
    return colors[color] || colors.slate;
  };
  const getIconBgClass = (color: string) => {
    const colors: Record<string, string> = {
      slate: 'bg-slate-100 dark:bg-slate-800',
      amber: 'bg-amber-50 dark:bg-amber-950/30',
      emerald: 'bg-emerald-50 dark:bg-emerald-950/30',
      rose: 'bg-rose-50 dark:bg-rose-950/30',
      blue: 'bg-blue-50 dark:bg-blue-950/30'
    };
    return colors[color] || colors.slate;
  };
  return (
    <div
      className="min-h-[917px] bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="px-5">
        <ProfileHeader
          name={userData?.name || "Dr. Sarah Connor"}
          role="incharge"
          profilePic={profilePic}
          notificationCount={3} />

      </div>

      {/* Overview Cards */}
      <div className="px-5 pb-2">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Today's Overview
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{
                  y: 15,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.08
                }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">

                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${getIconBgClass(stat.color)}`}>

                    <Icon
                      className={`w-5 h-5 ${getIconColorClass(stat.color)}`} />

                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                  {stat.context}
                </div>
              </motion.div>);

          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
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
                onClick={() => navigate(action.path)}
                className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 text-left transition-colors active:bg-slate-50 dark:active:bg-slate-800">

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBgClass(action.color)}`}>

                  <Icon
                    className={`w-6 h-6 ${getIconColorClass(action.color)}`} />

                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {action.description}
                  </p>
                </div>
                {action.badge &&
                  <div className="w-6 h-6 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-600/30">
                    {action.badge}
                  </div>
                }
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              </motion.button>);

          })}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="px-5 pt-6 pb-6">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Recent Submissions
        </h2>
        <div className="space-y-3">
          {recentSubmissions.map((sub, index) =>
            <motion.div
              key={sub.id}
              initial={{
                y: 10,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                delay: 0.5 + index * 0.05
              }}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">

              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {sub.machine}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sub.ot} • {sub.tech}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide ${sub.status === 'pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'}`}>

                  {sub.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{sub.time}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNavigation role="incharge" />
    </div>);

}
