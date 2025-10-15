import { useContext, useState, useEffect, useRef } from "react";
import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Hash, Camera, Loader2, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);   // ✅ correct setter
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [status, setStatus] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setRollNo(user?.rollNo || "");
    setAvatarPreview(user?.avatarUrl || ""); // ✅ match backend field
  }, [user]);

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSave = async () => {
    setStatus("loading");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("rollNo", rollNo);
    if (avatar) fd.append("avatar", avatar);           // ✅ key matches upload.single("avatar")
    try {
      const res = await API.put("/auth/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser(res.data);                               // ✅ update context
      setStatus("success");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-10"
    >
      <Card className="max-w-md w-full mx-auto shadow-2xl border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
        <CardContent className="py-8 px-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-full border-4 border-indigo-500 shadow-lg overflow-hidden w-28 h-28 bg-gray-800 flex items-center justify-center"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
                  title="Change avatar"
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
            <span className="mt-3 text-lg font-semibold text-white">
              {name || "Your Name"}
            </span>
            <span className="text-xs text-gray-400">{email}</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-gray-300 flex items-center gap-2 mb-1">
                <User size={16} /> Name
              </label>
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-gray-300 flex items-center gap-2 mb-1">
                <Mail size={16} /> Email
              </label>
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
                value={email}
                type="email"
                disabled      // keep email read-only
              />
            </div>
            <div>
              <label className="text-gray-300 flex items-center gap-2 mb-1">
                <Hash size={16} /> Roll No
              </label>
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:border-indigo-500 transition"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter Roll No"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" /> Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              {status === "success" && (
                <span className="flex items-center gap-1 text-green-400 font-medium">
                  <CheckCircle2 size={18} /> Saved!
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

