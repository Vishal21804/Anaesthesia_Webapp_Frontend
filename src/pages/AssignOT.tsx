import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { BottomNavigation } from '../components/BottomNavigation';

export function AssignOT() {
    const navigate = useNavigate();
    const [ots, setOts] = useState<any[]>([]);
    const [machines, setMachines] = useState<any[]>([]);
    const [selectedOt, setSelectedOt] = useState<string | number>('');
    const [selectedMachine, setSelectedMachine] = useState<string | number>('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setFetching(true);
            const [otResponse, machineResponse] = await Promise.all([
                api.get('/api/ot/list'),
                api.get('/api/machines/list')
            ]);

            if (otResponse.data?.status) {
                setOts(otResponse.data.data || []);
            }
            if (machineResponse.data?.status) {
                setMachines(machineResponse.data.data || []);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load options.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOt || !selectedMachine) {
            setError("Please select both OT and Machine.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post("/api/ot/assign-machine", {
                ot_id: Number(selectedOt),
                machine_id: Number(selectedMachine)
            });

            if (response.data?.status || response.status === 200) {
                setSuccess("Machine assigned successfully");
                setSelectedMachine('');
                // Refresh OT data as requested
                fetchData();
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to assign machine.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-health-bg dark:bg-slate-950 transition-colors overflow-y-auto"
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
                            Assign Machine to OT
                        </h1>
                    </div>
                </header>

                {fetching ? (
                    <div className="flex justify-center py-12">
                        <Loader className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                ) : (
                    <motion.form
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onSubmit={handleAssign}
                        className="space-y-6">

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-center text-sm border border-emerald-100 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {success}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    OT Room
                                </label>
                                <select
                                    value={selectedOt}
                                    onChange={(e) => setSelectedOt(e.target.value)}
                                    className="w-full px-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 transition-colors appearance-none"
                                >
                                    <option value="">Select OT Room</option>
                                    {ots.map((ot) => (
                                        <option key={ot.id} value={ot.id}>{ot.ot_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                    Machine
                                </label>
                                <select
                                    value={selectedMachine}
                                    onChange={(e) => setSelectedMachine(e.target.value)}
                                    className="w-full px-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 transition-colors appearance-none"
                                >
                                    <option value="">Select Machine</option>
                                    {machines.map((machine) => (
                                        <option key={machine.id} value={machine.id}>{machine.machine_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

                            {loading ? (
                                <span className="animate-pulse">Assigning Machine...</span>
                            ) : (
                                <>
                                    Assign Machine <Save className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </motion.form>
                )}
            </div>

            <BottomNavigation role="management" />
        </div>
    );
}
