// import { useState } from "react";
// import API from "../api/axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { data } = await API.post("/auth/forgot-password", { email });
//       alert(data.msg);
//     } catch (err) {
//       alert("Failed to send reset link");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-[70vh] items-center justify-center">
//       <Card className="max-w-md w-full">
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
//             <Input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
//             >
//               {loading ? "Sending..." : "Send Reset Link"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "success" | "error" | ""
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setMsg("");
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setStatus("success");
      setMsg(data.msg || "OTP sent to your email.");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1200);
    } catch (err) {
      setStatus("error");
      setMsg("Failed to send OTP. Please try again.");
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
                  Forgot Password
                </h2>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  Enter your registered email to receive an OTP.
                </p>
              </div>
              <div>
                <label className="text-gray-300 flex items-center gap-2 mb-1">
                  <Mail size={16} /> Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    <Loader2 className="animate-spin w-4 h-4" /> Sending...
                  </>
                ) : (
                  "Send OTP"
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
