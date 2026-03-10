import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Video,
  MessageCircle,
  FileText } from
'lucide-react';
import { motion } from 'framer-motion';
export function HelpGuidelinesScreen() {
  const navigate = useNavigate();
  const helpSections = [
  {
    icon: BookOpen,
    title: 'User Guide',
    description: 'Complete documentation for all features',
    color: 'blue'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video instructions',
    color: 'purple'
  },
  {
    icon: FileText,
    title: 'Safety Protocols',
    description: 'Equipment safety guidelines and procedures',
    color: 'emerald'
  },
  {
    icon: MessageCircle,
    title: 'Contact Support',
    description: 'Get help from our technical team',
    color: 'amber'
  }];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    purple:
    'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
    emerald:
    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    amber:
    'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500'
  };
  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md mx-auto px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Help & Guidelines
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {helpSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={index}
                initial={{
                  y: 20,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 text-left hover:shadow-md transition-all">

                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[section.color as keyof typeof colorClasses]}`}>

                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {section.description}
                    </p>
                  </div>
                </div>
              </motion.button>);

          })}
        </div>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 0.4
          }}
          className="bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-4">

          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
            Need Immediate Help?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Contact technical support for urgent equipment issues
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-bold">Phone:</span> +1 (555) 123-4567
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-bold">Email:</span> support@hospital.com
            </p>
          </div>
        </motion.div>
      </div>
    </div>);

}