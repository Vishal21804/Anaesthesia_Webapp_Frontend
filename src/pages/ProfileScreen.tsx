import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  IdCard,
  Building2,
  User,
  Pencil
} from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { motion } from 'framer-motion';
import api from '../services/api';
import { API_BASE_URL } from '../constants';
export function ProfileScreen() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const response = await api.get(`/profile/${userId}`);

      if (response.data?.status) {
        console.log("Profile Data:", response.data.data);
        setProfile(response.data.data);
        localStorage.setItem("profile_pic", response.data.data.profile_pic || "");
      }
    } catch (error) {
      console.error("Profile loading failed", error);
    }
  };

  if (!profile) {
    return <div className="p-6">Loading profile...</div>;
  }

  const contactFields = [
    {
      icon: User,
      label: 'Full Name',
      value: profile?.name || ''
    },
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email || ''
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile?.mobile || ''
    },
    {
      icon: IdCard,
      label: 'Employee ID',
      value: profile?.employee_id || ''
    },
    {
      icon: Building2,
      label: 'Hospital Name',
      value: profile?.hospital_name || ''
    }
  ].filter(field => {
    if (profile?.role === 'AT' || profile?.role === 'BMET') {
      return field.label !== 'Phone';
    }
    return true;
  });

  const profileImageUrl = profile?.profile_pic
    ? (profile.profile_pic.startsWith('http') ? profile.profile_pic : `${API_BASE_URL}/${profile.profile_pic}`)
    : null;

  const mapRole = (backendRole: string) => {
    const roleMap: Record<string, string> = {
      'AT': 'technician',
      'HM': 'management',
      'IC': 'incharge',
      'BMET': 'bmet'
    };
    return roleMap[backendRole] || 'technician';
  };

  return (
    <div
      className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors overflow-y-auto"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      <div className="flex justify-center w-full pt-12 text-left">
        <div className="w-full px-6 lg:px-8 pb-8">
          <div className="max-w-3xl  mb-6 flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Profile</h1>
          </div>
          <div className="flex flex-col items-center gap-8 w-full">
            {/* LEFT COLUMN - Profile Card */}
            <motion.div
              initial={{
                y: 10,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-8 w-full max-w-3xl">

              <div className="flex flex-col items-center text-center gap-4">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-slate-100 dark:border-slate-700 shadow-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16" />
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {profile?.name || 'Loading...'}
                </h1>

                {/* Role */}
                <div className="px-5 py-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                  <p className="text-blue-500 dark:text-blue-400 font-semibold text-[11px] uppercase tracking-[0.1em]">
                    {profile?.role === 'AT' ? 'Anaesthesia Technician' :
                      profile?.role === 'BMET' ? 'Biomedical Technician' :
                        profile?.role === 'IC' ? 'OT In-Charge' :
                          profile?.role === 'HM' ? 'Hospital Manager' : 'Staff'}
                  </p>
                </div>

                {/* Employee ID */}
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium tracking-tight">
                  {profile?.employee_id || 'N/A'}
                </p>
              </div>
            </motion.div>

            {/* RIGHT COLUMN - Contact Information */}
            <div className="w-full flex flex-col items-center">
              <motion.div
                initial={{
                  y: 10,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                transition={{
                  delay: 0.05
                }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-8 w-full max-w-3xl">

                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Contact Information
                  </h2>
                  {!(profile?.role === 'AT' || profile?.role === 'BMET') && (
                    <button
                      onClick={() => navigate("/profile/edit")}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100 dark:border-slate-700">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {contactFields.map((field, index) => {
                    const Icon = field.icon;
                    return (
                      <motion.div
                        key={field.label}
                        initial={{
                          y: 8,
                          opacity: 0
                        }}
                        animate={{
                          y: 0,
                          opacity: 1
                        }}
                        transition={{
                          delay: 0.08 + index * 0.05
                        }}
                        className="flex items-start gap-4">

                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-100/50 dark:border-slate-700">
                          <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <div className="pt-1">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mb-1.5">
                            {field.label}
                          </p>
                          <p className="text-base font-semibold text-slate-700 dark:text-slate-100">
                            {field.value}
                          </p>
                        </div>
                      </motion.div>);

                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation role={mapRole(profile?.role) as any} />
    </div>);
}
