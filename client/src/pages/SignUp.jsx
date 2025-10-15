import { useState, useRef } from "react";
import API from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Hash,
  Badge,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    rollNo: "",
    staffId: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [status, setStatus] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    setForm((f) => ({ ...f, avatar: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("password", form.password);
    fd.append("role", form.role);
    if (form.role === "student") fd.append("rollNo", form.rollNo);
    if (form.role === "staff") fd.append("staffId", form.staffId);
    if (form.avatar) fd.append("avatar", form.avatar);
    try {
      await API.post("/auth/signup", fd);
      setStatus("success");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-4 py-10">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800 space-y-6 relative"
      >
        <div className="flex flex-col items-center mb-4">
          <div className="relative group mb-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-full border-4 border-indigo-500 shadow-lg overflow-hidden w-24 h-24 bg-gray-800 flex items-center justify-center"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
                title="Upload avatar"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </motion.div>
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            Sign Up
          </span>
        </div>
        <div>
          <label className="text-gray-300 flex items-center gap-2 mb-1">
            <User size={16} /> Name
          </label>
          <input
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="text-gray-300 flex items-center gap-2 mb-1">
            <Mail size={16} /> Email
          </label>
          <input
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            required
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="text-gray-300 flex items-center gap-2 mb-1">
            <Lock size={16} /> Password
          </label>
          <input
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="text-gray-300 flex items-center gap-2 mb-1">
            Role
          </label>
          <select
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        {form.role === "student" && (
          <div>
            <label className="text-gray-300 flex items-center gap-2 mb-1">
              <Hash size={16} /> Roll No
            </label>
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
              value={form.rollNo}
              onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
              placeholder="Your Roll Number"
              required
            />
          </div>
        )}
        {form.role === "staff" && (
          <div>
            <label className="text-gray-300 flex items-center gap-2 mb-1">
              <Badge size={16} /> Staff ID
            </label>
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
              value={form.staffId}
              onChange={(e) => setForm({ ...form, staffId: e.target.value })}
              placeholder="Your Staff ID"
              required
            />
          </div>
        )}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-lg shadow-lg mt-2"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" /> Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </motion.button>
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-2 right-4 flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded shadow-lg"
            >
              <CheckCircle2 /> Registered! Redirecting...
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-2 right-4 flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded shadow-lg"
            >
              <AlertCircle /> Error! Try again.
            </motion.div>
          )}
        </AnimatePresence>
        <div className="text-center mt-4">
          <span className="text-gray-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-400 hover:underline font-medium"
            >
              Login
            </a>
          </span>
        </div>
      </motion.form>
    </div>
  );
}
