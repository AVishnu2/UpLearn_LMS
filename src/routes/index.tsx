import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ArrowRight, BookOpen, CreditCard, MessageSquare, Video, Award, Users, Sparkles, CheckCircle2,
  Cpu, CheckSquare, Compass, Sliders, Zap, UserCheck, Trophy, Smartphone, Mail
} from "lucide-react";
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
      { name: "description", content: "Courses, live classes, assignments, free access and student communities — unified in one beautiful LMS." },
      { property: "og:title", content: "UpLearnLMS — The all-in-one LMS" },
      { property: "og:description", content: "Run your institute, coaching or cohort with one platform." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Cpu, title: "AI Study Assistant", desc: "Get 24/7 instant learning help, prompt exercises, and code sandbox evaluations from our context-aware AI Copilot." },
  { icon: CheckSquare, title: "AI-Powered Assignment Evaluation", desc: "Instantly auto-grade coding assignments, essays, and quizzes with detailed, qualitative feedback breakdowns." },
  { icon: Compass, title: "Personalized Learning Recommendations", desc: "Our RAG systems scan conceptual weaknesses and dynamically inject matching vector-indexed study resources." },
  { icon: Sliders, title: "Student Performance Prediction", desc: "Leverage predictive Bayesian analytics to audit batch performance, forecast scores, and signal dropout-risk thresholds." },
  { icon: Zap, title: "AI Course Content Generator", desc: "Allows faculty to immediately prompt and export entire modular course syllabi, exercises, and quizzes." },
  { icon: UserCheck, title: "Smart Attendance Monitoring", desc: "Automate direct student session tracking, active study hours analytics, and live cohort room participation logs." },
  { icon: Trophy, title: "Gamification & Leaderboards", desc: "Maintain learning streaks, compile course XP, and display live peer leaderboards to drive continuous engagement." },
  { icon: Smartphone, title: "Mobile-First Learning Experience", desc: "Fully responsive, premium fluid layout engineered to run beautifully on all modern smartphones and tablets." },
  { icon: Mail, title: "WhatsApp & Email Automation", desc: "Keep cohort nodes and parent circles synced with automated progress notifications and custom SMS milestones." },
];

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-95"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        />
        {/* Ambient mesh blur decorations */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[140px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="pointer-events-none absolute top-20 -right-20 h-[500px] w-[500px] rounded-full bg-accent/8 blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            One platform replacing 6 disconnected tools
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Teach, manage and learn —{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              all in one free LMS.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            UpLearnLMS unifies courses, live classes, assignments, free learning resources, communities and certifications
            — removing financial barriers for learners everywhere.
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
              ["100%", "Free Access"],
              ["4.9★", "Avg rating"],
            ].map(([k, v]) => (
              <div key={v} className="rounded-3xl border border-border/40 glass-card glow-hover p-6">
                <dt className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{k}</dt>
                <dd className="mt-1.5 text-xs font-medium text-muted-foreground tracking-wider uppercase">{v}</dd>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-3xl border border-border/40 glass-card glow-hover p-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition duration-300">
                <f.icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              to="/courses/$courseId"
              params={{ courseId: c.id }}
              className="group overflow-hidden rounded-3xl border border-border/40 glass-card glow-hover flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden rounded-t-3xl">
                  <img
                    src={getCourseImage(c.category, c.title)}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
                <div className="p-6 pb-0">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-primary">{c.category} · {c.level}</div>
                  <h3 className="mt-2.5 line-clamp-2 text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">★ {c.rating} · {c.students.toLocaleString()} students</span>
                  <span className="font-extrabold text-accent text-base">Free</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition duration-300 group-hover:opacity-90 group-hover:translate-x-0.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
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
            {["100% Free Access", "Auto-graded assignments", "Live + recorded classes", "Cohort communities", "Certificates in one click", "Faculty + parent portals"].map((i) => (
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
