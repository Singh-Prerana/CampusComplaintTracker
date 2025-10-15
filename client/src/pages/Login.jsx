import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Loader2, UserCheck, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // for feedback

  // login submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);
      login(data);
      setStatus("success");
      setTimeout(() => {
        navigate(
          data.role === "student" ? "/student-dashboard" : "/admin-dashboard"
        );
      }, 800);
    } catch (err) {
      setStatus("error");
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
            <form onSubmit={onSubmit} className="space-y-6 relative">
              <div className="flex flex-col items-center mb-2">
                <UserCheck className="w-10 h-10 text-indigo-400 mb-2 animate-bounce" />
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Login
                </h2>
              </div>
              <div>
                <label className="text-gray-300 flex items-center gap-2 mb-1">
                  <Mail size={16} /> Email
                </label>
                <Input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-gray-800 text-white border-gray-700 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-300 flex items-center gap-2 mb-1">
                  <Lock size={16} /> Password
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
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
                    <Loader2 className="animate-spin w-4 h-4" /> Logging in...
                  </>
                ) : (
                  "Login"
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
                    <UserCheck /> Login successful!
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-2 right-4 flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded shadow-lg"
                  >
                    <AlertCircle /> Login failed!
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-sm text-center mt-2">
                <button
                  type="button"
                  className="text-indigo-400 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </p>
              <p className="text-center text-gray-400 text-sm mt-2">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-indigo-400 hover:underline font-medium"
                >
                  Sign Up
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
