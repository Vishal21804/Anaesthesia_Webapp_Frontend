import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants';
import {
    ArrowLeft,
    Loader,
    Edit2,
    Save,
    Clock,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';
import api from '../services/api';
import toast from "react-hot-toast";

export function HMUserAccessControl() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchUserAndAssignments = async () => {
            try {
                setLoading(true);
                const creator = JSON.parse(localStorage.getItem("user") || "{}");

                // Fetch User Details
                const userResp = await api.get(`/get_users?creator_id=${creator.id}`);
                if (userResp.data?.status) {
                    const users = userResp.data.data || [];
                    const foundUser = users.find((u: any) => String(u.id) === String(userId));
                    setUser(foundUser || null);
                }

                // Fetch OT Assignments
                const assignmentsResp = await api.get(
                    `/api/ot/user_assignments?creator_id=${creator.id}&user_id=${userId}`
                );

                if (assignmentsResp.data?.status) {
                    setAssignments(assignmentsResp.data.data || []);
                }
            } catch (err) {
                console.error("Failed to load user access data", err);
                toast.error("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndAssignments();
    }, [userId]);

    const handleToggleStatus = async () => {
        try {
            const creator = JSON.parse(localStorage.getItem("user") || "{}");
            const newStatus = user.status === 1 ? 0 : 1;

            // Update Backend
            await api.put(`/update_user_status?creator_id=${creator.id}`, {
                user_id: user.id,
                status: newStatus
            });

            setUser((prev: any) => ({
                ...prev,
                status: newStatus
            }));
        } catch (error) {
            console.error("Failed to update user status", error);
        }
    };

    const saveChanges = async () => {
        // Name validation: alphabets only
        if (!user.name || !user.name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (!/^[A-Za-z][A-Za-z .'-]*$/.test(user.name.trim())) {
            toast.error("Name must contain only alphabets");
            return;
        }

        if (!user.dob) {
            toast.error("Date of Birth is required");
            return;
        }

        try {
            setSaving(true);
            const creator = JSON.parse(localStorage.getItem("user") || "{}");

            const response = await api.put("/api/user/update", {
                user_id: Number(userId),
                name: user.name.trim(),
                email: user.email.trim(),
                employee_id: user.employee_id,
                dob: user.dob
            }, {
                params: {
                    creator_id: creator.id
                }
            });

            if (response.data?.status || response.status === 200) {
                toast.success("User updated successfully");
            } else {
                toast.error(response.data?.message || "Update failed");
            }
        } catch (err: any) {
            console.error("Failed to save changes", err);
            toast.error(err.response?.data?.detail || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadge = (role: string) => {
        const r = role?.toLowerCase() || '';
        if (r.includes('at') || r.includes('technician')) return <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded">AT</span>;
        if (r.includes('bmet')) return <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">BMET</span>;
        if (r.includes('ic') || r.includes('incharge')) return <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-bold rounded">IC</span>;
        return <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">STAFF</span>;
    };

    const handleDeleteUser = async () => {
        try {
            setIsDeleting(true);
            const creator = JSON.parse(localStorage.getItem("user") || "{}");

            const response = await api.delete(`/api/user/delete/${userId}`, {
                params: {
                    creator_id: creator.id
                }
            });

            if (response.data?.status) {
                toast.success("User permanently deleted");
                setShowDeleteModal(false);
                navigate('/management/user-access');
            } else {
                toast.error(response.data?.message || "Delete failed");
            }
        } catch (err: any) {
            console.error("Failed to delete user", err);
            toast.error(err.response?.data?.detail || "Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div
                className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-5 text-center text-left"
                style={{ paddingTop: 'var(--safe-area-top)' }}
            >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <Loader className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Loading profile...</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Fetching permissions data</p>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-32 text-left"
            style={{
                paddingTop: 'var(--safe-area-top)'
            }}
        >
            {/* Header */}
            <div className="px-5 py-6 sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/management/user-access')}
                            className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95 transition-all border border-slate-100 dark:border-slate-800"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                User Access Control
                            </h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                Manage permissions for {user?.name || 'User'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center text-rose-500 active:scale-95 transition-all border border-slate-100 dark:border-slate-800">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="px-5 space-y-6">
                {/* User Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-50 dark:ring-slate-800 shadow-sm">
                            {user?.profile_pic ? (
                                <img
                                    src={user.profile_pic.startsWith('http') ? user.profile_pic : `${API_BASE_URL}/${user.profile_pic}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`;
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-xl">
                                    {(user?.name || 'U').split(' ').map((n: string) => n[0]).join('')}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</h2>
                                {getRoleBadge(user?.role)}
                            </div>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4 truncate">{user?.email}</p>
                        </div>

                        <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                            <Edit2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center gap-2 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Last login: {user?.last_login || '2026-03-15'}</span>
                    </div>
                </motion.div>

                {/* Access Control section */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 px-1">Access Control</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">Account Status</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                {user?.status === 1 ? 'User can log in and access system' : 'User access is currently disabled'}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleStatus}
                            className={`w-12 h-6 rounded-full transition relative ${user?.status === 1 ? "bg-green-500" : "bg-gray-300"
                                }`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${user?.status === 1 ? "right-0.5" : "left-0.5"
                                    }`}
                            />
                        </button>
                    </div>
                </section>

                {/* Edit Details section */}
                <section>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 px-1">Edit User Details</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 block px-1 uppercase">Name</label>
                            <input
                                value={user?.name || ""}
                                onChange={(e) => setUser((prev: any) => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
                                placeholder="Full Name"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 block px-1 uppercase">Email</label>
                            <input
                                value={user?.email || ""}
                                onChange={(e) => setUser((prev: any) => ({ ...prev, email: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
                                placeholder="Email Address"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 block px-1 uppercase">Employee ID</label>
                            <input
                                value={user?.employee_id || ""}
                                onChange={(e) => setUser((prev: any) => ({ ...prev, employee_id: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
                                placeholder="Employee ID"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 block px-1 uppercase">Date of Birth</label>
                            <input
                                type="date"
                                value={user?.dob || ""}
                                onChange={(e) => setUser((prev: any) => ({ ...prev, dob: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
                            />
                        </div>
                    </div>
                </section>

                {/* OT Assignments section */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                        <span>OT Assignments</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{assignments.length} Assigned Areas</p>
                            <button
                                onClick={() => navigate(`/management/technician-ot-assign/${userId}`)}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-400"
                            >
                                <Edit2 className="w-3 h-3" />
                                Manage
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {assignments.length > 0 ? (
                                assignments.map(ot => (
                                    <motion.span
                                        key={ot.ot_id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[11px] font-bold rounded-full border border-slate-100 dark:border-slate-800"
                                    >
                                        {ot.ot_name}
                                    </motion.span>
                                ))
                            ) : (
                                <p className="text-[11px] text-slate-400 italic">No areas assigned</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Removed Local Status Messages */}
            </div>

            {/* Save Button */}
            <div
                className="
                    fixed bottom-0
                    left-0 lg:left-72 right-0
                    bg-white dark:bg-slate-950/80
                    backdrop-blur-lg
                    p-6
                    border-t border-slate-200 dark:border-slate-800
                    z-40
                "
            >
                <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="
                        w-full
                        flex items-center justify-center gap-2
                        bg-[#8B5CF6]
                        hover:bg-purple-700
                        text-white
                        font-bold
                        py-4
                        rounded-2xl
                        shadow-xl shadow-purple-600/20
                        transition-all duration-200
                        active:scale-[0.98]
                        disabled:opacity-70
                    "
                >
                    {saving ? (
                        <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Save Changes</span>
                            <Save size={20} />
                        </>
                    )}
                </button>
            </div>

            <BottomNavigation role="management" />

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
                        >
                            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                                <Trash2 size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Delete User?</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                Are you sure you want to permanently delete <strong>{user?.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl active:scale-95 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    disabled={isDeleting}
                                    className="py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 dark:shadow-rose-900/20 active:scale-95 transition-all flex items-center justify-center"
                                >
                                    {isDeleting ? <Loader className="w-5 h-5 animate-spin" /> : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
