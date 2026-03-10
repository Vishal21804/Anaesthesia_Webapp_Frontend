import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Edit2,
  Filter } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useUserManagement,
  ManagedUser } from
'../contexts/UserManagementContext';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMUserManagement() {
  const navigate = useNavigate();
  const { users, toggleUserAccess, updateUser } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'technician' | 'bmet'>(
    'all'
  );
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'enabled' | 'disabled'>(
    'all');
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus =
    filterStatus === 'all' ||
    filterStatus === 'enabled' && user.enabled ||
    filterStatus === 'disabled' && !user.enabled;
    return matchesSearch && matchesRole && matchesStatus;
  });
  const getRoleBadge = (role: string) => {
    if (role === 'technician') {
      return (
        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg">
          AT
        </span>);

    }
    return (
      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg">
        BMET
      </span>);

  };
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/management/dashboard')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              User Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control access and permissions
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-sm text-slate-800 dark:text-slate-100" />

        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none">

            <option value="all">All Roles</option>
            <option value="technician">AT Only</option>
            <option value="bmet">BMET Only</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none">

            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="px-5 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, index) =>
          <motion.div
            key={user.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            transition={{
              delay: index * 0.05
            }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">

              {/* User Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
                    {user.name.
                  split(' ').
                  map((n) => n[0]).
                  join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">
                        {user.name}
                      </h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                onClick={() => toggleUserAccess(user.id)}
                className={`w-12 h-6 rounded-full transition-all relative ${user.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>

                  <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-lg ${user.enabled ? 'right-0.5' : 'left-0.5'}`} />

                </button>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                    Status
                  </p>
                  <div className="flex items-center gap-1">
                    {user.enabled ?
                  <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-600">
                          Enabled
                        </span>
                      </> :

                  <>
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span className="text-xs font-bold text-rose-600">
                          Disabled
                        </span>
                      </>
                  }
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                    Assigned OTs
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {user.assignedOTs.length > 0 ?
                  `${user.assignedOTs.length} OT${user.assignedOTs.length > 1 ? 's' : ''}` :
                  'None'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                onClick={() =>
                navigate(`/management/user-ot-assignment/${user.id}`)
                }
                className="flex-1 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors">

                  <Edit2 className="w-3.5 h-3.5" />
                  Assign OTs
                </button>
                <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Creds
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredUsers.length === 0 &&
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No users found
            </p>
          </div>
        }
      </div>

      <BottomNavigation role="management" />
    </div>);

}