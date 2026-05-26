export type Course = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  rating: number;
  students: number;
  lessons: number;
  hours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  cover: string;
  blurb: string;
  modules: { title: string; lessons: string[] }[];
};

export const courses: Course[] = [
  {
    id: "fullstack-mastery",
    title: "Full-Stack Web Development Mastery",
    instructor: "Dr. Ananya Sharma",
    category: "Development",
    price: 0,
    rating: 4.9,
    students: 2841,
    lessons: 86,
    hours: 42,
    level: "Intermediate",
    cover: "from-fuchsia-500 to-violet-600",
    blurb:
      "Build production-grade apps with React, Node, Postgres and modern DevOps. Includes 6 live cohort calls.",
    modules: [
      { title: "Foundations", lessons: ["HTTP & the Web", "Modern JS", "TypeScript Basics"] },
      { title: "Frontend", lessons: ["React patterns", "State & Data", "Design systems"] },
      { title: "Backend", lessons: ["APIs", "Auth & RLS", "Postgres deep dive"] },
      { title: "Ship it", lessons: ["CI/CD", "Observability", "Capstone review"] },
    ],
  },
  {
    id: "ai-product",
    title: "Building AI Products",
    instructor: "Karan Verma",
    category: "AI",
    price: 0,
    rating: 4.95,
    students: 3402,
    lessons: 64,
    hours: 30,
    level: "Advanced",
    cover: "from-indigo-500 to-blue-600",
    blurb: "Take an idea to a deployed AI-native product. RAG, evals, agents, pricing and GTM.",
    modules: [
      { title: "Foundations", lessons: ["LLMs", "Prompting", "Evals"] },
      { title: "Systems", lessons: ["RAG", "Agents", "Tooling"] },
      { title: "Ship", lessons: ["Deploy", "Monitor", "Iterate"] },
    ],
  },
  {
    id: "data-science-bootcamp",
    title: "Applied Data Science Bootcamp",
    instructor: "Prof. Rohit Mehta",
    category: "Data",
    price: 0,
    rating: 4.8,
    students: 1920,
    lessons: 72,
    hours: 38,
    level: "Beginner",
    cover: "from-emerald-400 to-cyan-500",
    blurb: "Python, SQL, ML and storytelling with data — taught through 12 real industry case studies.",
    modules: [
      { title: "Python for Data", lessons: ["NumPy", "Pandas", "Plotting"] },
      { title: "Machine Learning", lessons: ["Regression", "Trees", "Neural nets"] },
      { title: "Capstone", lessons: ["Project", "Presentation"] },
    ],
  },
  {
    id: "ux-design-pro",
    title: "UX Design Pro: From Research to Ship",
    instructor: "Maya Iyer",
    category: "Design",
    price: 0,
    rating: 4.9,
    students: 1207,
    lessons: 54,
    hours: 26,
    level: "Intermediate",
    cover: "from-orange-400 to-pink-500",
    blurb: "Research, prototype, validate and ship interfaces that users actually love.",
    modules: [
      { title: "Discover", lessons: ["Interviews", "Synthesis"] },
      { title: "Design", lessons: ["IA", "Wireframes", "Visual"] },
      { title: "Deliver", lessons: ["Prototype", "Handoff"] },
    ],
  },
  {
    id: "growth-marketing",
    title: "Growth Marketing Playbook",
    instructor: "Sneha Kapoor",
    category: "Marketing",
    price: 0,
    rating: 4.7,
    students: 980,
    lessons: 40,
    hours: 18,
    level: "Beginner",
    cover: "from-yellow-400 to-orange-500",
    blurb: "Acquisition, activation and retention loops that compound — for founders and PMMs.",
    modules: [
      { title: "Acquire", lessons: ["SEO", "Paid", "Content"] },
      { title: "Activate", lessons: ["Onboarding", "Aha moments"] },
      { title: "Retain", lessons: ["Loops", "Lifecycle"] },
    ],
  },
  {
    id: "finance-founders",
    title: "Finance for Founders",
    instructor: "CA Aditya Rao",
    category: "Business",
    price: 0,
    rating: 4.6,
    students: 612,
    lessons: 36,
    hours: 16,
    level: "Beginner",
    cover: "from-teal-400 to-emerald-600",
    blurb: "Models, fundraising, unit economics and tax — without the accountant jargon.",
    modules: [
      { title: "Numbers", lessons: ["P&L", "Cashflow", "Models"] },
      { title: "Capital", lessons: ["Fundraising", "Cap tables"] },
    ],
  },
];

export const assignments = [
  { id: "a1", course: "Full-Stack Web Development Mastery", title: "Build a REST API with auth", dueIn: "2 days", status: "pending" as const },
  { id: "a2", course: "Applied Data Science Bootcamp", title: "EDA on Titanic dataset", dueIn: "5 days", status: "in-progress" as const },
  { id: "a3", course: "UX Design Pro", title: "Heuristic audit", dueIn: "Submitted", status: "graded" as const, grade: "A" },
];

export const liveClasses = [
  { id: "l1", title: "React Server Components — Deep Dive", course: "Full-Stack Web Development", at: "Today, 6:30 PM", instructor: "Dr. Ananya Sharma" },
  { id: "l2", title: "Building a RAG pipeline live", course: "Building AI Products", at: "Tomorrow, 8:00 PM", instructor: "Karan Verma" },
  { id: "l3", title: "Cohort Q&A", course: "UX Design Pro", at: "Fri, 7:00 PM", instructor: "Maya Iyer" },
];

export const announcements = [
  { id: "n1", title: "New batch starts Monday", body: "Cohort 12 kicks off June 1 — onboarding pack inside." },
  { id: "n2", title: "New course launched", body: "Exploring Vector Embeddings and RAG models is now live!" },
  { id: "n3", title: "Certificate ready", body: "Your UX Foundations certificate is generated." },
];