import React, { useState } from 'react';
import { API_BASE_URL } from '../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMRoleAssignment() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [selectedRole, setSelectedRole] = useState('technician');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Mock user data
  const user = {
    id: userId || 'user-1',
    name: 'Sarah Connor',
    email: 'sarah@hospital.com',
    currentRole: 'technician',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };
  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/management/users');
      }, 1500);
    }, 1500);
  };
  const roles = [
    {
      id: 'technician',
      title: 'Anaesthesia Technician',
      description: 'Standard access for daily machine checks and reporting.',
      color: 'teal',
      accent:
        'border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400'
    },
    {
      id: 'bmet',
      title: 'BMET Specialist',
      description:
        'Advanced access for repairs, maintenance logs, and issue resolution.',
      color: 'blue',
      accent:
        'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
    },
    {
      id: 'incharge',
      title: 'In-Charge',
      description:
        'Supervisor access for verifying checklists and approving overrides.',
      color: 'amber',
      accent:
        'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
    }];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center items-center p-6 text-left">
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg text-center max-w-sm w-full border border-slate-100 dark:border-slate-800">

          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center  mb-4 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Role Updated!
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            User permissions have been successfully modified.
          </p>
        </motion.div>
      </div>);

  }
  return (
    <div
      className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="max-w-md  px-6 pt-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Role Assignment
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Modify user access level
            </p>
          </div>
        </header>

        {/* User Info Card */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm mb-6 flex items-center gap-4">

          <img
            src={user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}/${user.avatar}`}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />

          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
              {user.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {user.email}
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Current: {user.currentRole}
            </span>
          </div>
        </motion.div>

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
            delay: 0.1
          }}
          className="space-y-4 mb-8">

          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
            Select New Role
          </h3>

          {roles.map((role) =>
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedRole === role.id ? role.accent : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'}`}>

              <div className="flex items-center justify-between mb-1">
                <h4
                  className={`font-bold ${selectedRole === role.id ? 'text-inherit' : 'text-slate-800 dark:text-slate-100'}`}>

                  {role.title}
                </h4>
                {selectedRole === role.id && <Shield className="w-5 h-5" />}
              </div>
              <p
                className={`text-sm ${selectedRole === role.id ? 'text-inherit opacity-90' : 'text-slate-500 dark:text-slate-400'}`}>

                {role.description}
              </p>
            </button>
          )}
        </motion.div>

        {/* Warning */}
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
            delay: 0.2
          }}
          className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 flex gap-3 mb-6">

          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            Changing this user's role will immediately update their access
            permissions and dashboard view. They may need to sign in again.
          </p>
        </motion.div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

          {loading ?
            <span className="animate-pulse">Updating Role...</span> :

            'Update Role'
          }
        </button>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
