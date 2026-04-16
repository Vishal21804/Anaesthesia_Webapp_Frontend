import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader, MapPin, User, Clock, Wrench } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { BottomNavigation } from "../components/BottomNavigation";

export function BMETIssueDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [issue, setIssue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/issues/${id}`, {
                    params: { creator_id: user.id }
                });
                console.log("ISSUE DETAIL:", res.data);
                if (res.data.status) {
                    setIssue(res.data.data);
                    setNotes(res.data.data.bmet_notes || '');
                } else {
                    toast.error(res.data.message || "Failed to load issue details");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                toast.error("Failed to load issue details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, user.id]);

    const handleResolve = async () => {
        if (!notes) {
            toast.error("Please enter maintenance notes");
            return;
        }

        try {
            await api.post(`/api/issues/resolve/${id}`, null, {
                params: {
                    creator_id: user.id,
                    maintenance_notes: notes
                }
            });

            toast.success("Issue resolved successfully");

            navigate("/bmet/issues");

        } catch (err) {
            console.error(err);
            toast.error("Failed to resolve issue");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
                <Loader className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse text-sm">Loading...</p>
                <BottomNavigation role="bmet" />
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Issue not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="w-full max-w-xs py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg"
                >
                    Go Back
                </button>
                <BottomNavigation role="bmet" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-24">
            {/* MAIN CONTENT */}
            <div className="w-full px-6 py-6">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Issue Details</h1>
                </div>

                {/* ISSUE CARD */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 w-full relative">
                    {/* Priority Badge - Absolute Top Right */}
                    <div className="absolute top-6 right-6">
                        <span className={`
                            px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-wider
                            ${issue?.priority === 'High' || issue?.priority === 'Critical'
                                ? 'bg-red-50 text-red-500 border-red-200'
                                : issue?.priority === 'Medium'
                                    ? 'bg-orange-50 text-orange-500 border-orange-200'
                                    : 'bg-green-50 text-green-500 border-green-200'}
                        `}>
                            {issue?.priority?.toUpperCase()}
                        </span>
                    </div>

                    {/* Card Header */}
                    <div className="mb-6 text-left">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {issue?.machine_name}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Serial: {issue?.serial_number}
                        </p>
                    </div>

                    {/* Status/Issue Box */}
                    <div className="bg-slate-50/50 border border-gray-200/50 rounded-2xl py-4 px-6 mb-8">
                        <p className="text-gray-700 italic text-base text-left">
                            {issue?.at_issue || issue?.status || "Not Working"}
                        </p>
                    </div>

                    {/* Detail Rows with Icons */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-500">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium">
                                {issue?.ot_name || issue?.location || "Assign"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium">
                                Checked by {issue?.checked_by || "Jagadeesh"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium">
                                {issue?.checked_at || issue?.reported_at || "Mar 18, 2026 • 08:49 AM"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* MAINTENANCE NOTES BOX */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 mt-6 w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Maintenance Notes</h3>
                    </div>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add internal maintenance notes (not visible to AT)..."
                        className="w-full bg-transparent text-gray-500 placeholder:text-gray-400 text-sm outline-none resize-none min-h-[120px]"
                    />
                </div>

                {/* BUTTON */}
                <div className="mt-6">
                    <button
                        onClick={handleResolve}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow"
                    >
                        Mark as Resolved
                    </button>
                </div>

            </div>

            {/* NAVIGATION (THIS IS YOUR SIDEBAR + BOTTOM NAV) */}
            <BottomNavigation role="bmet" />
        </div>
    );
}
