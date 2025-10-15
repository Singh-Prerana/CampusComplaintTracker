import { useEffect, useState } from "react";
import API from "@/api/axios";
import ComplaintCard from "@/components/ComplaintCard";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  NotebookPen,
  Loader2,
  Home,
  User,
  Bell,
  LogOut,
  Settings,
  ClipboardList,
  Notebook,
} from "lucide-react";

export default function StudentDashboard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/complaints?mine=true")
      .then((res) => setList(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex">
      <aside>
        <Sidebar />
      </aside>
      {/* Sidebar */}
      {/* <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-64 bg-gray-900 text-gray-200 p-6 flex flex-col gap-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-7 h-7 text-indigo-400 animate-spin-slow" />
          <span className="text-xl font-bold tracking-wide">Student Panel</span>
        </div>
        <nav className="flex flex-col gap-4">
          <a
            href="/student-dashboard"
            className="flex items-center gap-2 hover:text-indigo-400 transition"
          >
            <Home /> Dashboard
          </a>
          <a
            href="/student-dashboard/submit"
            className="flex items-center gap-2 hover:text-indigo-400 transition"
          >
            <NotebookPen /> Submit
          </a>
          <a
            href="/student-dashboard/profile"
            className="flex items-center gap-2 hover:text-indigo-400 transition"
          >
            <User /> Profile
          </a>
          <a
            href="/student-dashboard/notifications"
            className="flex items-center gap-2 hover:text-indigo-400 transition"
          >
            <Bell /> Notifications
          </a>
          <button className="flex items-center gap-2 hover:text-red-400 transition mt-8">
            <LogOut /> Logout
          </button>
        </nav>
      </motion.aside> */}

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Notebook className="text-indigo-400" /> My Complaints
          </h1>
        </div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-gray-400 text-lg py-20 justify-center"
            >
              <Loader2 className="animate-spin" /> Loading...
            </motion.div>
          ) : list.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-gray-400 text-center py-20"
            >
              You have not submitted any complaints yet.
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {list.map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #6366f1" }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <ComplaintCard c={c} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
