import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { BottomNavigation } from "../components/BottomNavigation";
import api from "../services/api";

export function BMETIssueInbox() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get(`/api/issues/machines`, {
          params: { creator_id: user.id }
        });
        console.log("ISSUES:", res.data);
        setIssues(res.data.data || []);
      } catch (err) {
        console.error("Failed to load issues", err);
      }
    };
    fetchIssues();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 8rem)'
      }}>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/bmet-dashboard")}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Issue Inbox</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              {issues.length} UNRESOLVED ISSUES
            </p>
          </div>

          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/50">
            <Inbox size={20} />
          </div>
        </div>
      </div>

      {/* Issue List */}
      <div className="px-5 py-4 space-y-4">
        {issues.map((item, index) => (
          <motion.div
            key={item.machine_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/bmet/issue/${item.machine_id}`)}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight tracking-tight">
                  {item.machine_name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {item.serial_number}
                  </span>
                </div>
              </div>

              <span
                className={`
                  text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border
                  ${item.priority === "High"
                    ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/50"
                    : item.priority === "Medium"
                      ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50"
                  }
                `}
              >
                {item.priority}
              </span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-5 h-5 flex items-center justify-center text-base">📍</div>
                <span className="font-medium">{item.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-5 h-5 flex items-center justify-center text-base">🕒</div>
                <span>{item.reported_at}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-5 h-5 flex items-center justify-center text-base">👤</div>
                <span>Reported by: <span className="text-slate-800 dark:text-slate-200 font-bold">{item.checked_by}</span></span>
              </div>
            </div>
          </motion.div>
        ))}

        {issues.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-6 shadow-inner">
              <Inbox size={40} />
            </div>
            <h3 className="text-slate-800 dark:text-slate-100 font-bold text-lg tracking-tight">Your inbox is clear</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-[200px] ">
              All machines are currently reported as operational.
            </p>
          </div>
        )}
      </div>

      <BottomNavigation role="bmet" />
    </div>
  );
}
