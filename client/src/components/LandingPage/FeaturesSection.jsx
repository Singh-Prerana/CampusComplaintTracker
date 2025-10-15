import { CheckCircle } from "lucide-react";

const features = [
  "Raise complaints with just a few clicks",
  "Attach photos or documents for clarity",
  "Stay updated with live status tracking",
  "Check all  complaints in one place",
  "Get notified on status changes",
  "Easy access for both students and admins",
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
          Why Use Our Platform
        </h2>
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 text-left bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-xl p-5 shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-transform"
            >
              <CheckCircle className="h-7 w-7 text-indigo-500 flex-shrink-0 animate-pulse" />
              <p className="text-lg  text-indigo-700 mb-2">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
