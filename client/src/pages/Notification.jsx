import { useEffect, useState } from "react";
import API from "@/api/axios";
import { Bell, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");

  // Fetch notifications on mount
  useEffect(() => {
    API.get("/notification")
      .then((res) => setNotifications(res.data))
      .catch(() => setError("Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  // Mark all as read
  const markAllRead = async () => {
    setMarking(true);
    setError("");
    try {
      await API.post("/notification/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      setError("Failed to mark as read");
    }
    setMarking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex">
      <aside>
        <Sidebar />
      </aside>
      <main className="flex-1 p-10">
        <div className="flex items-center gap-3 mb-8">
        <Bell className="w-7 h-7 text-indigo-400 animate-bounce" />
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Notifications
        </h2>
        <button
          onClick={markAllRead}
          disabled={marking || notifications.length === 0}
          className="ml-auto px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50"
        >
          {marking ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Marking...
            </span>
          ) : (
            "Mark all as read"
          )}
        </button>
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
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-2 text-red-400 text-center py-20 justify-center"
          >
            <AlertCircle /> {error}
          </motion.div>
        ) : notifications.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-gray-400 text-center py-20"
          >
            No notifications yet.
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {notifications.map((n) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${
                  n.read
                    ? "bg-gray-800 border-gray-700"
                    : "bg-indigo-900/60 border-indigo-500"
                }`}
              >
                <Bell
                  className={`w-6 h-6 ${
                    n.read ? "text-gray-400" : "text-indigo-400 animate-pulse"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{n.title}</div>
                  <div className="text-gray-300 text-sm">{n.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {n.read && (
                  <CheckCircle2
                    className="w-5 h-5 text-green-400"
                    title="Read"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </main>
      
    </div>
  );
}
