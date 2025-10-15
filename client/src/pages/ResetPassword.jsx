// ResetPassword.jsx (updated)
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email || ""; // ✅ email from VerifyOtp
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "success" | "error" | ""
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setMsg("");
    try {
      const { data } = await API.post("/auth/reset-password", {
        email,
        password,
      });
      setStatus("success");
      setMsg(data.msg || "Password reset successful!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setStatus("error");
      setMsg(err.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-gray-900">
          <CardContent className="py-8 px-6">
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="flex flex-col items-center mb-2">
                <KeyRound className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Reset Password
                </h2>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  Enter your new password for{" "}
                  <span className="text-indigo-300">{email}</span>
                </p>
              </div>
              <div>
                <label className="text-gray-300 flex items-center gap-2 mb-1">
                  <Lock size={16} /> New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-gray-800 text-white border-gray-700 focus:border-indigo-500 transition"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-lg shadow-lg mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" /> Resetting...
                  </>
                ) : (
                  "Reset Password"
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
                    <CheckCircle2 /> {msg}
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-2 right-4 flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded shadow-lg"
                  >
                    <AlertCircle /> {msg}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="text-center mt-4">
                <span className="text-gray-400 text-sm">
                  Remembered your password?{" "}
                  <a
                    href="/login"
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    Login
                  </a>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
