// filepath: c:\Users\binay\OneDrive\Desktop\Complaint\client\src\pages\Overview.jsx
import { useEffect, useState } from "react";
import API from "@/api/axios";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  ClipboardList,
  Users,
  Hourglass,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      API.get("/complaints"),
      API.get("/admin/users").catch(() => ({ data: [] })),
    ])
      .then(([cRes, uRes]) => {
        if (!mounted) return;
        const complaintsData = cRes.data || [];
        const usersData = uRes.data || [];

        setComplaints(complaintsData);
        setUsers(usersData);

        // status counts
        const counts = { Pending: 0, "In-Progress": 0, Resolved: 0 };
        complaintsData.forEach((c) => {
          const s = c.status || "Pending";
          if (counts[s] !== undefined) counts[s]++;
        });

        // unique emails (from complaints + users) as requested
        const emails = new Set();
        complaintsData.forEach((c) => {
          const e = c.createdBy?.email || c.createdBy?.name; // fallback if email not present
          if (e) emails.add(e);
        });
        usersData.forEach((u) => {
          if (u.email) emails.add(u.email);
        });

        // monthly trend (last 6 months) from complaints.createdAt
        const now = new Date();
        const months = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          return {
            key: `${d.getFullYear()}-${d.getMonth() + 1}`,
            label: d.toLocaleString(undefined, { month: "short" }),
          };
        });
        const monthMap = Object.fromEntries(months.map((m) => [m.key, 0]));
        complaintsData.forEach((c) => {
          const d = new Date(c.createdAt || c.createdAtAt || Date.now());
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
          if (monthMap[key] !== undefined) monthMap[key]++;
        });
        const monthlyCounts = months.map((m) => monthMap[m.key]);

        setStats({
          totalComplaints: complaintsData.length,
          pending: counts.Pending,
          inProgress: counts["In-Progress"],
          resolved: counts.Resolved,
          totalUsers: emails.size,
          monthlyCounts,
          monthLabels: months.map((m) => m.label),
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setError("Failed to load overview");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading overview...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center">
        <div className="text-red-400">
          {error || "No overview data available."}
        </div>
      </div>
    );
  }

  const pieData = {
    labels: ["Pending", "In-Progress", "Resolved"],
    datasets: [
      {
        data: [stats.pending, stats.inProgress, stats.resolved],
        backgroundColor: ["#fbbf24", "#3b82f6", "#10b981"],
        hoverBackgroundColor: ["#f59e0b", "#2563eb", "#059669"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: stats.monthLabels,
    datasets: [
      {
        label: "Complaints",
        data: stats.monthlyCounts,
        backgroundColor: "rgba(99,102,241,0.85)",
      },
    ],
  };

  const lineData = {
    labels: stats.monthLabels,
    datasets: [
      {
        label: "Trend",
        data: stats.monthlyCounts,
        fill: true,
        backgroundColor: "rgba(99,102,241,0.12)",
        borderColor: "#6366f1",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950  flex">
      <aside>
        <Sidebar/>
      </aside>
    <main className="flex-1 p-10"> 
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-7 h-7 text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">Overview</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8"
      >
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" />
              <div>
                <div className="text-sm text-gray-300">Total Users</div>
                <div className="text-2xl font-bold text-white">
                  {stats.totalUsers}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full h-20">
            <Line
              data={lineData}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col"
        >
          <div className="flex items-center gap-3">
            <Hourglass className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-sm text-gray-300">Pending</div>
              <div className="text-2xl font-bold text-white">
                {stats.pending}
              </div>
            </div>
          </div>
          <div className="mt-4 flex-1">
            <Pie
              data={pieData}
              options={{
                plugins: {
                  legend: { position: "bottom", labels: { color: "#cbd5e1" } },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <div>
              <div className="text-sm text-gray-300">Resolved</div>
              <div className="text-2xl font-bold text-white">
                {stats.resolved}
              </div>
            </div>
          </div>
          <div className="mt-4 flex-1">
            <Bar
              data={barData}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  y: { ticks: { color: "#cbd5e1" }, beginAtZero: true },
                  x: { ticks: { color: "#cbd5e1" } },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Detailed table / list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg text-white font-semibold mb-4">
          Recent Complaints
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {complaints.slice(0, 6).map((c) => (
            <div
              key={c._id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-300">{c.title}</div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {c.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(c.createdAt).toLocaleString()} •{" "}
                    <span className="capitalize">{c.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      c.status === "Resolved"
                        ? "bg-green-600 text-white"
                        : c.status === "In-Progress"
                        ? "bg-blue-600 text-white"
                        : "bg-yellow-500 text-gray-900"
                    }`}
                  >
                    {c.status}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {c.createdBy?.name || c.createdBy?.email || "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </motion.div>
        </main> 
    </div>
  );
}
