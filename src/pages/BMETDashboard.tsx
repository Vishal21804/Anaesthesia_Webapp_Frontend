import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "../components/ProfileHeader";
import { BottomNavigation } from "../components/BottomNavigation";
import { useEffect, useState } from "react";
import { getBMETDashboard } from "../services/dashboard";
import { getMachineHistory } from "../services/machine";
import api from "../services/api";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Wrench,
  Inbox,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
export function BMETDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    issues: 0,
    critical: 0,
    done: 0,
  });
  const [issues, setIssues] = useState<any[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<string | undefined>(localStorage.getItem("profile_pic") || undefined);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (!userString) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userString);
    setUserData(user);

    const loadDashboard = async () => {
      try {
        console.log("BMET: Starting dashboard data fetch for user:", user.id);

        // 1. Stats
        try {
          const dashboardData = await getBMETDashboard(user.id);
          console.log("BMET: Stats received:", dashboardData);
          if (dashboardData) setStats(dashboardData);
        } catch (e) {
          console.error("BMET: Failed to fetch stats", e);
        }

        // 2. History
        try {
          const historyResponse = await getMachineHistory(user.id);
          console.log("BMET: History received:", historyResponse);
          if (historyResponse?.data && Array.isArray(historyResponse.data)) {
            setRecentUpdates(historyResponse.data.slice(0, 3));
          }
        } catch (e) {
          console.error("BMET: Failed to fetch history", e);
        }

        // 3. Issues
        try {
          const res = await api.get('/api/issues/machines', { params: { creator_id: user.id } });
          console.log("BMET: Issues received:", res.data);
          if (res.data?.data && Array.isArray(res.data.data)) {
            setIssues(res.data.data.slice(0, 1));
          }
        } catch (e) {
          console.error("BMET: Failed to fetch issues", e);
        }

        // 4. Profile
        try {
          const res = await api.get(`/profile/${user.id}`);
          if (res.data?.status && res.data?.data) {
            const pic = res.data.data.profile_pic || "";
            localStorage.setItem("profile_pic", pic);
            setProfilePic(pic);
          }
        } catch (e) {
          console.error("BMET: Failed to fetch profile", e);
        }
      } catch (globalErr) {
        console.error("BMET: Global error in loadDashboard", globalErr);
      }
    };

    loadDashboard();
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="w-full px-6">
        <ProfileHeader
          name={userData?.full_name || userData?.name || "BMET"}
          role="bmet"
          profilePic={profilePic}
          notificationCount={5}
        />

        <motion.section
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="mt-2 mb-6"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-slate-900 dark:to-slate-800 rounded-[2rem] p-7 text-white shadow-lg shadow-blue-200/50 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-slate-600/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-900/10 dark:bg-slate-900/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

            <div className="relative z-10 text-left">
              <h2 className="text-2xl font-bold mb-1">Maintenance Hub</h2>
              <p className="text-blue-50 dark:text-slate-300 text-sm mb-6 opacity-90">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      Pending
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{stats.issues}</p>
                  <p className="text-[9px] text-blue-50 dark:text-slate-300">
                    Machines
                  </p>
                </div>

                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wrench className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      Critical
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{stats.critical}</p>
                  <p className="text-[9px] text-blue-50 dark:text-slate-300">
                    Machines
                  </p>
                </div>

                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      Done
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{stats.done}</p>
                  <p className="text-[9px] text-blue-50 dark:text-slate-300">
                    Total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => navigate("/bmet/issues")}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2.5 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 relative">
                <Inbox className="w-6 h-6" />
                {stats.issues > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {stats.issues}
                    </span>
                  </div>
                )}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                Issue Inbox
              </span>
            </motion.button>

            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => navigate("/bmet/history")}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2.5 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                History
              </span>
            </motion.button>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Issues
            </h2>
            <button
              onClick={() => navigate("/bmet/issues")}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              See all <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          {issues.length > 0 ? (
            issues.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] dark:shadow-[0_0_25px_rgba(0,0,0,0.2)] mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    {item.machine_name}
                  </h3>
                  <span className={`px-3 py-1 rounded-[1rem] border text-[9px] font-bold tracking-wider uppercase ${item.priority === 'High' || item.priority === 'Critical'
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-green-50 text-green-500 border-green-200'
                    }`}>
                    {item.priority}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-6 text-left">
                  <span className="font-bold">Issue: </span>{item.remarks || "Not Working"}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500">Serial Number</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{item.serial_number}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500">Location</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{item.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500">Inspection Date</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap">{item.reported_at}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                  <p className="text-[13px]">
                    <span className="text-gray-500">Checked by:</span>{' '}
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{item.checked_by}</span>
                  </p>
                  <button
                    onClick={() => navigate(`/bmet/issue/${item.machine_id}`)}
                    className="text-blue-600 font-bold text-[13px] tracking-tight flex items-center gap-1"
                  >
                    View more <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-medium">No pending issues.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Recent Updates
            </h2>
            <button
              onClick={() => navigate("/bmet/history")}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              History <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] dark:shadow-[0_0_25px_rgba(0,0,0,0.2)]">
            {recentUpdates.length > 0 ? (
              recentUpdates.map((update, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${index !== recentUpdates.length - 1 ? "mb-6 pb-6 border-b border-slate-50 dark:border-slate-800" : ""
                    }`}
                >
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <CheckCircle className="w-6 h-6 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">
                      {update.machine_name} Repaired
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 border-gray-100">
                      Serial: {update.serial_number} • {update.ot_name} • {update.resolved_time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm font-medium">
                No recent updates recorded.
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNavigation role="bmet" />
    </div>
  );
}
