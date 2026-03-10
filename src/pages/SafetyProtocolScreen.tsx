import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText } from
'lucide-react';
import { motion } from 'framer-motion';
export function SafetyProtocolScreen() {
  const navigate = useNavigate();
  const protocols = [
  {
    title: 'Pre-Check Safety',
    items: [
    'Ensure machine is in standby mode',
    'Verify power supply is stable',
    'Check for visible damage or leaks',
    'Confirm area is clear of hazards']

  },
  {
    title: 'During Inspection',
    items: [
    'Wear appropriate PPE',
    'Follow manufacturer guidelines',
    'Document all observations',
    'Never bypass safety mechanisms']

  },
  {
    title: 'Emergency Procedures',
    items: [
    'Immediately power down unsafe equipment',
    'Tag machine as "Out of Service"',
    'Notify BMET team and supervisor',
    'Secure the area if necessary']

  }];

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
            Safety Protocols
          </h1>
        </header>

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl p-4 mb-6 flex items-start gap-3">

          <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-1">
              Safety First
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Always prioritize safety over speed. When in doubt, consult with a
              supervisor.
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {protocols.map((protocol, index) =>
          <motion.div
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">

              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">
                {protocol.title}
              </h3>
              <ul className="space-y-3">
                {protocol.items.map((item, itemIndex) =>
              <li key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-health-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {item}
                    </span>
                  </li>
              )}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}