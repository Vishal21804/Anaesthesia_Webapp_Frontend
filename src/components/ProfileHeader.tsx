import React from 'react';
import { Bell } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { UserRole } from '../types';
interface ProfileHeaderProps {
  name: string;
  role: UserRole;
  notificationCount?: number;
  showRole?: boolean;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
}
export function ProfileHeader({
  name,
  role,
  notificationCount = 0,
  showRole = true,
  actionIcon,
  onActionClick
}: ProfileHeaderProps) {
  const getAvatarUrl = () => {
    switch (role) {
      case 'technician':
        return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
      case 'bmet':
        return 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
      case 'incharge':
        return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
      case 'management':
        return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
      default:
        return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
    }
  };
  const getStatusColor = () => {
    switch (role) {
      case 'technician':
        return 'bg-emerald-500';
      case 'bmet':
        return 'bg-blue-500';
      case 'incharge':
        return 'bg-amber-500';
      case 'management':
        return 'bg-purple-500';
      default:
        return 'bg-slate-500';
    }
  };
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={getAvatarUrl()}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />

          <div
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 ${getStatusColor()}`}>
          </div>
        </div>
        <div>
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {name}
            </h1>
            {showRole && <RoleBadge role={role} />}
          </div>
        </div>
      </div>

      <button
        onClick={onActionClick}
        className="relative p-3 bg-white dark:bg-slate-900 rounded-full shadow-soft hover:shadow-md transition-all duration-300 text-health-text dark:text-slate-300 hover:text-health-primary dark:hover:text-health-primary"
        aria-label={actionIcon ? 'Action' : 'Notifications'}>

        {actionIcon ? actionIcon : <Bell className="w-6 h-6" />}
        {!actionIcon && notificationCount > 0 &&
        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white dark:border-slate-900"></span>
        }
      </button>
    </header>);

}