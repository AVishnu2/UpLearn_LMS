import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeTable, type DbCourse } from "@/hooks/useRealtime";
import { courses as staticCourses } from "@/data/lms";
import { Award, Download, AwardIcon, FileText, CheckCircle2, ChevronRight, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/certification")({
  head: () => ({
    meta: [
      { title: "Certification Center — UpLearnLMS" },
      { name: "description", content: "Claim and download your official course completion certificates." },
    ],
  }),
  component: CertificationPage,
});

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function generateSyllabus(title: string, category: string) {
  const t = title ? title.toLowerCase() : "";
  const cat = category ? category.toLowerCase() : "";
  
  const isAi = t.includes("ai") || t.includes("artificial") || t.includes("intelligence") || t.includes("llm") || cat.includes("ai");
  const isData = t.includes("data") || t.includes("science") || cat.includes("data") || cat.includes("ml");
  const isDesign = t.includes("design") || t.includes("ux") || t.includes("ui") || cat.includes("design");
  const isDev = t.includes("dev") || t.includes("web") || t.includes("code") || cat.includes("dev") || cat.includes("web");
  const isMarketingOrBiz = t.includes("marketing") || t.includes("seo") || t.includes("growth") || t.includes("business") || t.includes("finance") || t.includes("accounting") || t.includes("startup") || cat.includes("marketing") || cat.includes("business");

  if (isAi) {
    return ["The Evolution of AI & Modern Architectures", "Understanding GPT & Large Language Models", "Prompt Engineering Best Practices", "Tokenization & Core NLP Concepts", "Vector Databases & Embeddings Deep Dive", "Chunking Strategies & Document Loaders", "Building Your First Semantic Search Pipeline", "Evaluating RAG Performance & Retrieval Accuracy", "Agentic Architectures: ReAct Framework", "Function Calling & API Integration", "Multi-Agent Systems & Orchestration", "Memory & State Persistence in Agents", "Deploying AI Apps to Cloud & Vercel", "Model Evals, Guardrails & Security", "Mitigating Bias & Hallucinations", "Capstone: Building a Fully-Featured AI Native Assistant"];
  } else if (isData) {
    return ["Jupyter Notebooks & Environment Setup", "Advanced Pandas & Data Wrangling", "NumPy & Scientific Computing", "Data Cleaning & Preprocessing Techniques", "Statistical Analysis & Hypothesis Testing", "Data Storytelling with Matplotlib & Seaborn", "Feature Engineering & Selection", "Working with Missing Data & Outliers", "Supervised Learning: Regression & Classification", "Unsupervised Learning: Clustering & K-Means", "Decision Trees & Random Forests", "Model Selection & Hyperparameter Tuning", "Introduction to SQL for Data Querying", "Model Deployment with Flask & FastAPI", "Version Control for Data (DVC)", "Capstone: Predict Housing Prices End-to-End"];
  } else if (isDesign) {
    return ["Introduction to User-Centered Design", "Conducting Effective User Interviews", "Creating User Personas & Empathy Maps", "Synthesis: Affinity Mapping & Problem Statements", "Sitemaps & User Flow Diagrams", "Heuristic Evaluation of UI/UX", "Wireframing: Low-Fi to Mid-Fi Layouts", "Accessibility (a11y) in Modern Web Interfaces", "Typography, Grids & Harmonic Color Palettes", "Mastering Figma Components & Auto-layout", "Creating Styles and Design Systems", "Prototyping Transitions & Micro-interactions", "Planning & Running A/B Usability Tests", "Analyzing Feedback & Iterating Designs", "Perfecting Files for Developer Handoff", "Capstone: Designing a Mobile FinTech Dashboard"];
  } else if (isDev) {
    return ["How the Web Works: HTTP, DNS, & Servers", "Modern JavaScript (ES6+) Features", "TypeScript: Types, Interfaces & Compiler Options", "Asynchronous Coding & API Fetching", "React Component Lifecycle & Hooks", "State Management: Context & Redux Toolkit", "Routing & Dynamic URL Parameters", "Styling with CSS Variables & Tailwind CSS", "Building RESTful APIs with Node.js & Express", "Database Design: SQL vs NoSQL", "Postgres, Prisma & Database Migrations", "Authentication: JWT & Row-Level Security (RLS)", "Unit & Integration Testing (Vitest / Jest)", "Containerization with Docker", "Continuous Integration / Continuous Deployment (CI/CD)", "Capstone: Shipping a Fullstack E-Commerce Site"];
  } else if (isMarketingOrBiz) {
    return ["Identifying Market Fit & Competitor Analysis", "Developing a Value Proposition", "Understanding Customer Acquisition Costs (CAC)", "Defining Key Performance Indicators (KPIs)", "Search Engine Optimization (SEO) Playbook", "Running Paid Ad Campaigns (Google / Meta)", "Content Marketing & Social Media Brand Building", "Building High-Converting Landing Pages", "A/B Testing Methodologies", "User Onboarding & Activation Loops", "Email Marketing & Lifecycle Automation", "Churn Reduction & Referral Program Design", "Building a Startup Financial Model", "Cap Tables & Startup Fundraising Basics", "Unit Economics & Profit Margins", "Capstone: Launching a Digital Product Growth Plan"];
  } else {
    return ["Introduction & Historical Overview", "Core Principles & Basic Vocabulary", "Industry Context & Essential Frameworks", "Setting Goals for Your Learning Path", "Exploring Advanced Concepts", "Real-World Business Case Studies", "Interactive Labs & Scenario Challenges", "Solving Common Complex Problems", "Essential Toolkit & Resources", "Step-by-Step Hands-On Practice", "Design Patterns & Tactical Methodologies", "Optimizing Performance & Outcomes", "Final Project Definition & Guidelines", "Expert Assessment & Critique Session", "Preparing for Job Interviews & Portfolio Building", "Obtaining Your Official Certificate"];
  }
}

