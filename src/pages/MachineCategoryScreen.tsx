import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wind, Activity, Droplet, Zap, Loader, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMachineList } from '../services/machine';
import { getOtList } from '../services/ot';
import { Machine, OT } from '../types';

const categoryStyleMapping: { [key: string]: { icon: React.ElementType, color: string } } = {
  'Anesthesia Machine': { icon: Wind, color: 'blue' },
  'Patient Monitor': { icon: Activity, color: 'emerald' },
  'Infusion Pump': { icon: Droplet, color: 'purple' },
  'Defibrillator': { icon: Zap, color: 'amber' },
  'default': { icon: Zap, color: 'gray' }
};

export function MachineCategoryScreen() {
  const navigate = useNavigate();
  const { otId } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [ot, setOt] = useState<OT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!otId) {
        setError("OT ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [allMachines, allOts] = await Promise.all([getMachineList(), getOtList()]);
        
        const currentOtId = parseInt(otId, 10);
        const currentOt = allOts.find((o: OT) => o.id === currentOtId);
        setOt(currentOt || null);

        if (currentOt) {
          const machinesInOt = allMachines.filter((m: Machine) => m.assigned_ots.includes(currentOt.id));
          
          const groupedCategories = machinesInOt.reduce((acc, machine) => {
            const category = machine.machine_type;
            if (!acc[category]) {
              acc[category] = {
                id: category.toLowerCase().replace(/ /g, '-'),
                name: category,
                count: 0,
                ...categoryStyleMapping[category] || categoryStyleMapping.default
              };
            }
            acc[category].count++;
            return acc;
          }, {} as any);

          setCategories(Object.values(groupedCategories));
        } else {
            setError("OT not found.");
        }

      } catch (err) {
        setError("Failed to fetch machine categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [otId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <Loader className="w-8 h-8 text-health-primary animate-spin" />
        <p className="ml-2 text-slate-500">Loading Categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-health-bg dark:bg-slate-950">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-red-500">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-health-primary text-white rounded-lg">
            Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-health-bg dark:bg-slate-950 pb-32 transition-colors">
      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Select Category
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{ot?.ot_name}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const colorClasses: {[key: string]: string} = {
              blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
              emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
              purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
              amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
              gray: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            };
            return (
              <motion.button
                key={category.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() =>
                  navigate(
                    `/technician/machines/${otId}?category=${category.id}`
                  )
                }
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 text-left hover:shadow-md transition-all relative overflow-hidden group">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorClasses[category.color]}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {category.count} machines
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-health-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </motion.button>);

          })}
           {categories.length === 0 && (
            <div className="text-center py-10">
                <p className="text-slate-500">No machine categories found in this OT.</p>
            </div>
           )}
        </div>
      </div>
    </div>);
}
