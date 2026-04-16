
import { Settings2Icon, ChevronRight } from 'lucide-react';
import { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
  role?: 'technician' | 'bmet' | 'management';
  showStatus?: boolean;
  onClick?: () => void;
}

export function MachineCard({
  machine,
  role = 'bmet',
  showStatus = false,
  onClick
}: MachineCardProps) {
  const getRoleColors = () => {
    switch (role) {
      case 'technician':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'management':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400';
      case 'bmet':
      default:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'working':
      case 'operational':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'broken':
      case 'not working':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const displayType = machine.machine_type || 'Unknown Type';

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
      onClick={onClick}>

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getRoleColors()}`}>

        <Settings2Icon className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-base">
            {machine.machine_name}
          </h3>
          {showStatus &&
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(machine.status)}`}>

              {machine.status}
            </span>
          }
        </div>

        <p className="text-sm font-medium text-slate-500/80 dark:text-slate-400 truncate mt-0.5">
          {displayType}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
          SN: {machine.serial_number || 'N/A'}
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
    </div>);
}
