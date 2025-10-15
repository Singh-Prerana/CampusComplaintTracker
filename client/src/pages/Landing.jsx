import CategoriesSection from "@/components/LandingPage/CategoriesSection";
import FeaturesSection from "@/components/LandingPage/FeaturesSection";
import Footer from "@/components/LandingPage/Footer";
import HeroSection from "@/components/LandingPage/HeroSection";
import Navbar from "@/components/LandingPage/Navbar.jsx";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
