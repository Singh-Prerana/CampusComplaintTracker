import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Users, Search } from "lucide-react";
import ComplaintCard from "@/components/ComplaintCard";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function Explore() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const { user: authUser } = useContext(AuthContext) || {};
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const currentUser = authUser ||
    storedUser || { email: localStorage.getItem("email") };

  const isOwnComplaint = (c) => {
    if (!currentUser) return false;
    if (currentUser.email && c.createdBy?.email) {
      return c.createdBy.email === currentUser.email;
    }
    if (currentUser._id && c.createdBy?._id) {
      return String(c.createdBy._id) === String(currentUser._id);
    }
    return false;
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get("/complaints/all")
      .then((res) => {
        if (!mounted) return;
        setComplaints(res.data || []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load complaints.");
        setComplaints([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const filtered = complaints
    .filter((c) => {
      // exclude complaints created by the current user
      if (isOwnComplaint(c)) return false;

      if (filter === "All") return true;
      return c.status === filter;
    })
    .filter((c) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        (c.title || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q) ||
        (c.createdBy?.name || "").toLowerCase().includes(q)
      );
    });

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading complaints…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex">
      <aside>
        <Sidebar />
      </aside>
      <main className="flex-1 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between mb-6">
          <div className="flex items-center gap-3 text-white">
            <Users className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold">Explore Complaints</h2>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, description, category or user"
                className="bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-500 w-72"
              />
            </div>

            {["All", "Pending", "In-Progress", "Resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filter === s
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-800 text-gray-300 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No complaints found.
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((c) => (
                <motion.div
                  key={c._id}
                  layout
                  initial={{ y: 8 }}
                  animate={{ y: 0 }}
                >
                  <ComplaintCard c={c} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
        </div>
        </main>
    </div>
  );
}
