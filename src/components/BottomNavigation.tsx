import { useEffect } from 'react';
import {
  Home,
  ClipboardCheck,
  History,
  User,
  Shield,
  FileText,
  CheckSquare,
  Activity,
  LayoutGrid,
  LogOut,
  Users
} from
  'lucide-react';
import { UserRole } from '../types';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
interface BottomNavigationProps {
  role: UserRole;
}
export function BottomNavigation({ role }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { otId } = useParams();
  // ── Tab definitions ──────────────────────────────────
  const techTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/technician-dashboard'
    },
    {
      id: 'checklist',
      icon: ClipboardCheck,
      label: 'Checklist',
      path: '/technician/ot-selection'
    },
    {
      id: 'history',
      icon: History,
      label: 'History',
      path: `/technician/history/${otId || 1}`
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      path: '/technician/profile'
    }];

  const bmetTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/bmet-dashboard'
    },
    {
      id: 'issues',
      icon: ClipboardCheck,
      label: 'Issues',
      path: '/bmet/issues'
    },
    {
      id: 'history',
      icon: History,
      label: 'History',
      path: '/bmet/history'
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      path: '/profile'
    }];

  const managementTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/hm-dashboard'
    },
    {
      id: 'manage',
      icon: LayoutGrid,
      label: 'Manage',
      path: '/management/ot'
    },
    {
      id: 'technician-assignment',
      icon: Users,
      label: 'Assignment',
      path: '/management/technician-assignment'
    },
    {
      id: 'access',
      icon: Shield,
      label: 'Access',
      path: '/management/user-access'
    },
    {
      id: 'reports',
      icon: FileText,
      label: 'Reports',
      path: '/management/report-history'
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      path: '/management/profile'
    }];

  const inchargeTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/incharge/dashboard'
    },
    {
      id: 'reviews',
      icon: CheckSquare,
      label: 'Reviews',
      path: '/incharge/reviews'
    },
    {
      id: 'readiness',
      icon: Activity,
      label: 'Readiness',
      path: '/incharge/readiness'
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      path: '/profile'
    }];

  let tabs = techTabs;
  if (role === 'bmet') tabs = bmetTabs;
  if (role === 'management') tabs = managementTabs;
  if (role === 'incharge') tabs = inchargeTabs;
  // ── Role colours ─────────────────────────────────────────────────
  const roleConfig = {
    management: {
      accent: 'text-purple-600 dark:text-purple-400',
      activeBg: 'bg-purple-500',
      activeText: 'text-white',
      dot: 'bg-purple-600'
    },
    bmet: {
      accent: 'text-blue-600 dark:text-blue-400',
      activeBg: 'bg-blue-500',
      activeText: 'text-white',
      dot: 'bg-blue-600'
    },
    incharge: {
      accent: 'text-amber-600 dark:text-amber-400',
      activeBg: 'bg-amber-500',
      activeText: 'text-white',
      dot: 'bg-amber-600'
    },
    technician: {
      accent: 'text-teal-600 dark:text-teal-400',
      activeBg: 'bg-teal-500',
      activeText: 'text-white',
      dot: 'bg-teal-500'
    }
  };
  const rc = roleConfig[role as keyof typeof roleConfig] ?? roleConfig.technician;
  // ── Active-tab detection ─────────────────────────────────────────
  const isTabActive = (tab: (typeof tabs)[number]) => {
    if (location.pathname === tab.path) return true;
    if (tab.id === 'home' && location.pathname.includes('/management/hospital-settings')) return true;
    if (
      tab.id === 'checklist' && (
        location.pathname.includes('/technician/machines') ||
        location.pathname.includes('/technician/checklist') ||
        location.pathname.includes('/technician/inspect/')
      )
    )
      return true;
    if (tab.id === 'issues' && location.pathname.includes('/bmet/issue'))
      return true;
    if (
      tab.id === 'manage' && (
        location.pathname.includes('/management/ot-') ||
        location.pathname.includes('/management/add-') ||
        location.pathname.includes('/management/machines')))

      return true;
    if (
      tab.id === 'access' && (
        location.pathname.includes('/management/user-access') ||
        location.pathname.includes('/management/users') ||
        location.pathname.includes('/management/create-user')))

      return true;
    if (
      tab.id === 'technician-assignment' && (
        location.pathname.includes('/management/technician-assignment') ||
        location.pathname.includes('/management/technician-ot-assign')))

      return true;
    if (tab.id === 'history' && (location.pathname.includes('/bmet/inspection') || location.pathname.includes('/technician/inspection')))
      return true;
    if (tab.id === 'reports' && location.pathname.includes('/inspection-details'))
      return true;
    if (tab.id === 'profile' && (
      location.pathname.includes('/profile') || 
      location.pathname.includes('/technician/profile') || 
      location.pathname.includes('/management/profile')
    ))
      return true;
    return false;
  };
  // ── Add/remove body class so CSS can offset #root ────────────────
  useEffect(() => {
    document.body.classList.add('has-sidebar');
    return () => {
      document.body.classList.remove('has-sidebar');
    };
  }, []);
  return (
    <div className="flex">
      {/* ════════════════════════════════════════════════════════════
                         DESKTOP SIDEBAR  (hidden on mobile)
                     ════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50">
        {/* Brand header */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Anaesthesia
          </h1>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const active = isTabActive(tab);
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-left transition-all ${active ? `${rc.activeBg} ${rc.activeText} font-semibold shadow-sm` : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}>

                <Icon
                  className="w-6 h-6 flex-shrink-0"
                  strokeWidth={active ? 2.5 : 2} />

                <span className="text-base">{tab.label}</span>
              </button>);

          })}
        </nav>

        {/* Bottom: logout */}
        <div className="px-4 py-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => navigate('/logout-confirm')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all">

            <LogOut className="w-6 h-6 flex-shrink-0" strokeWidth={2} />
            <span className="text-base font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* CONTENT OFFSET (IMPORTANT) */}
      <div className="hidden lg:block w-72"></div>

      {/* ════════════════════════════════════════════════════════════
                         MOBILE BOTTOM NAV  (hidden on desktop)
                     ════════════════════════════════════════════════════════════ */}
      {/* Frosted glow */}
      <div
        className="lg:hidden fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[380px] z-40"
        style={{
          bottom: 'calc(var(--safe-area-bottom) + 1rem)'
        }}>

        <div
          className={`absolute inset-0 rounded-full blur-2xl ${role === 'management' ? 'bg-gradient-to-t from-purple-100/40 to-transparent' : role === 'bmet' ? 'bg-gradient-to-t from-blue-100/40 to-transparent' : role === 'incharge' ? 'bg-gradient-to-t from-amber-100/40 to-transparent' : 'bg-gradient-to-t from-teal-100/40 to-transparent'}`}
          style={{
            transform: 'scale(1.1)'
          }} />

      </div>

      <nav
        className="lg:hidden fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[380px] z-50 bg-white dark:bg-slate-900 rounded-full px-4 py-3 flex justify-between items-center border border-slate-100 dark:border-slate-800"
        style={{
          bottom: 'calc(var(--safe-area-bottom) + 1rem)',
          boxShadow:
            '0 8px 32px -8px rgba(0,0,0,0.1), 0 4px 16px -4px rgba(0,0,0,0.05)'
        }}>

        {tabs.map((tab) => {
          const active = isTabActive(tab);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center flex-1 relative py-2 transition-all">

              <Icon
                className={`w-5 h-5 transition-colors ${active ? rc.accent : 'text-slate-400'}`}
                strokeWidth={2} />

              {active &&
                <>
                  <span
                    className={`text-[9px] font-bold tracking-tight mt-1.5 uppercase ${rc.accent}`}>

                    {tab.label}
                  </span>
                  <div className={`w-1 h-1 rounded-full mt-1 ${rc.dot}`} />
                </>
              }
            </button>);

        })}
      </nav>
    </div>
  );
}