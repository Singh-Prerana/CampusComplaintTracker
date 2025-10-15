import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  NotebookPen,
  ClipboardList,
  Users,
  UserCog,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

// Nav links for each role
const studentLinks = [
  { to: "/student-dashboard", label: "Dashboard", icon: <Home /> },
  { to: "/student-dashboard/submit", label: "Submit", icon: <NotebookPen /> },
  { to: "/student-dashboard/profile", label: "Profile", icon: <User /> },
  {to: "/explore", label: "Explore", icon: <Users /> },
  { to: "/student-dashboard/notification", label: "Notifications", icon: <Bell /> },
];

const adminLinks = [
  { to: "/admin-dashboard", label: "Complaints", icon: <ClipboardList /> },
  { to: "/admin-dashboard/overview", label: "Overview", icon: <Users /> },
  { to: "/admin-dashboard/profile", label: "Profile", icon: <UserCog /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Get role from localStorage or context
  const role = localStorage.getItem("role") || "student";
  const navLinks = role === "admin" ? adminLinks : studentLinks;
  const panelTitle = role === "admin" ? "Admin Panel" : "Student Panel";
  const panelIcon = <Settings className="w-7 h-7 text-indigo-400 animate-spin-slow" />;

  // Logout handler (uncomment if you want backend logout)
  // const handleLogout = async () => {
  //   try {
  //     await API.post("/api/auth/logout");
  //   } catch (err) {}
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("role");
  //   logout();
  //   navigate("/login");
  // };

  // For demo, just clear and redirect
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    logout();
    navigate("/login");
  };

  // Sidebar layout for both desktop and mobile
  const SidebarContent = ({ onNav }) => (
    <motion.aside
      // initial={{ x: -100, opacity: 0 }}
      // animate={{ x: 0, opacity: 1 }}
      // exit={{ x: -100, opacity: 0 }}
      // transition={{ type: "spring", stiffness: 80 }}
      className="w-64 bg-gray-900 text-gray-200 p-6 flex flex-col gap-8 shadow-xl min-h-screen"
    >
      <div className="flex items-center gap-3 mb-8">
        {panelIcon}
        <span className="text-xl font-bold tracking-wide">{panelTitle}</span>
      </div>
      <nav className="flex flex-col gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNav}
            className="flex items-center gap-2 hover:text-indigo-400 transition"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => {
            if (onNav) onNav();
            handleLogout();
          }}
          className="flex items-center gap-2 hover:text-red-400 transition mt-8"
        >
          <LogOut /> Logout
        </button>
      </nav>
    </motion.aside>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-[9999]">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full bg-white border border-indigo-200 shadow-lg text-indigo-700 hover:bg-indigo-100 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 left-0 z-40 w-64 h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 shadow-2xl p-6"
          >
            {/* Cut (close) icon */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-200 hover:bg-indigo-600 transition"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent onNav={() => setOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

