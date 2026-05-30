import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { assignments as staticAssignments, liveClasses as staticLiveClasses, courses as staticCourses } from "@/data/lms";
import { 
  BookOpen, Video, FileText, Bell, TrendingUp, Flame, 
  ChevronRight, Calendar, User, Clock, Sparkles, Award,
  MessageSquare, X, Send, Bot, Cpu, Trash2
} from "lucide-react";
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

  // AI Student Assistant Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; timestamp: Date }>>([
    { 
      sender: "bot", 
      text: `Hello ${name}! I am your UpLearn Student Copilot. 🤖\n\nI can help you check active courses, search your assignments queue, or find upcoming live cohort calls!`,
      timestamp: new Date()
    }
  ]);

  const handleQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: queryText,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const normalizedQuery = queryText.toLowerCase().trim();
      let responseText = "";

      if (
        normalizedQuery.includes("thank") ||
        normalizedQuery.includes("thx") ||
        normalizedQuery.includes("thanks") ||
        normalizedQuery.includes("appreciate")
      ) {
        responseText = `You are very welcome! 😊 It is my absolute pleasure to support your learning journey. Keep up the fantastic work on your ${streakCount}-day learning streak!`;
      } else if (
        normalizedQuery.includes("course") ||
        normalizedQuery.includes("study") ||
        normalizedQuery.includes("learn")
      ) {
        responseText = `📚 **Your Active Cohorts:**\n\nYou are enrolled in **${coursesWithProgress.length}** active program(s):\n${
          coursesWithProgress.map((c, idx) => `  ${idx + 1}. **${c.title}** (${c.progress}% complete)`).join("\n")
        }\n\nResume any course dynamically from your main dashboard cards!`;
      } else if (
        normalizedQuery.includes("assign") ||
        normalizedQuery.includes("homework") ||
        normalizedQuery.includes("task") ||
        normalizedQuery.includes("due")
      ) {
        responseText = `📝 **Your Assignments Status:**\n\nYou have **${assignmentsDueCount}** active assignment(s) due:\n${
          assignmentsList.map((a, idx) => `  - **${a.title}** (${a.course}) · Status: *${a.status}*`).join("\n")
        }`;
      } else if (
        normalizedQuery.includes("class") ||
        normalizedQuery.includes("live") ||
        normalizedQuery.includes("stream") ||
        normalizedQuery.includes("call")
      ) {
        responseText = `📅 **Upcoming Live Cohort Calls:**\n\nWe have **${liveClassesList.length}** live session(s) scheduled for this week:\n${
          liveClassesList.map((l) => `  - **${l.title}**\n    *Instructor:* ${l.instructor}\n    *Time:* ${l.at}`).join("\n")
        }`;
      } else if (
        normalizedQuery.includes("streak") ||
        normalizedQuery.includes("fire") ||
        normalizedQuery.includes("learning streak")
      ) {
        responseText = `🔥 **Your Learning Streak:**\n\nBrilliant work! You are currently on an active **${streakCount}-day learning streak**.\n\nKeep study session habits locked in by opening a course lesson daily!`;
      } else if (
        normalizedQuery.includes("hi") ||
        normalizedQuery.includes("hello") ||
        normalizedQuery.includes("hey") ||
        normalizedQuery.includes("help")
      ) {
        responseText = `Hello! I'm your student AI assistant. 🤖\n\nI can help you review:\n- **Active Courses** (Type: *courses*)\n- **Assignments Queue** (Type: *assignments*)\n- **Live Classes** (Type: *live classes*)\n\nFeel free to write a question or try the quick action pills below!`;
      } else {
        responseText = `I couldn't find a direct correlation for that query. 😅\n\nFeel free to ask about your **courses**, **assignments**, or **live classes** scheduled this week!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot" as const,
          text: responseText,
          timestamp: new Date()
        }
      ]);
    }, 400);
  };

  const studentPills = [
    { label: "📚 My Courses", query: "my active enrolled courses list" },
    { label: "📝 Assignments", query: "assignments status due" },
    { label: "📅 Live Calls", query: "live cohort classes schedule" },
    { label: "🔥 My Streak", query: "learning streak count details" }
  ];

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
    <main className="mx-auto max-w-7xl px-6 py-12">
      
      {/* Dynamic welcome header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-primary/10">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400 leading-none">Welcome back,</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1.5">{name} 👋</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-2.5 text-xs font-bold text-orange-600 shadow-sm animate-float">
          <Flame className="h-4.5 w-4.5 text-orange-500 fill-orange-500 animate-pulse" /> {streakCount}-day learning streak
        </div>
      </header>

      {/* KPI Cards Row */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            icon: BookOpen, 
            k: String(activeCoursesCount), 
            v: "Active courses",
            detail: "Enrolled cohorts",
            iconBg: "bg-blue-50 text-blue-600 border border-blue-100"
          },
          { 
            icon: FileText, 
            k: String(assignmentsDueCount), 
            v: "Assignments due",
            detail: "Requires review",
            iconBg: "bg-amber-50 text-amber-600 border border-amber-100"
          },
          { 
            icon: Video, 
            k: String(liveThisWeekCount), 
            v: "Live this week",
            detail: "Interactive streams",
            iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100"
          },
          { 
            icon: TrendingUp, 
            k: `${avgProgress}%`, 
            v: "Avg progress",
            detail: "Cohort standing",
            iconBg: "bg-purple-50 text-purple-600 border border-purple-100"
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div 
              key={s.v} 
              className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.v}</span>
                <span className={`p-2.5 rounded-2xl text-xs shrink-0 ${s.iconBg}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900 leading-none font-mono">{s.k}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold">{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid area */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        
        {/* Left Column (Courses and Assignments) */}
        <section className="lg:col-span-2 space-y-8">
          
          {/* Courses Row */}
          <div>
            <h2 className="mb-4 text-lg font-black text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Continue learning
            </h2>
            
            {coursesWithProgress.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-400 text-center font-medium">No active courses. Find exciting cohort programs in the marketplace!</p>
            ) : (
              <div className="space-y-4">
                {coursesWithProgress.map((c) => {
                  return (
                    <Link
                      key={c.id}
                      to="/courses/$courseId"
                      params={{ courseId: c.id }}
                      className="flex gap-4 rounded-3xl border border-slate-200/60 bg-white p-5 transition duration-300 hover:border-slate-300 hover:shadow-md group relative"
                    >
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl shadow-sm bg-slate-100 border border-slate-100">
                        <img
                          src={getCourseImage(c.category, c.title)}
                          alt={c.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="text-[9px] uppercase font-bold tracking-wider text-primary">{c.category}</div>
                          <div className="mt-1 font-black text-sm text-slate-900 truncate leading-snug">{c.title}</div>
                        </div>
                        <div>
                          <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-50">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${c.progress}%` }} />
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                            <span>{c.progress}% complete</span>
                            <span className="text-primary font-black uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                              Resume Course <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assignments table widget */}
          <div>
            <h2 className="mb-4 text-lg font-black text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Assignments Hub
            </h2>
            <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5">Course Cohort</th>
                    <th className="px-5 py-3.5">Due date</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {assignmentsList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-center text-slate-400 text-[11px]">No assignments assigned. You are all caught up!</td>
                    </tr>
                  )}
                  {assignmentsList.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/20 transition duration-150">
                      <td className="px-5 py-3.5 font-bold text-slate-800">{a.title}</td>
                      <td className="px-5 py-3.5 text-slate-500">{a.course}</td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono">{a.dueIn}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            a.status === "graded"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : a.status === "in-progress"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-slate-100 text-slate-500 border-slate-200/50"
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
          </div>
        </section>

        {/* Right column (live calls and bulletins sidebar) */}
        <aside className="space-y-6">
          
          {/* Live Classes Card */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
                <Video className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-xs font-bold text-slate-800">Upcoming Live Cohort Calls</h3>
            </div>
            <ul className="space-y-3.5">
              {liveClassesList.length === 0 && (
                <li className="text-xs text-slate-400 py-3 text-center font-medium">No live classes scheduled for this week.</li>
              )}
              {liveClassesList.map((l) => (
                <li key={l.id} className="border-l-3 border-primary/50 pl-3.5 py-0.5 flex flex-col justify-center">
                  <div className="text-[10px] text-slate-400 font-mono font-bold">{l.at}</div>
                  <div className="mt-0.5 text-xs font-extrabold text-slate-800 truncate">{l.title}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{l.instructor}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Bulletin announcements */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-accent/10 text-accent">
                  <Bell className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-xs font-bold text-slate-800">Faculty Bulletins</h3>
              </div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </div>
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center font-medium">No bulletins posted this week.</p>
            ) : (
              <ul className="space-y-3.5">
                {announcements.slice(0, 4).map((n) => (
                  <li key={n.id} className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl">
                    <div className="text-xs font-bold text-slate-800 leading-tight">{n.title}</div>
                    <div className="mt-1 text-[10px] text-slate-400 font-medium leading-relaxed">{n.body}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

      </div>

      {/* Floating Student Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition cursor-pointer"
        style={{ background: "var(--gradient-primary)" }}
        title="Toggle AI Assistant"
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 animate-pulse" />}
      </button>

      {/* Student Chat Window Panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 text-xs">
          
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: "var(--gradient-primary)" }}>
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500 animate-ping" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold flex items-center gap-1.5 leading-none">
                Student AI Assistant <Sparkles className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
              </h3>
              <p className="mt-1 text-[11px] text-white/80 leading-none">UpLearn Student Copilot · Online</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (confirm("Clear chat history?")) {
                    setChatMessages([
                      { sender: "bot", text: `Hello ${name}! I am your UpLearn Student Copilot. 🤖\n\nI can help you check active courses, search your assignments queue, or find upcoming live cohort calls!`, timestamp: new Date() }
                    ]);
                  }
                }}
                title="Clear chat history"
                className="rounded-lg p-1.5 hover:bg-white/10 transition cursor-pointer text-white border-none bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 transition cursor-pointer text-white border-none bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-semibold text-slate-700">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`rounded-2xl p-3 leading-relaxed max-w-[85%] whitespace-pre-wrap shadow-sm border border-border/40 ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-slate-100 text-slate-600 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-muted-foreground px-1">
                  {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>

          {/* Action Pills */}
          <div className="border-t border-border/60 bg-muted/30 px-3 py-2 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {studentPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => handleQuery(pill.query)}
                  className="shrink-0 rounded-full border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/40 px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:text-primary transition cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery(chatInput);
            }}
            className="flex items-center gap-2 border-t border-border/60 bg-card p-3 shrink-0"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about active courses, assignments..."
              className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition cursor-pointer shrink-0 border-none bg-transparent"
              style={chatInput.trim() ? { background: "var(--gradient-primary)" } : undefined}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}
    </main>
  );
}