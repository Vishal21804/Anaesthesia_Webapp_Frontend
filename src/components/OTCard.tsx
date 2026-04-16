import { Edit, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface OTCardProps {
  ot: any;
  onClick: () => void;
}

export function OTCard({ ot, onClick }: OTCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden cursor-pointer"
    >
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-purple-50 dark:bg-purple-900/10 rounded-full -mr-10 -mt-10"></div>

      {/* OT Type badge */}
      <div className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        {(ot.ot_type || "GENERAL").toUpperCase()}
      </div>

      <div className="flex items-start gap-4 relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Activity className="w-6 h-6" />
        </div>

        {/* OT Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            {ot.ot_name}
          </h3>
          <p className="text-sm text-slate-500">
            {ot.machines_assigned || 0} Machines Assigned
          </p>
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={onClick}
        className="absolute bottom-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
      >
        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      </button>
    </motion.div>
  );
}
