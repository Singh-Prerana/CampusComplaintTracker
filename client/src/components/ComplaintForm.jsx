import React, { useState } from "react";
import API from "../api/axios.js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Home,
  Utensils,
  Wifi,
  BookOpen,
  Presentation,
  FileUp,
  Send,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComplaintForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Hostel",
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(""); // for feedback

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("category", form.category);
    for (let i = 0; i < files.length; i++) fd.append("attachments", files[i]);
    try {
      await API.post("/complaints", fd);
      setStatus("success");
      setForm({ title: "", description: "", category: "Hostel" });
      setFiles([]);
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setStatus("error");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 12 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-8 rounded-2xl shadow-2xl max-w-lg mx-auto space-y-6 border border-gray-800 relative"
    >
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-indigo-400" />
        <h2 className="text-xl font-bold text-white tracking-tight">
          Submit a Complaint
        </h2>
      </div>

      <div>
        <Label className="text-gray-300 flex items-center gap-2 mb-2">
          <FileText size={18} /> Title
        </Label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          placeholder="Enter complaint title"
          className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-indigo-500 transition"
        />
      </div>

      <div>
        <Label className="text-gray-300 flex items-center gap-2 mb-2">
          <Home size={18} /> Category
        </Label>
        <Select
          value={form.category}
          onValueChange={(v) => setForm({ ...form, category: v })}
        >
          <SelectTrigger className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-indigo-500 transition">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hostel" className="flex items-center gap-2">
              <Home size={16} /> Hostel
            </SelectItem>
            <SelectItem value="Mess" className="flex items-center gap-2">
              <Utensils size={16} /> Mess
            </SelectItem>
            <SelectItem value="Wifi" className="flex items-center gap-2">
              <Wifi size={16} /> Wifi
            </SelectItem>
            <SelectItem value="Library" className="flex items-center gap-2">
              <BookOpen size={16} /> Library
            </SelectItem>
            <SelectItem value="Classroom" className="flex items-center gap-2">
              <Presentation size={16} /> Classroom
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-gray-300 flex items-center gap-2 mb-2">
          <AlertCircle size={18} /> Description
        </Label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          placeholder="Describe your issue"
          className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-indigo-500 transition"
        />
      </div>

      <div>
        <Label className="text-gray-300 flex items-center gap-2 mb-2">
          <FileUp size={18} /> Attachments
        </Label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="block mt-2 text-gray-200 file:bg-indigo-600 file:text-white file:rounded file:px-3 file:py-1 file:border-0 file:mr-3"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {files &&
            Array.from(files).map((file, idx) => (
              <span
                key={idx}
                className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs"
              >
                {file.name}
              </span>
            ))}
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="pt-2"
      >
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-lg shadow-lg"
          disabled={status === "loading"}
        >
          <Send
            className={status === "loading" ? "animate-spin" : ""}
            size={18}
          />
          {status === "loading" ? "Submitting..." : "Submit"}
        </Button>
      </motion.div>

      {/* Animated feedback */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-2 right-4 flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded shadow-lg"
          >
            <CheckCircle2 /> Submitted!
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-2 right-4 flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded shadow-lg"
          >
            <AlertCircle /> Error submitting!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
