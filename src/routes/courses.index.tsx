import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { courses } from "@/data/lms";
import { Search } from "lucide-react";

import { useRealtimeTable, type DbCourse } from "@/hooks/useRealtime";

import aiCover from "@/assets/images/ai_cover.png";
import devCover from "@/assets/images/dev_cover.png";
import dataCover from "@/assets/images/data_cover.png";
import designCover from "@/assets/images/design_cover.png";
import marketingCover from "@/assets/images/marketing_cover.png";
import financeCover from "@/assets/images/finance_cover.png";

function getCourseImage(category: string, title: string) {
  const cat = category ? category.toLowerCase() : "";
  const t = title ? title.toLowerCase() : "";
  
  if (t.includes("ai") || t.includes("artificial") || t.includes("intelligence") || t.includes("llm") || cat.includes("ai")) {
    return aiCover;
  }
  if (t.includes("data") || t.includes("science") || t.includes("analysis") || t.includes("analytics") || t.includes("ml") || t.includes("machine learning") || cat.includes("data") || cat.includes("ml")) {
    return dataCover;
  }
  if (t.includes("design") || t.includes("ux") || t.includes("ui") || t.includes("figma") || cat.includes("design") || cat.includes("ux") || cat.includes("ui")) {
    return designCover;
  }
  if (t.includes("marketing") || t.includes("seo") || t.includes("growth") || cat.includes("marketing")) {
    return marketingCover;
  }
  if (t.includes("business") || t.includes("finance") || t.includes("accounting") || t.includes("startup") || cat.includes("business")) {
    return financeCover;
  }
  return devCover; // Fallback to development
}

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — UpLearnLMS" },
      { name: "description", content: "Browse the UpLearnLMS course marketplace — development, design, AI, business and more." },
    ],
  }),
  component: CoursesPage,
});

const categories = ["All", "Development", "Data", "Design", "AI", "Marketing", "Business"];

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const { rows: liveCourses } = useRealtimeTable<DbCourse>("courses");

  const mappedLiveCourses = liveCourses.map((lc) => ({
    id: lc.id,
    title: lc.title,
    instructor: lc.instructor,
    category: lc.category,
    price: 0,
    rating: 5.0,
    students: 0,
    lessons: 12,
    hours: 8,
    level: (lc.level as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
    cover: lc.cover || "from-fuchsia-500 to-violet-600",
    blurb: lc.blurb || "",
    modules: [{ title: "Introduction", lessons: ["Welcome to the course"] }]
  }));

  const allCourses = [...courses, ...mappedLiveCourses];

  const filtered = allCourses.filter(
    (c) =>
      (cat === "All" || c.category === cat) &&
      (q === "" || c.title.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Course marketplace</h1>
        <p className="mt-2 text-muted-foreground">Cohort programs, self-paced courses and certifications.</p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…"
            className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition cursor-pointer ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            to="/courses/$courseId"
            params={{ courseId: c.id }}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 overflow-hidden">
                <img
                  src={getCourseImage(c.category, c.title)}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-5 pb-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {c.category} · {c.level}
                </div>
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">by {c.instructor}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{c.blurb}</p>
              </div>
            </div>
            
            <div className="p-5 pt-0">
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">★ {c.rating} · {c.lessons} lessons</span>
                <span className="font-semibold text-accent">{c.price === 0 ? "Free" : `₹${c.price.toLocaleString()}`}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-end">
                <span className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition duration-300 group-hover:opacity-90 group-hover:translate-x-0.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
                  Open Course →
                </span>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-16 text-center text-muted-foreground">No courses match your filters.</p>
        )}
      </div>
    </main>
  );
}
