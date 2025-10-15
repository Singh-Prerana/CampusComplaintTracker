// Example: src/components/Header.jsx

import { Megaphone } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 shadow-lg py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Megaphone className="w-8 h-8 text-white animate-bounce" />
        <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Campus Complaint Tracker
        </span>
      </div>
      {/* You can add user info, nav, or actions here */}
    </header>
  );
}
