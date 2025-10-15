import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Home,
  Utensils,
  Wifi,
  BookOpen,
  Presentation,
  Paperclip,
  Users,
  ArrowRight,
  Hourglass,
  ClipboardList,
  CheckCircle2,
  X,
} from "lucide-react";

const statusIcons = {
  Pending: <Hourglass className="text-yellow-500" />,
  "In-Progress": <ClipboardList className="text-blue-500" />,
  Resolved: <CheckCircle2 className="text-green-500" />,
};

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  "In-Progress": "bg-blue-500/20 text-blue-400",
  Resolved: "bg-green-500/20 text-green-400",
};

const categoryIcons = {
  Hostel: <Home size={18} className="text-indigo-400" />,
  Mess: <Utensils size={18} className="text-indigo-400" />,
  Wifi: <Wifi size={18} className="text-indigo-400" />,
  Library: <BookOpen size={18} className="text-indigo-400" />,
  Classroom: <Presentation size={18} className="text-indigo-400" />,
};

const isImage = (file) =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(String(file).split("?")[0]);

export default function ComplaintCard({ c }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const images = (c.attachments || []).filter((a) => isImage(a));
  const otherFiles = (c.attachments || []).filter((a) => !isImage(a));

  const copyLink = async (e) => {
    e?.preventDefault();
    const link = `${window.location.origin}${window.location.pathname}#complaint-${c._id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
      ta.remove();
    }
  };

  // use native share when available, otherwise fall back to copyLink
  const shareComplaint = async (e) => {
    e?.preventDefault();
    const link = `${window.location.origin}${window.location.pathname}#complaint-${c._id}`;
    if (navigator && navigator.share) {
      try {
        await navigator.share({
          title: c.title,
          text: c.description || "Complaint",
          url: link,
        });
      } catch {
        // user cancelled or error -> fallback to copy
        await copyLink();
      }
    } else {
      await copyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 32px rgba(99,102,241,0.08)",
      }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-3 border border-gray-700 hover:scale-[1.03] hover:shadow-2xl transition-transform"
    >
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="cursor-pointer"
            role="button"
            aria-label={`Open details for ${c.title}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {statusIcons[c.status] || <Hourglass />}
              <span className="font-semibold text-lg text-white">
                {c.title}
              </span>
            </div>

            <div className="text-gray-400 text-sm mb-2 line-clamp-2">
              {c.description}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              {categoryIcons[c.category] || null}
              <span className="capitalize">{c.category}</span>
              <ArrowRight className="w-4 h-4 mx-1" />
              <Users className="w-4 h-4" />
              <span className="truncate max-w-[8rem]">
                {c.createdBy?.name || "You"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs mt-2">
              <span
                title={`Status: ${c.status}`}
                className={`px-2 py-1 rounded-full font-semibold ${
                  statusColors[c.status] || "bg-gray-600 text-white"
                }`}
              >
                {c.status}
              </span>

              {c.attachments?.length > 0 && (
                <span className="flex items-center gap-1 text-indigo-400 ml-2">
                  <Paperclip size={14} /> {c.attachments.length}
                </span>
              )}
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl p-0">
          {/* animate and style modal content for enlarged / focused view */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
          >
            {/* Close button (top-right) */}
            <DialogClose asChild>
              <button
                aria-label="Close details"
                className="absolute right-4 top-4 z-20 rounded-full p-2 bg-gray-800/70 text-gray-200 hover:bg-gray-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogClose>

            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {statusIcons[c.status] || <Hourglass />}
                  <span className="truncate">{c.title}</span>
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {c.description}
                </DialogDescription>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                role="region"
                aria-label={`Details for ${c.title}`}
              >
                {/* Left: image / attachments */}
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-2 flex items-center justify-center overflow-hidden h-64">
                    {images.length > 0 ? (
                      <img
                        src={images[activeIdx]}
                        alt={`${c.title} image ${activeIdx + 1}`}
                        className="max-h-full w-full object-contain rounded-md"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-gray-400">
                        No attachment available
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIdx(i)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border ${
                            i === activeIdx
                              ? "border-indigo-400"
                              : "border-gray-700"
                          }`}
                          aria-label={`Show image ${i + 1}`}
                        >
                          <img
                            src={src}
                            alt={`thumb-${i}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {otherFiles.length > 0 && (
                    <div className="mt-1">
                      <h4 className="font-medium mb-2 flex items-center gap-1 text-sm text-slate-300">
                        <Paperclip size={16} /> Other Files
                      </h4>
                      <div className="flex flex-col gap-2">
                        {otherFiles.map((file, i) => (
                          <a
                            key={i}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-300 text-sm underline truncate"
                          >
                            {`File ${i + 1}`}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: metadata */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[c.status] || "bg-gray-600 text-white"
                      }`}
                    >
                      {c.status}
                    </div>
                    <div className="text-sm text-gray-300">
                      {c.createdBy?.name || c.createdBy?.email || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500 ml-auto">
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-sm text-gray-300">
                    <strong className="text-gray-400">Category:</strong>{" "}
                    <span className="capitalize">{c.category}</span>
                  </div>

                  {c.location && (
                    <div className="text-sm text-gray-300">
                      <strong className="text-gray-400">Location:</strong>{" "}
                      {c.location}
                    </div>
                  )}

                  {c.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex gap-3">
                    <a
                      href={`mailto:${c.createdBy?.email || ""}`}
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                    >
                      Contact Reporter
                    </a>

                    {/* Copy link button: copies full URL with fragment to clipboard and shows temporary feedback */}
                    <button
                      onClick={shareComplaint}
                      className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 text-sm hover:bg-gray-600 flex items-center gap-2"
                      aria-label="Share complaint"
                    >
                      {copied
                        ? "Copied!"
                        : navigator && navigator.share
                        ? "Share"
                        : "Copy Link"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
