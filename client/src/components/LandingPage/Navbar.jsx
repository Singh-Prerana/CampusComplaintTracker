import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 shadow-lg fixed top-0 left-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Title */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-300 hover:text-indigo-400 transition"
        >
          <Megaphone className="w-7 h-7 text-indigo-400" />
          Campus Complaint Tracker
        </Link>

        {/* Login & Signup (works on all screen sizes) */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="outline"
              className="border-indigo-400 bg-indigo-600 text-white hover:bg-indigo-900/30 hover:text-white transition"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
