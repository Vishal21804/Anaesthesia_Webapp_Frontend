import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  Calendar,
  Clock,
  Save,
  AlertTriangle,
  Edit2,
  Check,
  Pencil
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { useUserManagement } from '../contexts/UserManagementContext';
import { BottomNavigation } from '../components/BottomNavigation';
import { UserRole } from '../types';
import api from '../services/api';

import { API_BASE_URL } from "../constants";
const API_BASE = API_BASE_URL;

const getProfileImage = (path: string | null | undefined) => {
  if (!path) return null;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${API_BASE}/${cleanPath}`;
};

export function HMUserAccessDetail() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { users, updateUser, toggleUserAccess } = useUserManagement();
  const user = users.find((u) => u.id === userId);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Local state for editable form fields
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editRole, setEditRole] = useState(user?.role || 'technician');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/user/${userId}`);
        const data = res.data.data;
        if (data) {
          setEditName(data.name || "");
          setEditEmail(data.email || "");
          if (data.role) setEditRole(data.role);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex items-center justify-center text-left">
        <p className="text-slate-500">User not found</p>
      </div>);

  }
  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/api/user/update`, {
        user_id: Number(userId),
        name: editName,
        email: editEmail
      });
      updateUser(user.id, {
        name: editName,
        email: editEmail,
        role: editRole as UserRole
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/management/user-access');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'technician':
        return (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
            AT
          </span>);

      case 'bmet':
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
            BMET
          </span>);

      case 'incharge':
        return (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-100">
            IC
          </span>);

      default:
        return (
          <span className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
            Staff
          </span>);

    }
  };
  const getRoleShortLabel = (role: string) => {
    switch (role) {
      case 'technician':
        return 'AT';
      case 'bmet':
        return 'BMET';
      case 'incharge':
        return 'IC';
      case 'management':
        return 'HM';
      default:
        return role.toUpperCase();
    }
  };
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-health-bg dark:bg-slate-950 flex flex-col justify-center items-center p-6">
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
            Changes Saved!
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            User access permissions have been updated.
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
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/management/user-access')}
            className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              User Access Control
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage permissions for {user.name}
            </p>
          </div>
        </header>

        {/* User Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 text-xl overflow-hidden">
              {getProfileImage(user.profile_pic) ? (
                <img
                  src={getProfileImage(user.profile_pic)!}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-200 flex items-center justify-center text-purple-700">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                  {user.name}
                </h2>
                {getRoleBadge(user.role)}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
            <button className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Last Login - below user card */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-2 mb-6">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last Login: {user.lastLogin || 'Never'}</span>
        </div>

        <div className="space-y-6">
          {/* Access Control Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
              Access Control
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">
                  Account Status
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.enabled ?
                    'User can log in and access system' :
                    'User access is currently blocked'}
                </p>
              </div>
              <button
                onClick={() => toggleUserAccess(user.id)}
                className={`w-12 h-7 rounded-full transition-colors relative ${user.enabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>

                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${user.enabled ? 'left-6' : 'left-1'}`} />

              </button>
            </div>
          </section>

          {/* Edit User Details Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
              Edit User Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors" />

              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors" />

              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
                  Role
                </label>
                <input
                  type="text"
                  value={getRoleShortLabel(editRole)}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none cursor-default" />

              </div>
            </div>
          </section>

          {/* OT Assignments Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
              OT Assignments
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {user.assignedOTs.length} Assigned Areas
                </span>
                <button
                  onClick={() =>
                    navigate(`/management/user-ot-assignment/${user.id}`)
                  }
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">

                  <Edit2 className="w-3 h-3" /> Manage
                </button>
              </div>

              {user.assignedOTs.length > 0 ?
                <div className="flex flex-wrap gap-2">
                  {user.assignedOTs.map((ot) =>
                    <span
                      key={ot}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">

                      {ot.toUpperCase()}
                    </span>
                  )}
                </div> :

                <p className="text-xs text-slate-400 italic">
                  No OTs assigned yet.
                </p>
              }
            </div>
          </section>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70 mb-6">

            {loading ?
              <span className="animate-pulse">Saving Changes...</span> :

              <>
                Save Changes <Save className="w-5 h-5" />
              </>
            }
          </button>
        </div>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
