import {
  Home,
  Utensils,
  Wifi,
  BookOpen,
  Presentation,
  Wrench,
} from "lucide-react";

const categories = [
  {
    title: "Hostel",
    description:
      "Report issues related to hostel rooms, maintenance, or facilities.",
    icon: <Home className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: "Mess",
    description:
      "Share feedback or complaints about mess food, hygiene, or services.",
    icon: <Utensils className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: "Wifi",
    description:
      "Facing connectivity issues? Raise your wifi or internet complaints here.",
    icon: <Wifi className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: "Library",
    description:
      "Report problems with library resources, environment, or staff.",
    icon: <BookOpen className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: "Classroom",
    description: "Raise concerns about classroom infrastructure or equipment.",
    icon: <Presentation className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: "Maintenance",
    description:
      "General campus maintenance issues like water, electricity, or cleaning.",
    icon: <Wrench className="w-8 h-8 text-indigo-500" />,
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">
          Complaint Categories
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {categories.map((cat, idx) => (
            <div
              key={cat.title}
              className="bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-xl p-8 flex flex-col items-center shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-transform border border-indigo-100/60"
            >
              <div className="mb-4">{cat.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {cat.title}
              </h3>
              <p className="text-gray-700">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
