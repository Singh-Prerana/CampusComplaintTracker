import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
} from "lucide-react";

export default function VerifyOtp() {
  const { state } = useLocation();
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds left before resend allowed
  const [status, setStatus] = useState(""); // "success" | "error" | ""
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Countdown for cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setMsg("");
    try {
      const { data } = await API.post("/auth/verify-otp", { email, otp });
      setStatus("success");
      setMsg("OTP verified. Proceeding...");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);
    } catch (err) {
      setStatus("error");
      setMsg(err.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setStatus("");
    setMsg("");
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setStatus("success");
      setMsg(data.msg || "A new OTP has been sent to your email.");
      setCooldown(30); // 30-second cooldown before allowing next resend
    } catch (err) {
      setStatus("error");
      setMsg(err.response?.data?.msg || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
            <form onSubmit={handleVerify} className="space-y-6 relative">
              <div className="flex flex-col items-center mb-2">
                <KeyRound className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Verify OTP
                </h2>
                <p className="text-center text-sm text-gray-400 mb-2">
                  <Mail className="inline w-4 h-4 mr-1 mb-1" />
                  An OTP has been sent to{" "}
                  <span className="font-medium text-indigo-300">{email}</span>
                </p>
              </div>
              <div>
                <label className="text-gray-300 flex items-center gap-2 mb-1">
                  <KeyRound size={16} /> Enter OTP
                </label>
                <Input
                  type="text"
                  placeholder="Enter the 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="bg-gray-800 text-white border-gray-700 focus:border-indigo-500 transition tracking-widest text-lg text-center"
                  autoFocus
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
                    <Loader2 className="animate-spin w-4 h-4" /> Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </motion.button>
              <Button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
                variant="outline"
                className="w-full mt-2"
              >
                {resendLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Sending...
                  </span>
                ) : cooldown > 0 ? (
                  `Resend OTP (${cooldown}s)`
                ) : (
                  "Resend OTP"
                )}
              </Button>
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
                  Didn't receive the OTP? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading || cooldown > 0}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    resend
                  </button>
                  .
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
