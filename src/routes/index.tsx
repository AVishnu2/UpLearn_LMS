import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CreditCard, MessageSquare, Video, Award, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { courses } from "@/data/lms";

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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UpLearnLMS — The all-in-one learning platform for modern educators" },
      { name: "description", content: "Courses, live classes, assignments, payments and student communities — unified in one beautiful LMS." },
      { property: "og:title", content: "UpLearnLMS — The all-in-one LMS" },
      { property: "og:description", content: "Run your institute, coaching or cohort with one platform." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: BookOpen, title: "Courses & Marketplace", desc: "Publish, sell and manage digital courses with rich content, quizzes and certificates." },
  { icon: Video, title: "Live Classes", desc: "Schedule cohort calls, record sessions and stream straight to the student portal." },
  { icon: CreditCard, title: "Fees & Reminders", desc: "Installments, auto-reminders and reconciliation — built for Indian institutes." },
  { icon: MessageSquare, title: "Community & Chats", desc: "Cohort groups, DMs, announcements and parent updates in one inbox." },
  { icon: Award, title: "Auto Certificates", desc: "Generate PDF certificates the moment a learner crosses the finish line." },
  { icon: Users, title: "Batch Management", desc: "Group students by batch, assign faculty, track attendance and progress." },
];

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            One platform replacing 6 disconnected tools
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Teach, manage and monetize —{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              all in one LMS.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            UpLearnLMS unifies courses, live classes, assignments, fee collection, communities and certifications
            for institutes, coaching centers and cohort programs.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Explore courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-card"
            >
              See student demo
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["12k+", "Active learners"],
              ["320+", "Institutes"],
              ["98%", "Fee collection"],
              ["4.9★", "Avg rating"],
            ].map(([k, v]) => (
              <div key={v} className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur">
                <dt className="text-3xl font-semibold">{k}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Everything you need to run learning</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">From the first signup to the last certificate — stop duct-taping tools.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Featured courses</h2>
          <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => (
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
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.category} · {c.level}</div>
                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.blurb}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">★ {c.rating} · {c.students.toLocaleString()} students</span>
                  <span className="font-semibold">₹{c.price.toLocaleString()}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-end">
                  <span className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition duration-300 group-hover:opacity-90 group-hover:translate-x-0.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
                    Open Course →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border p-10 md:p-16" style={{ backgroundImage: "var(--gradient-hero)" }}>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            Replace 6 tools. Keep one. Grow faster.
          </h2>
          <ul className="mt-6 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            {["Zero-setup payments", "Auto-graded assignments", "Live + recorded classes", "Cohort communities", "Certificates in one click", "Faculty + parent portals"].map((i) => (
              <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> {i}</li>
            ))}
          </ul>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            Open the demo dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        Built with ♥ for the EdTech LMS hackathon — UpLearnLMS
      </footer>
    </main>
  );
}
