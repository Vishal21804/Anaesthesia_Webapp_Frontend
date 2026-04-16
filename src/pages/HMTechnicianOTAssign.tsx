import React, { useState } from 'react';
import { API_BASE_URL } from '../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';





export default function HMTechnicianOTAssign() {
  const navigate = useNavigate();
  const { id: techId } = useParams();

  const [technician, setTechnician] = useState<any>(null);
  const [assignedOTs, setAssignedOTs] = useState<any[]>([]);
  const [availableOTs, setAvailableOTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAssignedOTs = async (userId: string) => {
    try {
      const creatorId = localStorage.getItem("user_id") || JSON.parse(localStorage.getItem("user") || "{}").id;
      const res = await fetch(
        `${API_BASE_URL}/api/ot/user_assignments?creator_id=${creatorId}&user_id=${userId}`
      );
      const json = await res.json();
      if (json.status) {
        setAssignedOTs(json.data);
      } else {
        setAssignedOTs([]);
      }
    } catch (error) {
      console.error("Failed to fetch assigned OTs:", error);
      setAssignedOTs([]);
    }
  };

  const fetchAvailableOTs = async (role: string) => {
    try {
      const creatorId = localStorage.getItem("user_id") || JSON.parse(localStorage.getItem("user") || "{}").id;
      const res = await fetch(
        `${API_BASE_URL}/api/ot/available?creator_id=${creatorId}&user_role=${role}`
      );
      const json = await res.json();
      if (json.status) {
        setAvailableOTs(json.data);
      } else {
        setAvailableOTs([]);
      }
    } catch (err) {
      console.error("Failed to fetch available OTs:", err);
      setAvailableOTs([]);
    }
  };

  const fetchTechnician = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/profile/${techId}`);
      const json = await res.json();
      if (json.status) {
        const user = json.data;
        console.log("Technician data:", user);
        setTechnician(user);
        await Promise.all([
          fetchAssignedOTs(user.id),
          fetchAvailableOTs(user.role)
        ]);
      }
    } catch (error) {
      console.error("Failed to load technician:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (techId) fetchTechnician();
  }, [techId]);

  const handleAssign = async (otId: number) => {
    try {
      const creatorId = localStorage.getItem("user_id") || JSON.parse(localStorage.getItem("user") || "{}").id;
      const res = await fetch(`${API_BASE_URL}/api/ot/assign?creator_id=${creatorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: techId, ot_id: otId })
      });
      const json = await res.json();
      if (json.status) {
        fetchAssignedOTs(techId!);
        fetchAvailableOTs(technician.role);
      }
    } catch (err) {
      console.error("Assign failed:", err);
    }
  };

  const handleUnassign = async (otId: number) => {
    try {
      const creatorId = localStorage.getItem("user_id") || JSON.parse(localStorage.getItem("user") || "{}").id;
      const res = await fetch(
        `${API_BASE_URL}/api/ot/unassign?creator_id=${creatorId}&user_id=${techId}&ot_id=${otId}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.status) {
        fetchAssignedOTs(techId!);
        fetchAvailableOTs(technician.role);
      }
    } catch (err) {
      console.error("Unassign failed:", err);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      navigate('/management/technician-assignment');
    }, 1000);
  };

  if (loading || !technician) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-left">
        <Loader className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }
  return (
    <div
      className="min-h-[917px] bg-slate-50 dark:bg-slate-950 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate('/management/technician-assignment')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Assign OTs
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select accessible areas
            </p>
          </div>
        </div>
      </div>

      {/* Technician Info */}
      <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 flex items-center gap-3 border border-purple-100 dark:border-purple-900/30 mx-5 mb-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold overflow-hidden">
          {technician.profile_picture ? (
            <img
              src={`${API_BASE_URL}/${technician.profile_picture}?t=${Date.now()}`}
              alt={technician.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-purple-200 flex items-center justify-center text-purple-700">
              {technician.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            {technician.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {technician.role === 'AT'
              ? 'Anaesthesia Tech'
              : technician.role === 'IC'
                ? 'OT Incharge'
                : technician.role === 'BMET'
                  ? 'Biomedical Tech'
                  : technician.role}
          </p>
        </div>
        <div className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
            {assignedOTs.length} Assigned
          </span>
        </div>
      </div>

      <div className="px-5 space-y-6 mb-24 overflow-y-auto h-[calc(100vh-280px)]">
        {/* Assigned OTs Section */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
            Assigned Areas
          </h3>
          <div className="space-y-3">
            {assignedOTs.map((ot) => (
              <div key={ot.id} className="assigned-ot-card bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 border-purple-500 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-0.5">{ot.ot_name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{ot.ot_code}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{ot.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnassign(ot.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {assignedOTs.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400">No areas assigned yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Available OTs Section */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
            Available to Assign
          </h3>
          <div className="space-y-3">
            {availableOTs.map((ot, index) => (
              <motion.button
                key={ot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAssign(ot.id)}
                className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 transition-colors">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-0.5 group-hover:text-purple-600">
                        {ot.ot_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ot.location} • Click to assign
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-purple-500 group-hover:bg-purple-500 text-transparent group-hover:text-white transition-all">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </motion.button>
            ))}
            {availableOTs.length === 0 && (
              <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-400">No more areas available.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Save Button */}
      <div className="fixed left-0 right-0 bottom-0 lg:left-72 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-5 py-4 z-20">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-70">

          {isSaving ?
            <span className="animate-pulse">Redirecting...</span> :

            <>
              <CheckCircle2 className="w-5 h-5" />
              Done
            </>
          }
        </button>
      </div>

      <BottomNavigation role="management" />
    </div>);

}
