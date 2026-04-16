import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  AlertCircle,
  Wrench,
  Clock } from
'lucide-react';
import { motion } from 'framer-motion';
export function NotificationsScreen() {
  const navigate = useNavigate();
  const notifications = [
  {
    id: 1,
    type: 'critical',
    icon: AlertCircle,
    title: 'Critical Issue Reported',
    message: 'Gas leak detected in Drager Fabius GS (OT-1)',
    time: '5 minutes ago',
    unread: true
  },
  {
    id: 2,
    type: 'success',
    icon: CheckCircle,
    title: 'Repair Completed',
    message: 'Philips IntelliVue monitor back in service',
    time: '1 hour ago',
    unread: true
  },
  {
    id: 3,
    type: 'info',
    icon: Wrench,
    title: 'Maintenance Scheduled',
    message: 'Routine maintenance for OT-2 equipment tomorrow',
    time: '3 hours ago',
    unread: false
  },
  {
    id: 4,
    type: 'warning',
    icon: Clock,
    title: 'Checklist Overdue',
    message: 'Safety checklist pending for 3 machines',
    time: '1 day ago',
    unread: false
  }];

  const typeStyles = {
    critical: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
    success:
    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    info: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    warning:
    'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500'
  };
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Notifications
            </h1>
          </div>
          <button className="text-sm text-health-primary font-bold hover:text-teal-600">
            Mark All Read
          </button>
        </header>

        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={notification.id}
                initial={{
                  x: -20,
                  opacity: 0
                }}
                animate={{
                  x: 0,
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.1
                }}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border transition-all ${notification.unread ? 'border-health-primary dark:border-health-primary' : 'border-slate-100 dark:border-slate-700'}`}>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeStyles[notification.type as keyof typeof typeStyles]}`}>

                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {notification.title}
                      </h3>
                      {notification.unread &&
                      <div className="w-2 h-2 bg-health-primary rounded-full flex-shrink-0 mt-1" />
                      }
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </motion.div>);

          })}
        </div>
      </div>
    </div>);

}
