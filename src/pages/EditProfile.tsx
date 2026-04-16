import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Camera, Save, Loader2, Upload, User, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

import { BottomNavigation } from '../components/BottomNavigation';

export function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isHM = user.role === 'HM';

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        dob: ""
    });
    
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setFetching(true);
                const res = await api.get(`/profile/${user.id}`);
                const data = res.data.data;
                if (data) {
                    setForm({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.mobile || "",
                        dob: data.dob || ""
                    });
                    if (data.profile_pic) {
                        setPreview(data.profile_pic.startsWith('http') ? data.profile_pic : `${API_BASE_URL}/${data.profile_pic}?t=${Date.now()}`);
                    }
                    // Sync local storage
                    const updatedUser = { ...user, mobile: data.mobile, profile_pic: data.profile_pic };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
            } catch (err) {
                console.error("Failed to load profile from backend:", err);
                setError("Failed to load profile details");
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, []);

    const mapRole = (backendRole: string) => {
        const roleMap: Record<string, string> = {
            'AT': 'technician',
            'HM': 'management',
            'IC': 'incharge',
            'BMET': 'bmet'
        };
        return roleMap[backendRole] || 'technician';
    };

    const theme = {
        primary: isHM ? 'bg-health-purple' : 'bg-health-primary',
        text: isHM ? 'text-health-purple' : 'text-health-primary',
        border: isHM ? 'focus:border-health-purple' : 'focus:border-health-primary',
        shadow: isHM ? 'shadow-purple-500/30' : 'shadow-teal-500/30',
        ring: isHM ? 'ring-purple-500/20' : 'ring-teal-500/20'
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Always update photo if changed (Generic endpoint)
            if (image) {
                const photoData = new FormData();
                photoData.append("mobile", form.phone);
                photoData.append("profile_pic", image);
                await api.put(`/api/user/update-profile/${user.id}`, photoData);
            }

            // 2. Update other fields
            if (isHM) {
                // Use HM specific endpoint with user_id query param
                await api.put(`/api/profile?user_id=${user.id}`, {
                    name: form.name,
                    email: form.email,
                    mobile: form.phone,
                    dob: form.dob || null
                });
            } else {
                // Use generic mobile update if not HM (or can be expanded)
                const formData = new FormData();
                formData.append("mobile", form.phone);
                await api.put(`/api/user/update-profile/${user.id}`, formData);
            }

            // Update local storage name/pic if they changed
            const updatedUser = {
                ...user,
                name: form.name,
                mobile: form.phone
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            navigate(-1);
        } catch (err: any) {
            console.error("Update failed:", err);
            setError(err.response?.data?.message || "An error occurred while updating your profile");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className={`w-8 h-8 animate-spin ${theme.text}`} />
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors flex flex-col items-center overflow-y-auto"
            style={{
                paddingTop: 'var(--safe-area-top)',
                paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
            }}
        >
            <div className="max-w-md w-full px-6 pt-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-soft text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Edit Profile</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Update your account information</p>
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-white/20 dark:border-slate-800"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-2xl border border-rose-100 dark:border-rose-900/30">
                                {error}
                            </div>
                        )}

                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center mb-4">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-inner bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-10 h-10 text-slate-300" />
                                    )}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-10 h-10 ${theme.primary} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform`}>
                                    <Upload className="w-5 h-5" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <p className="mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Change Photo
                            </p>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <User className={`w-5 h-5 text-slate-400 group-focus-within:${theme.text}`} />
                                </div>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    className={`w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent ${theme.border} outline-none text-slate-700 dark:text-slate-200`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <Mail className={`w-5 h-5 text-slate-400 group-focus-within:${theme.text}`} />
                                </div>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    className={`w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent ${theme.border} outline-none text-slate-700 dark:text-slate-200`}
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <Phone className={`w-5 h-5 text-slate-400 group-focus-within:${theme.text}`} />
                                </div>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                                    className={`w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent ${theme.border} outline-none text-slate-700 dark:text-slate-200`}
                                />
                            </div>
                        </div>


                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <Calendar className={`w-5 h-5 text-slate-400 group-focus-within:${theme.text}`} />
                                </div>
                                <input
                                    type="date"
                                    value={form.dob}
                                    onChange={(e) => setForm({...form, dob: e.target.value})}
                                    className={`w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent ${theme.border} outline-none text-slate-700 dark:text-slate-200`}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full ${theme.primary} text-white py-5 rounded-[2rem] font-bold text-lg shadow-lg ${theme.shadow} flex items-center justify-center gap-3 disabled:opacity-70 transition-all mt-4`}
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-6 h-6" />
                                    Save Changes
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
            <BottomNavigation role={mapRole(user.role) as any} />
        </div>
    );
}
