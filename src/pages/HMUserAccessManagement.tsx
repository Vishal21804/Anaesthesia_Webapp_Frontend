import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Shield,
  Filter,
  ChevronRight } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserManagement } from '../contexts/UserManagementContext';
import { BottomNavigation } from '../components/BottomNavigation';
export function HMUserAccessManagement() {
  const navigate = useNavigate();
  const { users, toggleUserAccess } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<
    'all' | 'technician' | 'bmet' | 'incharge'>(
    'all');
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
    switch (role) {
      case 'technician':
        return (
          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-100 dark:border-emerald-900/50">
            AT
          </span>);

      case 'bmet':
        return (
          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-100 dark:border-blue-900/50">
            BMET
          </span>);

      case 'incharge':
        return (
          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-100 dark:border-amber-900/50">
            IC
          </span>);

      default:
        return (
          <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
            Staff
          </span>);

    }
  };
  const activeCount = users.filter((u) => u.enabled).length;
  const disabledCount = users.length - activeCount;
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
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              User Access Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control who can access the system
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {users.length}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Users
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-center">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </div>
            <div className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-wider">
              Active
            </div>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-100 dark:border-rose-900/50 text-center">
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {disabledCount}
            </div>
            <div className="text-[10px] font-bold text-rose-600/70 dark:text-rose-400/70 uppercase tracking-wider">
              Disabled
            </div>
          </div>
        </div>

        {/* Add User Button */}
        <button
          onClick={() => navigate('/management/create-user')}
          className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 mb-4">

          <Plus className="w-5 h-5" />
          Add New User
        </button>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-sm text-slate-800 dark:text-slate-100" />

        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none">

              <option value="all">All Roles</option>
              <option value="technician">Technician</option>
              <option value="bmet">BMET</option>
              <option value="incharge">In-Charge</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative flex-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none">

              <option value="all">All Status</option>
              <option value="enabled">Active</option>
              <option value="disabled">Disabled</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">

              {/* User Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 text-lg">
                    {user.name.
                  split(' ').
                  map((n) => n[0]).
                  join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                        {user.name}
                      </h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Access Toggle */}
                <div className="flex flex-col items-end gap-1">
                  <button
                  onClick={() => toggleUserAccess(user.id)}
                  className={`w-10 h-5 rounded-full transition-all relative ${user.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>

                    <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${user.enabled ? 'right-0.5' : 'left-0.5'}`} />

                  </button>
                  <span
                  className={`text-[10px] font-bold ${user.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>

                    {user.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
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
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                    Last Login
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {user.lastLogin || 'Never'}
                  </p>
                </div>
              </div>

              {/* View Details Button */}
              <button
              onClick={() => navigate(`/management/user-access/${user.id}`)}
              className="w-full py-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors">

                View Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredUsers.length === 0 &&
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No users found matching your filters
            </p>
            <button
            onClick={() => {
              setSearchQuery('');
              setFilterRole('all');
              setFilterStatus('all');
            }}
            className="text-purple-600 dark:text-purple-400 text-sm font-bold mt-2">

              Clear Filters
            </button>
          </div>
        }
      </div>

      <BottomNavigation role="management" />
    </div>);

}