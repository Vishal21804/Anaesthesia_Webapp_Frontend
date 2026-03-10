import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { OT } from '../types';
import { motion } from 'framer-motion';
interface OTCardProps {
  ot: OT;
  onClick: () => void;
}
export function OTCard({ ot, onClick }: OTCardProps) {
  return (
    <motion.button
      whileHover={{
        scale: 1.03
      }}
      whileTap={{
        scale: 0.97
      }}
      onClick={onClick}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 text-left w-full hover:shadow-md transition-all relative overflow-hidden group">

      <div className="absolute top-0 right-0 w-24 h-24 bg-[#edf9f8] dark:bg-teal-900/20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

      <div className="relative z-10">
        <div className="w-10 h-10 bg-health-secondary dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-health-primary dark:text-teal-400 mb-4">
          <Activity className="w-6 h-6" />
        </div>

        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">
          {ot.name}
        </h3>
        <p className="text-sm text-slate-400 mb-3">
          {ot.machineCount} Machines
        </p>
      </div>
    </motion.button>);

}