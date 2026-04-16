import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export function HMDownloadReportDate() {
    const navigate = useNavigate();
    const location = useLocation();
    const machineIds: number[] = location.state?.machineIds || [];

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [downloading, setDownloading] = useState(false);

    const downloadPdf = async (machineId: number, month: number, year: number) => {
        try {
            const res = await api.get(`/api/report/monthly`, {
                params: { machine_id: machineId, month, year },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_Machine_${machineId}_${month}_${year}.pdf`);
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        } catch (err) {
            console.error(err);
            toast.error(`Failed to download report for Machine ID: ${machineId}`);
        }
    };

    const handleDownload = async () => {
        if (machineIds.length === 0) {
            toast.error('No machines selected. Please go back and select machines.');
            return;
        }
        if (!startDate) {
            toast.error('Please select a start date');
            return;
        }

        const d = new Date(startDate);
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        setDownloading(true);
        const downloadToast = toast.loading(`Generating ${machineIds.length} report(s)...`);

        try {
            for (const machineId of machineIds) {
                await downloadPdf(machineId, month, year);
            }
            toast.success('Downloads triggered successfully!', { id: downloadToast });
        } catch (error) {
            toast.error('An error occurred during download.', { id: downloadToast });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-24"
            style={{ paddingTop: 'var(--safe-area-top)' }}>

            {/* Header Sticky Container */}
            <div className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950 px-5 pt-6 pb-4 border-b border-transparent">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            Select Report Date
                        </h1>
                    </div>
                </div>
            </div>

            <div className="px-5 pt-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-500 mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        Report Duration
                    </h2>

                    <div className="space-y-4 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">
                                From Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                </div>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-700 dark:text-slate-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">
                                To Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                </div>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-700 dark:text-slate-200"
                                />
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-relaxed pt-2">
                            * Reports will be generated based on the Month and Year of the Start Date.
                        </p>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
                >
                    {downloading ? (
                        <span className="animate-pulse">Downloading...</span>
                    ) : (
                        "Download Reports"
                    )}
                </button>
            </div>
        </div>
    );
}
