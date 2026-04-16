import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    Building2,
    Pencil,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import api from '../services/api';

export const HMProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const res = await api.get(`/profile/${user.id}`);
                if (res.data.status) {
                    setProfile(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div>
            </div>
        );
    }

    const infoItems = [
        {
            icon: User,
            label: 'Full Name',
            value: profile?.name || '',
            color: 'text-slate-400'
        },
        {
            icon: Mail,
            label: 'Email',
            value: profile?.email || '',
            color: 'text-slate-400'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: profile?.mobile || '',
            color: 'text-slate-400'
        },
        {
            icon: Calendar,
            label: 'Date of Birth',
            value: profile?.dob || '',
            color: 'text-slate-400'
        },
        {
            icon: Building2,
            label: 'Hospital Name',
            value: profile?.hospital_name || '',
            color: 'text-slate-400'
        }
    ].filter(item => {
        if (profile?.role === 'AT' || profile?.role === 'BMET') {
            return item.label !== 'Phone';
        }
        return true;
    });

    const profileImageUrl = profile?.profile_pic
        ? (profile.profile_pic.startsWith('http') ? profile.profile_pic : `${API_BASE_URL}/${profile.profile_pic}`)
        : null;

    return (
        <div
            className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors overflow-y-auto font-sans"
            style={{
                paddingTop: 'var(--safe-area-top)',
                paddingBottom: 'calc(var(--safe-area-bottom) + 6rem)'
            }}>

            <div className="max-w-md mx-auto px-6 pt-10">
                {/* Header Title with Back Button */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/hm-dashboard')}
                        className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-slate-50 dark:border-slate-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-[#1E293B] dark:text-slate-100">Profile</h1>
                </div>

                {/* Top Profile Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 mb-6 text-center border border-slate-200 dark:border-slate-700"
                >
                    <div className="w-24 h-24 mx-auto mb-6 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 text-slate-400">
                        {profileImageUrl ? (
                            <img src={profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12" />
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-[#1E293B] dark:text-slate-100 mb-1">{profile?.name || ''}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium italic">
                        {profile?.role === 'AT' ? 'Anaesthesia Technician' :
                            profile?.role === 'BMET' ? 'Biomedical Technician' :
                                profile?.role === 'IC' ? 'OT In-Charge' :
                                    profile?.role === 'HM' ? 'Hospital Manager' : ''}
                    </p>
                    <p className="text-[11px] text-slate-300 dark:text-slate-500 font-bold uppercase tracking-wider">
                        {profile?.employee_id || ''}
                    </p>
                </motion.div>

                {/* Contact Information Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-base font-bold text-[#1E293B] dark:text-slate-100 text-left w-full">Contact Information</h3>
                        {!(profile?.role === 'AT' || profile?.role === 'BMET') && (
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 text-left">
                        {infoItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="text-left w-full">
                                    <div className="flex items-center gap-5 text-left">
                                        <div className="w-11 h-11 bg-[#F1F5F9] dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 dark:border-slate-800/50">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 text-left items-start flex flex-col">
                                            <p className="text-[11px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-0.5 text-left">
                                                {item.label}
                                            </p>
                                            <p className="text-sm font-bold text-[#334155] dark:text-slate-200 text-left">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                    {index < infoItems.length - 1 && (
                                        <div className="h-px bg-slate-50 dark:bg-slate-800/50 mt-6 -mx-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <BottomNavigation role="management" />
        </div>
    );
};
