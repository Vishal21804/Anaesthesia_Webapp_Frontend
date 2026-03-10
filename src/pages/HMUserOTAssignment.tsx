import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserManagement } from '../contexts/UserManagementContext';
import { mockOTs } from '../data/mockData';
export function HMUserOTAssignment() {
  const navigate = useNavigate();
  const { userId } = useParams<{
    userId: string;
  }>();
  const { users, assignOTs } = useUserManagement();
  const user = users.find((u) => u.id === userId);
  const [selectedOTs, setSelectedOTs] = useState<string[]>(
    user?.assignedOTs || []
  );
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">User not found</p>
      </div>);

  }
  const toggleOT = (otId: string) => {
    setSelectedOTs((prev) =>
    prev.includes(otId) ? prev.filter((id) => id !== otId) : [...prev, otId]
    );
  };
  const handleSave = () => {
    assignOTs(userId!, selectedOTs);
    navigate('/management/users');
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
            onClick={() => navigate('/management/users')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              OT Assignment
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign operation theatres
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {user.name.
            split(' ').
            map((n) => n[0]).
            join('')}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {user.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.role === 'technician' ?
              'Anaesthesia Technician' :
              'BMET Specialist'}
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
      <div className="px-5 space-y-3 mb-20">
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
      <div
        className="fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-5 py-4"
        style={{
          bottom: 'var(--safe-area-bottom)'
        }}>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95">

          <Save className="w-5 h-5" />
          Save Assignment
        </button>
      </div>
    </div>);

}