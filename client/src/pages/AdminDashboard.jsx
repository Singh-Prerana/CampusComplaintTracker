import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "@/api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  Hourglass,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import ComplaintCard from "@/components/ComplaintCard";

const statusIcons = {
  Pending: <Hourglass className="text-yellow-500" />,
  "In-Progress": <ClipboardList className="text-blue-500" />,
  Resolved: <CheckCircle2 className="text-green-500" />,
};

function StatusButtons({ current, onChange }) {
  return (
    <div className="flex gap-2">
      {["Pending", "In-Progress", "Resolved"].map((s) =>
        s !== current ? (
          <motion.button
            key={s}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              s === "Resolved"
                ? "bg-green-600 text-white"
                : s === "In-Progress"
                ? "bg-blue-600 text-white"
                : "bg-yellow-500 text-gray-900"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(s);
            }}
          >
            {s}
          </motion.button>
        ) : null
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get("/complaints")
      .then((res) => {
        if (!mounted) return;
        setComplaints(res.data || []);
      })
      .catch(() => {
        if (!mounted) return;
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered =
    filter === "All"
      ? complaints
      : complaints.filter((c) => c.status === filter);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/complaints/${id}/status`, { status });
      setComplaints((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
      // update selected view if open
      if (selected && selected._id === id)
        setSelected((s) => ({ ...s, status }));
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const extractImages = (c) => {
    if (!c) return [];
    if (Array.isArray(c.images) && c.images.length) return c.images;
    if (Array.isArray(c.attachments) && c.attachments.length)
      return c.attachments;
    if (c.image) return [c.image];
    if (c.photo) return [c.photo];
    return [];
  };

  const shareComplaint = async (c) => {
    const link = `${window.location.origin}${window.location.pathname}#complaint-${c._id}`;
    if (navigator && navigator.share) {
      try {
        await navigator.share({
          title: c.title,
          text: c.description || "Complaint",
          url: link,
        });
        return;
      } catch {
        // fall-through to copy fallback
      }
    }
    try {
      await navigator.clipboard.writeText(link);
      // lightweight feedback: update selected to show temporary copied state if desired
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="text-indigo-400" /> Complaints Overview
          </h1>
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "In-Progress", "Resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  filter === s
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Grid */}
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-400 py-20"
            >
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" /> Loading
                complaints...
              </div>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center text-gray-400 py-20"
            >
              No complaints found.
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {filtered.map((c) => (
                <motion.article
                  key={c._id}
                  layout
                  onClick={() => setSelected(c)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                >
                  {/* unified card: complaint content + single footer containing only status buttons */}
                  <div className="rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-800">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          {statusIcons[c.status] || <Hourglass />}
                          <span className="font-semibold text-lg text-white">
                            {c.title}
                          </span>
                        </div>

                        {/* status pill moved into top/details area */}
                        <div>
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
                        </div>
                      </div>

                      <div className="text-gray-400 text-sm mb-3 line-clamp-3">
                        {c.description}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="truncate">
                          {c.createdBy?.name || c.createdBy?.email || "Unknown"}
                        </span>
                        <ArrowRight className="w-4 h-4 mx-1" />
                        <span className="capitalize">{c.category}</span>
                      </div>
                    </div>

                    {/* Footer: only status change buttons for admin */}
                    <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-end">
                      <div onClick={(e) => e.stopPropagation()}>
                        <StatusButtons
                          current={c.status}
                          onChange={(s) => handleStatusChange(c._id, s)}
                        />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail modal / enlarged view */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="detail-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
              >
                {/* backdrop */}
                <motion.div
                  onClick={() => setSelected(null)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-white">
                      {selected.title}
                    </h2>
                    <div className="text-sm text-gray-300">
                      {selected.description}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selected.status === "Resolved"
                            ? "bg-green-600 text-white"
                            : selected.status === "In-Progress"
                            ? "bg-blue-600 text-white"
                            : "bg-yellow-500 text-gray-900"
                        }`}
                      >
                        {selected.status}
                      </div>
                      <div className="text-sm text-gray-400">
                        {selected.createdBy?.name ||
                          selected.createdBy?.email ||
                          "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500 ml-auto">
                        {new Date(selected.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <div className="capitalize">{selected.category}</div>
                      {selected.priority && (
                        <div className="ml-2 px-2 py-1 rounded bg-indigo-700 text-white text-xs">
                          {selected.priority}
                        </div>
                      )}
                    </div>

                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                      <StatusButtons
                        current={selected.status}
                        onChange={(s) => handleStatusChange(selected._id, s)}
                      />
                    </div>

                    <div className="mt-4 text-sm text-gray-300">
                      {/* additional metadata */}
                      {selected.location && (
                        <div>
                          <strong className="text-gray-400">Location: </strong>
                          {selected.location}
                        </div>
                      )}
                      {selected.tags?.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-gray-400">Tags: </strong>
                          {selected.tags.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* image / attachments area */}
                  <div className="flex flex-col gap-4">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-2 flex-1 flex items-center justify-center overflow-hidden">
                      {extractImages(selected).length > 0 ? (
                        <img
                          src={extractImages(selected)[0]}
                          alt={selected.title}
                          className="max-h-80 w-full object-contain rounded-md"
                        />
                      ) : (
                        <div className="text-gray-400">
                          No attachment available
                        </div>
                      )}
                    </div>

                    {extractImages(selected).length > 1 && (
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {extractImages(selected).map((src, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              // swap first image to clicked (simple client-side swap)
                              const imgs = extractImages(selected);
                              imgs.unshift(imgs.splice(i, 1)[0]);
                              setSelected({ ...selected, images: imgs });
                            }}
                            className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border border-gray-700"
                          >
                            <img
                              src={src}
                              alt={`att-${i}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex gap-3 justify-end">
                      <a
                        href={`mailto:${selected.createdBy?.email || ""}`}
                        className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Contact Reporter
                      </a>

                      <button
                        onClick={() => shareComplaint(selected)}
                        className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
                      >
                        Share
                      </button>

                      <button
                        onClick={() => setSelected(null)}
                        className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
