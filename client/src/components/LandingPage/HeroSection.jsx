import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-24 text-center overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <Megaphone className="w-16 h-16 text-indigo-400 mb-4 animate-bounce drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
             Campus <br />
            <span className="text-indigo-400">Complaint Tracker</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Submit, track, and resolve campus complaints efficiently.
            <br />
            Empowering students and faculty with{" "}
            <span className="text-indigo-300 font-semibold">
              transparency
            </span>{" "}
            and{" "}
            <span className="text-blue-400 font-semibold">collaboration</span>.
          </p>
          <Link to="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all duration-200">
              Submit a Complaint
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
