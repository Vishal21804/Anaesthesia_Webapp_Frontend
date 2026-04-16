import React from 'react';
import { Bell, User } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { UserRole } from '../types';
interface ProfileHeaderProps {
  name: string;
  role: UserRole;
  notificationCount?: number;
  showRole?: boolean;
  profilePic?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
  hideUserInfo?: boolean;
  hideAction?: boolean;
  hideStatusDot?: boolean;
}
export function ProfileHeader({
  name,
  role,
  notificationCount = 0,
  showRole = true,
  profilePic,
  actionIcon,
  onActionClick,
  hideUserInfo = false,
  hideAction = false,
  hideStatusDot = false
}: ProfileHeaderProps) {
  const getAvatarUrl = () => {
    if (profilePic) {
      return profilePic.startsWith('http') ? profilePic : `http://127.0.0.1:8000/${profilePic}`;
    }
    return null;
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
      {!hideUserInfo && (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden text-slate-400">
              {getAvatarUrl() ? (
                <img
                  src={getAvatarUrl()!}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>

            {!hideStatusDot && (
              <div
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 ${getStatusColor()}`}>
              </div>
            )}
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
      )}

      {hideUserInfo && <div></div>}

      {!hideAction && (
        <button
          onClick={onActionClick}
          className="relative p-3 bg-white dark:bg-slate-900 rounded-full shadow-soft hover:shadow-md transition-all duration-300 text-health-text dark:text-slate-300 hover:text-health-primary dark:hover:text-health-primary"
          aria-label={actionIcon ? 'Action' : 'Notifications'}>
  
          {actionIcon ? actionIcon : <Bell className="w-6 h-6" />}
          {!actionIcon && notificationCount > 0 &&
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white dark:border-slate-900"></span>
          }
        </button>
      )}
    </header>);

}