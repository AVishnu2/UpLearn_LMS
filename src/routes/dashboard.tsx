import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { assignments as staticAssignments, liveClasses as staticLiveClasses, courses as staticCourses } from "@/data/lms";
import { BookOpen, Video, FileText, Bell, TrendingUp, Flame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeTable, type DbAnnouncement, type DbCourse } from "@/hooks/useRealtime";

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

function generateSyllabus(title: string, category: string) {
  const t = title ? title.toLowerCase() : "";
  const cat = category ? category.toLowerCase() : "";
  
  const isAi = t.includes("ai") || t.includes("artificial") || t.includes("intelligence") || t.includes("llm") || t.includes("agent") || t.includes("prompt") || t.includes("gpt") || t.includes("neural") || t.includes("deep learning") || cat.includes("ai");
  const isData = t.includes("data") || t.includes("science") || t.includes("analysis") || t.includes("analytics") || t.includes("ml") || t.includes("machine learning") || t.includes("statistics") || t.includes("python for data") || t.includes("pandas") || cat.includes("data") || cat.includes("ml");
  const isDesign = t.includes("design") || t.includes("ux") || t.includes("ui") || t.includes("figma") || t.includes("wireframe") || t.includes("prototype") || t.includes("user experience") || t.includes("product design") || cat.includes("design") || cat.includes("ux") || cat.includes("ui");
  const isDev = t.includes("dev") || t.includes("web") || t.includes("code") || t.includes("program") || t.includes("full stack") || t.includes("fullstack") || t.includes("frontend") || t.includes("backend") || t.includes("react") || t.includes("next") || t.includes("javascript") || t.includes("typescript") || t.includes("node") || t.includes("express") || t.includes("postgres") || t.includes("sql") || cat.includes("dev") || cat.includes("web") || cat.includes("code");
  const isMarketingOrBiz = t.includes("marketing") || t.includes("seo") || t.includes("growth") || t.includes("business") || t.includes("finance") || t.includes("accounting") || t.includes("startup") || t.includes("pm") || t.includes("product management") || cat.includes("marketing") || cat.includes("business");

  if (isAi) {
    return [
      { title: "Module 1: Introduction to Artificial Intelligence & LLMs", lessons: ["The Evolution of AI & Modern Architectures", "Understanding GPT & Large Language Models", "Prompt Engineering Best Practices", "Tokenization & Core NLP Concepts"] },
      { title: "Module 2: Retrieval Augmented Generation (RAG) Systems", lessons: ["Vector Databases & Embeddings Deep Dive", "Chunking Strategies & Document Loaders", "Building Your First Semantic Search Pipeline", "Evaluating RAG Performance & Retrieval Accuracy"] },
      { title: "Module 3: Autonomous AI Agents & Tool Use", lessons: ["Agentic Architectures: ReAct Framework", "Function Calling & API Integration", "Multi-Agent Systems & Orchestration", "Memory & State Persistence in Agents"] },
      { title: "Module 4: Deployment, Ethics & Advanced AI", lessons: ["Deploying AI Apps to Cloud & Vercel", "Model Evals, Guardrails & Security", "Mitigating Bias & Hallucinations", "Capstone: Building a Fully-Featured AI Native Assistant"] }
    ];
  } else if (isData) {
    return [
      { title: "Module 1: Python Foundations for Data Science", lessons: ["Jupyter Notebooks & Environment Setup", "Advanced Pandas & Data Wrangling", "NumPy & Scientific Computing", "Data Cleaning & Preprocessing Techniques"] },
      { title: "Module 2: Exploratory Data Analysis & Visualization", lessons: ["Statistical Analysis & Hypothesis Testing", "Data Storytelling with Matplotlib & Seaborn", "Feature Engineering & Selection", "Working with Missing Data & Outliers"] },
      { title: "Module 3: Applied Machine Learning Algorithms", lessons: ["Supervised Learning: Regression & Classification", "Unsupervised Learning: Clustering & K-Means", "Decision Trees & Random Forests", "Model Selection & Hyperparameter Tuning"] },
      { title: "Module 4: Big Data & Machine Learning Operations (MLOps)", lessons: ["Introduction to SQL for Data Querying", "Model Deployment with Flask & FastAPI", "Version Control for Data (DVC)", "Capstone: Predict Housing Prices End-to-End"] }
    ];
  } else if (isDesign) {
    return [
      { title: "Module 1: User Research & Problem Discovery", lessons: ["Introduction to User-Centered Design", "Conducting Effective User Interviews", "Creating User Personas & Empathy Maps", "Synthesis: Affinity Mapping & Problem Statements"] },
      { title: "Module 2: Information Architecture & Interaction Design", lessons: ["Sitemaps & User Flow Diagrams", "Heuristic Evaluation of UI/UX", "Wireframing: Low-Fi to Mid-Fi Layouts", "Accessibility (a11y) in Modern Web Interfaces"] },
      { title: "Module 3: High-Fidelity UI Design in Figma", lessons: ["Typography, Grids & Harmonic Color Palettes", "Mastering Figma Components & Auto-layout", "Creating Styles and Design Systems", "Prototyping Transitions & Micro-interactions"] },
      { title: "Module 4: Usability Testing & Developer Handoff", lessons: ["Planning & Running A/B Usability Tests", "Analyzing Feedback & Iterating Designs", "Perfecting Files for Developer Handoff", "Capstone: Designing a Mobile FinTech Dashboard"] }
    ];
  } else if (isDev) {
    return [
      { title: "Module 1: Core Web Architectures & Modern JS/TS", lessons: ["How the Web Works: HTTP, DNS, & Servers", "Modern JavaScript (ES6+) Features", "TypeScript: Types, Interfaces & Compiler Options", "Asynchronous Coding & API Fetching"] },
      { title: "Module 2: Modern Frontend Frameworks (React & Vite)", lessons: ["React Component Lifecycle & Hooks", "State Management: Context & Redux Toolkit", "Routing & Dynamic URL Parameters", "Styling with CSS Variables & Tailwind CSS"] },
      { title: "Module 3: Robust Backend Development & Databases", lessons: ["Building RESTful APIs with Node.js & Express", "Database Design: SQL vs NoSQL", "Postgres, Prisma & Database Migrations", "Authentication: JWT & Row-Level Security (RLS)"] },
      { title: "Module 4: DevOps, Testing & Cloud Deployment", lessons: ["Unit & Integration Testing (Vitest / Jest)", "Containerization with Docker", "Continuous Integration / Continuous Deployment (CI/CD)", "Capstone: Shipping a Fullstack E-Commerce Site"] }
    ];
  } else if (isMarketingOrBiz) {
    return [
      { title: "Module 1: Market Research & Product Strategy", lessons: ["Identifying Market Fit & Competitor Analysis", "Developing a Value Proposition", "Understanding Customer Acquisition Costs (CAC)", "Defining Key Performance Indicators (KPIs)"] },
      { title: "Module 2: Growth Hacking & Acquisition Channels", lessons: ["Search Engine Optimization (SEO) Playbook", "Running Paid Ad Campaigns (Google / Meta)", "Content Marketing & Social Media Brand Building", "Building High-Converting Landing Pages"] },
      { title: "Module 3: Conversion Rate Optimization (CRO) & Retention", lessons: ["A/B Testing Methodologies", "User Onboarding & Activation Loops", "Email Marketing & Lifecycle Automation", "Churn Reduction & Referral Program Design"] },
      { title: "Module 4: Business Operations & Financial Modeling", lessons: ["Building a Startup Financial Model", "Cap Tables & Startup Fundraising Basics", "Unit Economics & Profit Margins", "Capstone: Launching a Digital Product Growth Plan"] }
    ];
  } else {
    return [
      { title: `Module 1: Foundations of ${title}`, lessons: ["Introduction & Historical Overview", "Core Principles & Basic Vocabulary", "Industry Context & Essential Frameworks", "Setting Goals for Your Learning Path"] },
      { title: `Module 2: Deep Dive & Case Studies`, lessons: ["Exploring Advanced Concepts", "Real-World Business Case Studies", "Interactive Labs & Scenario Challenges", "Solving Common Complex Problems"] },
      { title: `Module 3: Practical Tools & Strategies`, lessons: ["Essential Toolkit & Resources", "Step-by-Step Hands-On Practice", "Design Patterns & Tactical Methodologies", "Optimizing Performance & Outcomes"] },
      { title: `Module 4: Professional Certification`, lessons: ["Final Project Definition & Guidelines", "Expert Assessment & Critique Session", "Preparing for Job Interviews & Portfolio Building", "Obtaining Your Official Certificate"] }
    ];
  }
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — UpLearnLMS" },
      { name: "description", content: "Your courses, assignments, live classes and progress." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user } = useAuth();
  const { rows: dbCourses } = useRealtimeTable<DbCourse>("courses");
  const { rows: announcements } = useRealtimeTable<DbAnnouncement>("announcements");
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Learner";

  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [completedData, setCompletedData] = useState<Record<string, string[]>>({});
  const [streakCount, setStreakCount] = useState(1);
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [liveClassesList, setLiveClassesList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const storedEnrolled = localStorage.getItem("uplearn_enrolled_courses");
      let currentEnrolled = [];
      if (!storedEnrolled) {
        currentEnrolled = ["fullstack-mastery", "data-science-bootcamp", "ai-product"];
        localStorage.setItem("uplearn_enrolled_courses", JSON.stringify(currentEnrolled));
      } else {
        currentEnrolled = JSON.parse(storedEnrolled);
      }
      setEnrolledIds(currentEnrolled);

      const storedCompleted = localStorage.getItem("uplearn_completed_lessons");
      if (storedCompleted) {
        setCompletedData(JSON.parse(storedCompleted));
      }

      const storedStreak = localStorage.getItem("uplearn_learning_streak");
      if (!storedStreak) {
        localStorage.setItem("uplearn_learning_streak", "1");
        setStreakCount(1);
      } else {
        setStreakCount(parseInt(storedStreak, 10) || 1);
      }

      // Dynamic assignments from localStorage
      const storedAssignments = localStorage.getItem("uplearn_assignments");
      if (!storedAssignments) {
        localStorage.setItem("uplearn_assignments", JSON.stringify(staticAssignments));
        setAssignmentsList(staticAssignments);
      } else {
        setAssignmentsList(JSON.parse(storedAssignments));
      }

      // Dynamic live classes from localStorage
      const storedLive = localStorage.getItem("uplearn_live_classes");
      if (!storedLive) {
        localStorage.setItem("uplearn_live_classes", JSON.stringify(staticLiveClasses));
        setLiveClassesList(staticLiveClasses);
      } else {
        setLiveClassesList(JSON.parse(storedLive));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Map live Supabase courses to matching static format
  const mappedLiveCourses = dbCourses.map((lc) => ({
    id: lc.id,
    title: lc.title,
    instructor: lc.instructor,
    category: lc.category,
    price: 0,
    rating: 5.0,
    students: 128,
    lessons: 12,
    hours: 8,
    level: (lc.level as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
    cover: lc.cover || "from-fuchsia-500 to-violet-600",
    blurb: lc.blurb || "",
    modules: generateSyllabus(lc.title, lc.category)
  }));

  const allCourses = [...staticCourses, ...mappedLiveCourses];
  const enrolledCourses = allCourses.filter((c) => enrolledIds.includes(c.id));

  // Calculate course processes and completed milestones
  const coursesWithProgress = enrolledCourses.map((c) => {
    const courseLessons = c.modules ? c.modules.flatMap((m) => m.lessons) : [];
    const completedForCourse = completedData[c.id] || [];
    const completedCount = courseLessons.filter((l) => completedForCourse.includes(l)).length;
    const progress = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;
    return {
      ...c,
      progress
    };
  });

  const activeCoursesCount = coursesWithProgress.length;
  const assignmentsDueCount = assignmentsList.filter((a) => a.status === "pending" || a.status === "in-progress").length;
  const liveThisWeekCount = liveClassesList.length;

  const totalProgressSum = coursesWithProgress.reduce((sum, c) => sum + c.progress, 0);
  const avgProgress = activeCoursesCount > 0 ? Math.round(totalProgressSum / activeCoursesCount) : 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{name} 👋</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <Flame className="h-4 w-4 text-orange-400" /> {streakCount}-day learning streak
        </div>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { icon: BookOpen, k: String(activeCoursesCount), v: "Active courses" },
          { icon: FileText, k: String(assignmentsDueCount), v: "Assignments due" },
          { icon: Video, k: String(liveThisWeekCount), v: "Live this week" },
          { icon: TrendingUp, k: `${avgProgress}%`, v: "Avg progress" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border border-border bg-card p-5">
            <s.icon className="h-5 w-5 text-primary" />
            <div className="mt-4 text-2xl font-semibold">{s.k}</div>
            <div className="text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Continue learning</h2>
          {coursesWithProgress.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">No active courses. Find exciting cohort programs in the marketplace!</p>
          )}
          <div className="space-y-3">
            {coursesWithProgress.map((c) => {
              return (
                <Link
                  key={c.id}
                  to="/courses/$courseId"
                  params={{ courseId: c.id }}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition duration-300 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-md group"
                >
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={getCourseImage(c.category, c.title)}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.category}</div>
                    <div className="mt-1 font-semibold">{c.title}</div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: "var(--gradient-primary)" }} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.progress}% complete</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <h2 className="mb-4 mt-10 text-xl font-semibold">Assignments</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Due</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assignmentsList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-4 text-center text-muted-foreground text-xs">No assignments assigned. You are all caught up!</td>
                  </tr>
                )}
                {assignmentsList.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3 font-medium">{a.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.course}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.dueIn}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${
                          a.status === "graded"
                            ? "bg-accent/20 text-accent"
                            : a.status === "in-progress"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {a.status === "graded" ? `Graded · ${a.grade || "A"}` : a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><Video className="h-4 w-4 text-primary" /> Upcoming live classes</div>
            <ul className="mt-4 space-y-4">
              {liveClassesList.length === 0 && (
                <li className="text-xs text-muted-foreground py-2">No live classes scheduled for this week.</li>
              )}
              {liveClassesList.map((l) => (
                <li key={l.id} className="border-l-2 border-primary/60 pl-3">
                  <div className="text-xs text-muted-foreground">{l.at}</div>
                  <div className="mt-0.5 text-sm font-medium">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.instructor}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><Bell className="h-4 w-4 text-primary" /> Announcements <span className="ml-auto inline-flex h-2 w-2 animate-pulse rounded-full bg-accent" /></div>
            {announcements.length === 0 ? (
              <p className="mt-4 text-xs text-muted-foreground">No announcements yet — faculty posts will appear here instantly.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {announcements.slice(0, 6).map((n) => (
                  <li key={n.id}>
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.body}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}