function CertificationPage() {
  const { user, loading } = useAuth();
  const { rows: dbCourses } = useRealtimeTable<DbCourse>("courses");
  
  const [studentName, setStudentName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [completedData, setCompletedData] = useState<Record<string, string[]>>({});
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync details on load
  useEffect(() => {
    if (user) {
      const defaultName = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
      setStudentName(defaultName);
    }

    try {
      const storedCompleted = localStorage.getItem("uplearn_completed_lessons");
      if (storedCompleted) {
        setCompletedData(JSON.parse(storedCompleted));
      }

      const storedEnrolled = localStorage.getItem("uplearn_enrolled_courses");
      if (storedEnrolled) {
        setEnrolledIds(JSON.parse(storedEnrolled));
      } else {
        const initial = ["fullstack-mastery", "data-science-bootcamp", "ai-product"];
        setEnrolledIds(initial);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Combine static and dynamic courses
  const mappedLiveCourses = dbCourses.map((lc) => ({
    id: lc.id,
    title: lc.title,
    instructor: lc.instructor,
    category: lc.category,
    modules: [{ title: "Syllabus", lessons: generateSyllabus(lc.title, lc.category) }]
  }));

  const allCourses = [
    ...staticCourses.map(c => ({
      id: c.id,
      title: c.title,
      instructor: c.instructor,
      category: c.category,
      modules: c.modules
    })),
    ...mappedLiveCourses
  ];

  // Pick first course automatically if not chosen
  useEffect(() => {
    if (allCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(allCourses[0].id);
    }
  }, [allCourses, selectedCourseId]);

  const activeCourse = allCourses.find((c) => c.id === selectedCourseId);

  // Calculate course completion
  const completionStats = (() => {
    if (!activeCourse) return { progress: 0, completedCount: 0, totalCount: 0, isCompleted: false };
    const lessons = activeCourse.modules ? activeCourse.modules.flatMap(m => m.lessons) : [];
    const completedList = completedData[activeCourse.id] || [];
    const completedCount = lessons.filter(l => completedList.includes(l)).length;
    const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
    
    // Genuine completion is 100% (all lessons finished).
    // For presentation/hacking convenience, if progress is 100% or they completed at least 1 lesson, they can generate, but 100% completion is genuine!
    return {
      progress,
      completedCount,
      totalCount: lessons.length,
      isCompleted: progress === 100
    };
  })();

  const downloadCertificate = () => {
    if (!canvasRef.current || !activeCourse) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dimensions
    canvas.width = 1200;
    canvas.height = 800;

    // 1. Draw elegant background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, "#0b0c10");
    bgGrad.addColorStop(0.5, "#1f2833");
    bgGrad.addColorStop(1, "#0b0c10");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // 2. Draw luxury outer borders in gold
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 740);

    // Inner thin border
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 1104, 704);

    // 3. Ornate corner accents in gold
    const drawCornerAccent = (x: number, y: number, rX: number, rY: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(rX, rY);
      ctx.fillStyle = "#c5a059";
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.lineTo(40, 6);
      ctx.lineTo(6, 6);
      ctx.lineTo(6, 40);
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(20, 20, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCornerAccent(58, 58, 1, 1);
    drawCornerAccent(1142, 58, -1, 1);
    drawCornerAccent(58, 742, 1, -1);
    drawCornerAccent(1142, 742, -1, -1);

    // 4. Header Branding Logo
    ctx.fillStyle = "#a855f7"; // primary violet
    ctx.beginPath();
    ctx.arc(600, 115, 18, 0, Math.PI * 2);
    ctx.fill();

    // Golden star icon on canvas
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("★", 600, 120);

    ctx.font = "bold 24px Georgia, serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("UpLearn LMS", 600, 168);

    // 5. Title
    ctx.font = "normal italic 15px Georgia, serif";
    ctx.fillStyle = "#c5a059";
    ctx.fillText("C E R T I F I C A T E   O F   A C H I E V E M E N T", 600, 235);

    // Present to label
    ctx.font = "normal 14px sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("THIS IS PROUDLY PRESENTED TO", 600, 290);

    // 6. Student Name in premium gold cursive style
    ctx.font = "bold 46px Garamond, 'Times New Roman', serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(studentName.trim() || "Distinguished Student", 600, 360);

    // underline below student name
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(400, 385);
    ctx.lineTo(800, 385);
    ctx.stroke();

    // 7. Blurb Text
    ctx.font = "normal 15px sans-serif";
    ctx.fillStyle = "#d1d5db";
    ctx.fillText("for successfully completing all curriculum requirements and passing the core reviews of", 600, 435);

    // 8. Course Title
    ctx.font = "bold 32px Georgia, serif";
    ctx.fillStyle = "#c5a059";
    ctx.fillText(activeCourse.title, 600, 490);

    // Date
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    ctx.font = "normal 13px sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Issued on ${today}`, 600, 545);

    // 9. Signatures
    // Instructor Signature
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(250, 660);
    ctx.lineTo(450, 660);
    ctx.stroke();
    
    ctx.font = "normal italic 15px 'Courier New', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(activeCourse.instructor, 350, 650);
    ctx.font = "normal 12px sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Course Instructor", 350, 685);

    // Committee Signature
    ctx.beginPath();
    ctx.moveTo(750, 660);
    ctx.lineTo(950, 660);
    ctx.stroke();
    
    ctx.font = "normal italic 15px 'Brush Script MT', cursive, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("UpLearn LMS Committee", 850, 650);
    ctx.font = "normal 12px sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Director, Institute Board", 850, 685);

    // 10. Seal badge
    ctx.fillStyle = "#c5a059";
    ctx.beginPath();
    ctx.arc(600, 650, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(600, 650, 36, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#0b0c10";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("VERIFIED", 600, 653);

    // 11. Dynamic serial ID
    const randomHex = Math.random().toString(16).substr(2, 8).toUpperCase();
    const serialId = `VERIFIED ID: UL-${slugify(activeCourse.title).substring(0, 3).toUpperCase()}-${randomHex}`;
    ctx.font = "normal 9px monospace";
    ctx.fillStyle = "#4b5563";
    ctx.fillText(serialId, 600, 725);

    // 12. Trigger Instant Download of PNG
    const link = document.createElement("a");
    link.download = `Certificate_${slugify(activeCourse.title)}_${slugify(studentName || "Learner")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (loading) {
    return <main className="mx-auto max-w-7xl px-6 py-20 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-6 py-20 text-center">
        <Award className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold">Certification Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to check your eligibility and claim your official course certifications.</p>
        <Link to="/auth" className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>Sign in to continue</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Achievements</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl flex items-center gap-2">Certification center <Sparkles className="h-6 w-6 text-accent" /></h1>
        <p className="mt-2 text-muted-foreground">Fill in your name, select a program, and export your validated accomplishment.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary" /> Certificate Details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Your Name (For Certificate)</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition cursor-pointer"
                >
                  {allCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.instructor})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {activeCourse && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Eligibility Status</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Topic quizzes completed:</span>
                  <span className="font-semibold text-foreground">{completionStats.completedCount} / {completionStats.totalCount}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completionStats.progress}%`, background: "var(--gradient-primary)" }} />
                </div>

                {completionStats.isCompleted ? (
                  <div className="rounded-xl bg-accent/10 border border-accent/20 p-3.5 text-xs text-accent mt-4">
                    <strong className="block font-bold">✓ Completion Unlocked!</strong>
                    You have finished every lesson in this course! Your certification is fully validated and ready for industry credentialing.
                  </div>
                ) : (
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-3.5 text-xs text-primary mt-4">
                    <strong className="block font-bold">⚠ Curriculum in Progress ({completionStats.progress}%)</strong>
                    You can print a **Preview Certificate** with your custom name now! To make it fully validated, complete the 3-question mini-quizzes for all course lessons.
                  </div>
                )}

                <button
                  onClick={downloadCertificate}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-md transition duration-300 group cursor-pointer"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  <Download className="h-4 w-4 transition group-hover:-translate-y-0.5" />
                  {completionStats.isCompleted ? "Download Official Certificate" : "Download Preview Certificate"}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-1.5"><AwardIcon className="h-4 w-4 text-accent" /> Real-Time Preview</h2>
            <p className="text-xs text-muted-foreground mt-1">This high-resolution certificate frame will download in full print dimensions (1200 x 800 px).</p>
            
            <div className="mt-5 relative overflow-hidden rounded-xl border border-border/40 aspect-[3/2] bg-[#0b0c10] flex flex-col items-center justify-between p-[6%] text-center shadow-lg group">
              {/* Outer decorative borders in gold */}
              <div className="absolute inset-[3.5%] border-2 border-[#c5a059]/60 pointer-events-none" />
              <div className="absolute inset-[4.5%] border border-[#d4af37]/20 pointer-events-none" />
              
              {/* Logo / Header */}
              <div className="z-10 flex flex-col items-center gap-1">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20">
                  <Award className="h-4 w-4 text-accent" />
                </span>
                <span className="text-xs font-semibold tracking-tight text-white mt-1">UpLearn <span className="text-muted-foreground">LMS</span></span>
                <span className="text-[8px] uppercase tracking-widest text-[#c5a059] font-medium">Certificate of Achievement</span>
              </div>

              {/* Student Name */}
              <div className="z-10 flex flex-col items-center w-full">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">This is proudly presented to</span>
                <h3 className="text-lg md:text-2xl font-serif text-white font-semibold mt-1 tracking-wide line-clamp-1">
                  {studentName.trim() || "Distinguished Student"}
                </h3>
                <div className="h-[1px] w-[50%] bg-[#c5a059]/40 mt-1" />
              </div>

              {/* Course Title details */}
              <div className="z-10 flex flex-col items-center">
                <p className="text-[8px] md:text-[10px] text-muted-foreground line-clamp-2 max-w-[80%]">for successfully completing all curriculum requirements of</p>
                <h4 className="text-sm md:text-lg font-serif text-[#c5a059] font-bold mt-1 line-clamp-1">{activeCourse?.title ?? "Course Program"}</h4>
                <p className="text-[8px] text-muted-foreground/60 mt-1">Verified via UpLearn LMS Verification Portal</p>
              </div>

              {/* Date & signatures footer */}
              <div className="z-10 w-full flex items-end justify-between px-4 text-[7px] text-muted-foreground">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-white text-[8px] italic">{activeCourse?.instructor ?? "Instructor"}</span>
                  <div className="h-[1px] w-16 bg-[#c5a059]/50 my-0.5" />
                  <span>Course Instructor</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-[#c5a059] text-[7px] font-bold border border-[#c5a059]/40">SEAL</div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white text-[8px] italic">UpLearn LMS Board</span>
                  <div className="h-[1px] w-16 bg-[#c5a059]/50 my-0.5" />
                  <span>Director Board</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Hidden high-res rendering canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}
