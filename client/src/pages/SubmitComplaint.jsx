import ComplaintForm from "@/components/ComplaintForm";
import { motion } from "framer-motion";
import { NotebookPen } from "lucide-react";

export default function SubmitComplaint() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex flex-col items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-full max-w-3xl"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <NotebookPen className="text-indigo-400 w-7 h-7 animate-pulse" />
          <h2 className="text-3xl font-bold text-white tracking-tight items-center ">
            Submit a Complaint
          </h2>
        </div>
        <ComplaintForm />
      </motion.div>
    </div>
  );
}
