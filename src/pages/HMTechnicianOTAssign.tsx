import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Save, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockOTs } from '../data/mockData';
// Mock technicians data (duplicated for demo)
const technicians = [
{
  id: 'tech-1',
  name: 'Alex Taylor',
  role: 'AT',
  roleLabel: 'Anaesthesia Tech',
  assignedOTs: ['ot-1', 'ot-2'],
  avatar:
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-2',
  name: 'Sarah Smith',
  role: 'AT',
  roleLabel: 'Anaesthesia Tech',
  assignedOTs: ['ot-3'],
  avatar:
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-3',
  name: 'Mike Johnson',
  role: 'IC',
  roleLabel: 'OT Incharge',
  assignedOTs: ['icu'],
  avatar:
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-4',
  name: 'Maria Garcia',
  role: 'BMET',
  roleLabel: 'Biomedical Tech',
  assignedOTs: [],
  avatar:
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
},
{
  id: 'tech-5',
  name: 'James Wilson',
  role: 'BMET',
  roleLabel: 'Biomedical Tech',
  assignedOTs: ['rec'],
  avatar:
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}];

export function HMTechnicianOTAssign() {
  const navigate = useNavigate();
  const { techId } = useParams();
  const technician = technicians.find((t) => t.id === techId) || technicians[0];
  const [selectedOTs, setSelectedOTs] = useState<string[]>(
    technician.assignedOTs
  );
  const [loading, setLoading] = useState(false);
  const toggleOT = (otId: string) => {
    setSelectedOTs((prev) =>
    prev.includes(otId) ? prev.filter((id) => id !== otId) : [...prev, otId]
    );
  };
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/management/technician-assignment');
    }, 1500);
  };
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate('/management/technician-assignment')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Assign OTs
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select accessible areas
            </p>
          </div>
        </div>

        {/* Technician Info */}
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 flex items-center gap-3 border border-purple-100 dark:border-purple-900/30">
          <img
            src={technician.avatar}
            alt={technician.name}
            className="w-10 h-10 rounded-lg object-cover" />

          <div className="flex-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {technician.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {technician.roleLabel}
            </p>
          </div>
          <div className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {selectedOTs.length} Selected
            </span>
          </div>
        </div>
      </div>

      {/* OT List */}
      <div className="px-5 space-y-3 mb-24 overflow-y-auto h-[calc(100vh-280px)]">
        {mockOTs.map((ot, index) => {
          const isSelected = selectedOTs.includes(ot.id);
          return (
            <motion.button
              key={ot.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.05
              }}
              onClick={() => toggleOT(ot.id)}
              className={`w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 transition-all text-left ${isSelected ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' : 'border-slate-200 dark:border-slate-800'}`}>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>

                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3
                      className={`font-bold mb-0.5 ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-800 dark:text-slate-100'}`}>

                      {ot.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {ot.machineCount} machines • {ot.activeIssues} active
                      issues
                    </p>
                  </div>
                </div>
                {isSelected &&
                <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                }
              </div>
            </motion.button>);

        })}
      </div>

      {/* Save Button */}
      <div className="fixed left-0 right-0 bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-5 py-4 z-20">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

          {loading ?
          <span className="animate-pulse">Saving...</span> :

          <>
              <Save className="w-5 h-5" />
              Save Assignment
            </>
          }
        </button>
      </div>
    </div>);

}