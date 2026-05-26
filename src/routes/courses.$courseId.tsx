import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { courses, type Course } from "@/data/lms";
import { Clock, BookOpen, Users, Award, PlayCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-");        // Replace multiple - with single -
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

export const Route = createFileRoute("/courses/$courseId")({
  head: ({ params, loaderData }) => {
    const c = (loaderData as any)?.course || courses.find((x) => x.id === params.courseId || slugify(x.title) === params.courseId);
    return {
      meta: [
        { title: c ? `${c.title} — UpLearnLMS` : "Course — UpLearnLMS" },
        { name: "description", content: c?.blurb ?? "Course detail" },
      ],
    };
  },
  loader: async ({ params }) => {
    // 1. Search in static courses
    let course = courses.find((c) => c.id === params.courseId || slugify(c.title) === params.courseId);
    
    if (course) {
      // Force price to 0 for static courses
      course = { ...course, price: 0 };
    }
    
    if (!course) {
      // 2. Try querying Supabase by ID if it's a valid UUID to prevent Postgres errors
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.courseId);
      
      if (isUuid) {
        try {
          const { data, error } = await supabase
            .from("courses")
            .select("*")
            .eq("id", params.courseId)
            .maybeSingle();

          if (data && !error) {
            course = {
              id: data.id,
              title: data.title,
              instructor: data.instructor,
              category: data.category,
              price: 0, // Force price to 0
              rating: 5.0,
              students: 128,
              lessons: 16,
              hours: 12,
              level: (data.level as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
              cover: data.cover || "from-fuchsia-500 to-violet-600",
              blurb: data.blurb || "",
              modules: generateSyllabus(data.title, data.category)
            };
          }
        } catch (err) {
          console.error("Supabase query by ID error:", err);
        }
      }

      // 3. Fallback: Search all Supabase courses to find a match by slugified title
      if (!course) {
        try {
          const { data, error } = await supabase
            .from("courses")
            .select("*");

          if (data && !error) {
            const matchedDbCourse = data.find(
              (c) => slugify(c.title) === params.courseId || c.id === params.courseId
            );

            if (matchedDbCourse) {
              course = {
                id: matchedDbCourse.id,
                title: matchedDbCourse.title,
                instructor: matchedDbCourse.instructor,
                category: matchedDbCourse.category,
                price: 0, // Force price to 0
                rating: 5.0,
                students: 128,
                lessons: 16,
                hours: 12,
                level: (matchedDbCourse.level as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
                cover: matchedDbCourse.cover || "from-fuchsia-500 to-violet-600",
                blurb: matchedDbCourse.blurb || "",
                modules: generateSyllabus(matchedDbCourse.title, matchedDbCourse.category)
              };
            }
          }
        } catch (err) {
          console.error("Supabase fallback slug search error:", err);
        }
      }
    }
    
    if (!course) throw notFound();
    return { course };
  },
  component: CourseDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl py-24 text-center">
      <h1 className="text-2xl font-semibold">Course not found</h1>
      <Link to="/courses" className="mt-4 inline-block text-primary">Back to courses</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function getLessonDetails(lessonName: string, courseTitle: string) {
  const name = lessonName.toLowerCase();
  
  // AI-related lessons
  if (name.includes("prompt") || name.includes("gpt") || name.includes("llm") || name.includes("agent") || name.includes("rag") || name.includes("embedding") || name.includes("vector") || name.includes("neural") || name.includes("ai")) {
    if (name.includes("prompt")) {
      return {
        duration: "25 mins",
        objective: "Master prompt engineering methodologies like Zero-shot, Few-shot, Chain-of-Thought, and Role Prompting to guide AI generation reliably.",
        topics: ["Zero-shot & Few-shot learning", "Chain of Thought (CoT) prompting", "System instructions & delimiters", "Avoiding prompt injections"]
      };
    } else if (name.includes("rag") || name.includes("vector") || name.includes("embedding")) {
      return {
        duration: "35 mins",
        objective: "Understand Retrieval-Augmented Generation architectures. Learn how to parse documents, generate semantic vector embeddings, and query vector databases.",
        topics: ["Vector database operations", "Document chunking strategies", "Cosine similarity & semantic search", "Reranking & retrieval evaluation"]
      };
    } else if (name.includes("agent") || name.includes("react")) {
      return {
        duration: "40 mins",
        objective: "Explore autonomous AI agents. Learn the ReAct (Reasoning and Acting) loop, function calling, tool use, and stateful memory persistence.",
        topics: ["ReAct loop mechanism", "Function calling in LLMs", "Stateful memory management", "Orchestrating multi-agent systems"]
      };
    } else {
      return {
        duration: "30 mins",
        objective: "Dive into the core fundamentals of generative AI, neural networks, tokenization, transformer self-attention mechanisms, and safety guardrails.",
        topics: ["Transformer self-attention mechanism", "LLM tokenization & vocabulary", "Model fine-tuning principles", "AI guardrails & safety systems"]
      };
    }
  }
  
  // Data Science-related lessons
  if (name.includes("pandas") || name.includes("numpy") || name.includes("data") || name.includes("plot") || name.includes("visual") || name.includes("regression") || name.includes("model") || name.includes("algorithm")) {
    if (name.includes("pandas") || name.includes("numpy") || name.includes("clean")) {
      return {
        duration: "20 mins",
        objective: "Learn data preparation using Pandas and NumPy. Clean missing values, handle outliers, and perform feature engineering.",
        topics: ["Pandas DataFrames & Series", "NumPy array computations", "Handling missing values & outliers", "Merging & joining datasets"]
      };
    } else if (name.includes("visual") || name.includes("plot") || name.includes("eda") || name.includes("story")) {
      return {
        duration: "25 mins",
        objective: "Perform Exploratory Data Analysis. Learn to tell stories with data using visualization libraries like Seaborn, Matplotlib, and Tableau.",
        topics: ["Distribution & correlation plots", "Customizing themes & palettes", "Interactive chart structures", "Translating insights to stakeholders"]
      };
    } else {
      return {
        duration: "30 mins",
        objective: "Understand machine learning algorithms. Train supervised models, optimize performance metrics, and avoid underfitting/overfitting.",
        topics: ["Supervised vs Unsupervised learning", "Training vs validation sets", "Evaluation metrics: Precision, Recall, F1", "Hyperparameter tuning techniques"]
      };
    }
  }

  // UI/UX Design lessons
  if (name.includes("figma") || name.includes("design") || name.includes("ux") || name.includes("ui") || name.includes("wireframe") || name.includes("research") || name.includes("user")) {
    if (name.includes("research") || name.includes("interview") || name.includes("needs")) {
      return {
        duration: "25 mins",
        objective: "Master the art of user research. Formulate research plans, run user interviews, and synthesize findings into actionable empathy maps.",
        topics: ["User interview best practices", "Empathy mapping frameworks", "Defining user persona structures", "Identifying pain points & goals"]
      };
    } else if (name.includes("figma") || name.includes("layout") || name.includes("prototype")) {
      return {
        duration: "35 mins",
        objective: "Deepen your Figma skills. Leverage Auto-layout, nested component variants, color/text variables, and interactive micro-interactions.",
        topics: ["Auto-layout & responsive resizing", "Component variants & properties", "Local variables & design systems", "Smart Animate micro-interactions"]
      };
    } else {
      return {
        duration: "30 mins",
        objective: "Understand information architecture, usability testing guidelines, heuristic evaluations, and preparing high-fidelity assets for developers.",
        topics: ["Heuristic evaluation principles", "User flow & sitemap mapping", "Usability testing methodologies", "Developer handoff & spec prep"]
      };
    }
  }

  // Web Development lessons
  if (name.includes("react") || name.includes("js") || name.includes("ts") || name.includes("api") || name.includes("web") || name.includes("backend") || name.includes("postgres") || name.includes("server") || name.includes("auth") || name.includes("deploy")) {
    if (name.includes("react") || name.includes("component") || name.includes("state")) {
      return {
        duration: "30 mins",
        objective: "Master modern React patterns. Manage component state, handle side effects with hooks, and configure declarative routing solutions.",
        topics: ["React hooks: useState & useEffect", "Context API & global state", "Component life-cycle optimization", "Declaring nested router structures"]
      };
    } else if (name.includes("api") || name.includes("backend") || name.includes("node") || name.includes("postgres")) {
      return {
        duration: "35 mins",
        objective: "Build scalable backends. Design RESTful API routes, manage database relations, configure ORMs, and secure data access layers.",
        topics: ["Express.js routing & middleware", "Database modeling & schemas", "Row-Level Security (RLS) rules", "JWT & session authentication"]
      };
    } else {
      return {
        duration: "25 mins",
        objective: "Dive into runtime environments, TypeScript static typing features, and cloud deployment pipelines using Git, Docker, and CI/CD.",
        topics: ["TypeScript types vs interfaces", "Containerizing apps with Docker", "GitHub Actions & automated tests", "Vercel & Netlify cloud deploys"]
      };
    }
  }

  // Fallback
  return {
    duration: "20 mins",
    objective: `Gain a deep, comprehensive understanding of "${lessonName}" in the context of "${courseTitle}". Explore core concepts and practical implementations.`,
    topics: ["Introduction to key vocabularies", "Standard industry best practices", "Step-by-step walkthroughs", "Common pitfalls & troubleshooting"]
  };
}

type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

function getLessonQuiz(lessonName: string): QuizQuestion[] {
  const name = lessonName.toLowerCase();
  
  if (name.includes("prompt") || name.includes("gpt") || name.includes("llm") || name.includes("agent") || name.includes("rag") || name.includes("embedding") || name.includes("vector") || name.includes("neural") || name.includes("ai")) {
    if (name.includes("prompt")) {
      return [
        {
          question: "What is 'few-shot prompting'?",
          options: [
            "Training a model with a very small dataset from scratch",
            "Providing a few examples of input-output pairs in the prompt to show the desired pattern",
            "Restricting the model's output to a few words only",
            "Running the prompt multiple times to get a consensus"
          ],
          correct: 1,
          explanation: "Few-shot prompting guides the model's behavior by showing it a few examples of inputs and desired outputs inside the prompt context."
        },
        {
          question: "Which prompting technique asks the model to output its step-by-step reasoning before giving the final answer?",
          options: [
            "Direct Instruction Prompting",
            "Negative Prompting",
            "Chain of Thought (CoT) Prompting",
            "Delimiter Prompting"
          ],
          correct: 2,
          explanation: "Chain of Thought prompting forces the LLM to write down intermediate reasoning steps, which improves performance on complex logic tasks."
        },
        {
          question: "What is the primary risk of 'prompt injection'?",
          options: [
            "It slows down model generation times",
            "It bypasses developer-defined system instructions using user-supplied inputs",
            "It increases API costs by adding unnecessary tokens",
            "It corrupts the baseline model parameters permanently"
          ],
          correct: 1,
          explanation: "Prompt injection occurs when untrusted user inputs manipulate the model to ignore its system instructions and perform unintended actions."
        }
      ];
    } else if (name.includes("rag") || name.includes("vector") || name.includes("embedding")) {
      return [
        {
          question: "What is the main benefit of Retrieval-Augmented Generation (RAG)?",
          options: [
            "It increases model size dynamically",
            "It allows the model to access private, up-to-date, or external knowledge without retraining",
            "It guarantees 100% accurate code generation",
            "It completely eliminates the need for prompts"
          ],
          correct: 1,
          explanation: "RAG combines retrieval models with LLMs to query external databases, feeding current context directly into the generation prompt."
        },
        {
          question: "What metric is commonly used in vector databases to calculate the semantic similarity between two text embeddings?",
          options: [
            "Euclidean distance only",
            "Cosine similarity",
            "String edit distance",
            "Character match count"
          ],
          correct: 1,
          explanation: "Cosine similarity measures the angle between two embedding vectors in a high-dimensional space, capturing semantic relatedness."
        },
        {
          question: "What is the purpose of 'chunking' documents in a RAG pipeline?",
          options: [
            "Compressing the file size to save storage",
            "Translating sentences into multiple languages",
            "Splitting large documents into smaller semantic sections to fit within LLM context windows",
            "Encrypting text for secure network transfers"
          ],
          correct: 2,
          explanation: "Chunking divides long texts into smaller segments so relevant portions can be retrieved and fit neatly within LLM attention constraints."
        }
      ];
    } else if (name.includes("agent") || name.includes("react")) {
      return [
        {
          question: "In the 'ReAct' agent framework, what does ReAct stand for?",
          options: [
            "Reaction and Action",
            "Reason and Act",
            "Recursive Active Learning",
            "Relational Actor Network"
          ],
          correct: 1,
          explanation: "ReAct integrates reasoning (thoughts) and acting (calling tools) iteratively to let agents solve complex multi-step problems."
        },
        {
          question: "How does 'function calling' empower LLM agents?",
          options: [
            "It executes raw Python code inside the LLM automatically",
            "It generates structured JSON arguments matching a predefined schema, allowing the agent to interface with APIs",
            "It compiles the LLM to run faster on GPUs",
            "It lets user trigger model training calls"
          ],
          correct: 1,
          explanation: "Function calling enables LLMs to intelligently generate structured arguments that can be parsed and executed by external system APIs."
        },
        {
          question: "What is the primary role of 'stateful memory' in autonomous agents?",
          options: [
            "It saves GPU vRAM usage",
            "It retains intermediate thoughts, history, and variable values across multi-turn interactions",
            "It encrypts all network requests automatically",
            "It resets agent state after every tool execution"
          ],
          correct: 1,
          explanation: "Stateful memory keeps track of historical operations and conversations, allowing the agent to sustain multi-step tasks without losing context."
        }
      ];
    } else {
      return [
        {
          question: "What is the primary innovation of the 'Transformer' architecture introduced in 2017?",
          options: [
            "Recurrent neural processing loops",
            "Self-attention mechanism that processes tokens in parallel",
            "Hardware-level GPU caching layers",
            "Basic gradient descent enhancements"
          ],
          correct: 1,
          explanation: "Self-attention enables models to evaluate relationships between all words in a sentence simultaneously and in parallel."
        },
        {
          question: "What is 'tokenization' in Large Language Models?",
          options: [
            "Generating digital payment credentials",
            "Converting raw input strings into numerical chunks or sub-words",
            "Restricting model output rates",
            "Formatting database rows to JSON"
          ],
          correct: 1,
          explanation: "Tokenization splits strings into sub-word numerical IDs that the mathematical layers of the transformer can ingest and process."
        },
        {
          question: "Why is 'model fine-tuning' used after pre-training?",
          options: [
            "To compress the physical model file size",
            "To specialize the model on a narrow domain or task using specialized data",
            "To add infinite context memory",
            "To reset baseline model knowledge"
          ],
          correct: 1,
          explanation: "Fine-tuning takes a general pre-trained foundation model and adapts it to excel at custom tasks or specific domain guidelines."
        }
      ];
    }
  }
  
  // Data Science / Web Development-related lessons
  if (name.includes("pandas") || name.includes("numpy") || name.includes("data") || name.includes("plot") || name.includes("visual") || name.includes("regression") || name.includes("model") || name.includes("algorithm") || name.includes("react") || name.includes("js") || name.includes("ts") || name.includes("api") || name.includes("web") || name.includes("backend") || name.includes("postgres") || name.includes("auth")) {
    return [
      {
        question: "In React, what hook is used to handle side effects like fetching data from an API?",
        options: [
          "useState",
          "useEffect",
          "useContext",
          "useMemo"
        ],
        correct: 1,
        explanation: "useEffect executes code after the component is rendered, making it perfect for APIs, subscriptions, or document adjustments."
      },
      {
        question: "What is the main security purpose of Row-Level Security (RLS) in databases like Supabase?",
        options: [
          "Encrypting the passwords in columns",
          "Preventing unauthorized SQL queries globally",
          "Defining granular access rules so users can only view or modify specific table rows",
          "Speeding up search queries using indexes"
        ],
        correct: 2,
        explanation: "RLS enables developers to configure precise security policies directly in the database so authenticated users only access their authorized rows."
      },
      {
        question: "What does JWT stand for in modern authentication?",
        options: [
          "Java Web Token",
          "JSON Web Token",
          "Joint Wire Transfer",
          "JavaScript Work Thread"
        ],
        correct: 1,
        explanation: "JSON Web Token is a secure URL-safe format used to transmit claims between client and server, verified with a secret key."
      }
    ];
  }

  // Fallback
  return [
    {
      question: "Which of the following describes the core goal of continuous integration (CI)?",
      options: [
        "Keeping developers in constant communication",
        "Automatically building and testing code changes frequently to detect errors early",
        "Deploying the database to production hourly",
        "Automatically writing documentation for code"
      ],
      correct: 1,
      explanation: "CI practices automatically compile, build, and test applications whenever a change is made, verifying sanity and reducing code conflicts."
    },
    {
      question: "What is the primary role of a 'router' in single-page applications (SPAs)?",
      options: [
        "Forwarding internet packets between server racks",
        "Synchronizing UI views with current browser address bar paths without reloading",
        "Generating database RLS rules dynamically",
        "Encrypting private API requests"
      ],
      correct: 1,
      explanation: "LMS routers capture address bar transformations and render the appropriate page component without requiring full browser document loads."
    },
    {
      question: "What does git commit accomplish in source control?",
      options: [
        "Sending code changes to GitHub repository",
        "Saving snapshots of staged changes to the local repository history",
        "Creating a new repository workspace branch",
        "Merging changes between two development branches"
      ],
      correct: 1,
      explanation: "Committing creates a permanent record of staged modifications locally, functioning as an incremental checkpoint of code progress."
    }
  ];
}

function InteractiveQuiz({ courseId, lessonName, courseTitle, onComplete }: { courseId: string; lessonName: string; courseTitle: string; onComplete?: () => void }) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExpl, setShowExpl] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = getLessonQuiz(lessonName);

  const handleSelect = (index: number) => {
    if (showExpl) return; // Prevent double selection
    setSelectedOpt(index);
  };

  const handleNext = () => {
    const q = questions[currentQ];
    if (selectedOpt === q.correct) {
      setScore((prev) => prev + 1);
    }
    
    setShowExpl(true);
  };

  const handleContinue = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOpt(null);
      setShowExpl(false);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedOpt(null);
    setShowExpl(false);
    setScore(0);
    setFinished(false);
    setStarted(true);
  };

  useEffect(() => {
    if (finished) {
      try {
        const completedData = JSON.parse(localStorage.getItem("uplearn_completed_lessons") || "{}");
        if (!completedData[courseId]) {
          completedData[courseId] = [];
        }
        if (!completedData[courseId].includes(lessonName)) {
          completedData[courseId].push(lessonName);
          localStorage.setItem("uplearn_completed_lessons", JSON.stringify(completedData));
          
          // Increment dynamic learning streak in localStorage
          const currentStreak = parseInt(localStorage.getItem("uplearn_learning_streak") || "1", 10) || 1;
          localStorage.setItem("uplearn_learning_streak", String(currentStreak + 1));
          
          toast.success(`Progress saved! Lesson "${lessonName}" completed ✓`);
          if (onComplete) onComplete();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [finished, courseId, lessonName, onComplete]);

  if (!started) {
    return (
      <div className="pt-2 flex items-center justify-start">
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer transition"
          style={{ background: "var(--gradient-primary)" }}
        >
          🧪 Start mini-quiz
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-border bg-card shadow animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <span className="text-3xl">🎉</span>
          <h4 className="mt-2 text-sm font-semibold text-foreground">Quiz Completed!</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            You scored <strong className="text-primary font-bold text-accent">{score}/{questions.length}</strong> on "{lessonName}"
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={resetQuiz}
              className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted cursor-pointer transition"
            >
              Retry Quiz
            </button>
            <button
              onClick={() => setStarted(false)}
              className="px-3 py-1.5 text-xs font-medium bg-accent text-accent-foreground rounded-lg hover:opacity-90 cursor-pointer transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="mt-4 p-4 rounded-xl border border-border bg-card shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Question {currentQ + 1} of {questions.length}</span>
        <span className="font-medium bg-muted px-2 py-0.5 rounded-full">Score: {score}</span>
      </div>
      
      <h4 className="text-xs font-semibold text-foreground mb-3 leading-snug">{q.question}</h4>
      
      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let btnStyle = "border-border hover:bg-muted/30";
          if (selectedOpt === idx) {
            btnStyle = "border-primary bg-primary/5 text-primary font-semibold";
          }
          if (showExpl) {
            if (idx === q.correct) {
              btnStyle = "border-accent bg-accent/10 text-accent font-semibold";
            } else if (selectedOpt === idx) {
              btnStyle = "border-destructive bg-destructive/10 text-destructive font-semibold";
            } else {
              btnStyle = "border-border/30 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={showExpl}
              onClick={() => handleSelect(idx)}
              className={`w-full flex items-start gap-2.5 rounded-lg border p-2.5 text-left text-xs transition-all ${btnStyle} cursor-pointer`}
            >
              <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[10px] ${
                showExpl && idx === q.correct
                  ? "border-accent bg-accent text-accent-foreground font-bold"
                  : showExpl && selectedOpt === idx
                  ? "border-destructive bg-destructive text-destructive-foreground font-bold"
                  : selectedOpt === idx
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground"
              }`}>
                {showExpl && idx === q.correct ? "✓" : showExpl && selectedOpt === idx ? "✗" : String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {showExpl && (
        <div className="mt-3 p-3 rounded-lg bg-muted/40 border-l-2 border-primary text-[11px] text-muted-foreground animate-in slide-in-from-left-1 duration-200">
          <strong className="text-foreground block mb-0.5">Explanation:</strong>
          {q.explanation}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end">
        {!showExpl ? (
          <button
            disabled={selectedOpt === null}
            onClick={handleNext}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm disabled:opacity-50 cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}
          >
            {currentQ < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}

function CourseDetail() {
  const { course } = Route.useLoaderData() as { course: Course };
  const [enrolling, setEnrolling] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const [isEnrolled, setIsEnrolled] = useState(() => {
    try {
      const enrolled = JSON.parse(localStorage.getItem("uplearn_enrolled_courses") || "[]");
      if (enrolled.length === 0) {
        const initial = ["fullstack-mastery", "data-science-bootcamp", "ai-product"];
        localStorage.setItem("uplearn_enrolled_courses", JSON.stringify(initial));
        return initial.includes(course.id);
      }
      return enrolled.includes(course.id);
    } catch {
      return false;
    }
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const data = JSON.parse(localStorage.getItem("uplearn_completed_lessons") || "{}");
      return data[course.id] || [];
    } catch {
      return [];
    }
  });

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleEnroll = () => {
    setEnrolling(true);
    setTimeout(() => {
      try {
        const enrolled = JSON.parse(localStorage.getItem("uplearn_enrolled_courses") || "[]");
        if (!enrolled.includes(course.id)) {
          enrolled.push(course.id);
          localStorage.setItem("uplearn_enrolled_courses", JSON.stringify(enrolled));
        }
      } catch (e) {
        console.error(e);
      }
      setIsEnrolled(true);
      setEnrolling(false);
      toast.success(`Successfully enrolled in "${course.title}"!`);
    }, 800);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">← All courses</Link>
 
      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative h-64 overflow-hidden rounded-3xl shadow-lg border border-border/30 group">
            <img
              src={getCourseImage(course.category, course.title)}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          <div className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
            {course.category} · {course.level}
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{course.title}</h1>
          <p className="mt-3 text-muted-foreground">by {course.instructor}</p>
          <p className="mt-6 text-lg text-muted-foreground">{course.blurb}</p>
 
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: Clock, label: `${course.hours}h content` },
              { icon: BookOpen, label: `${course.lessons} lessons` },
              { icon: Users, label: `${course.students.toLocaleString()} learners` },
              { icon: Award, label: "Certificate" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-sm">
                <s.icon className="h-4 w-4 text-primary" />
                {s.label}
              </div>
            ))}
          </div>
 
          <h2 className="mt-12 text-2xl font-semibold">Curriculum</h2>
          <div className="mt-4 space-y-3">
            {course.modules.map((m, i) => (
              <div key={m.title} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Module {i + 1}</div>
                    <div className="font-semibold">{m.title}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{m.lessons.length} lessons</div>
                </div>
                <div className="divide-y divide-border">
                  {m.lessons.map((l) => {
                    const isExpanded = expandedLesson === l;
                    const isCompleted = completedLessons.includes(l);
                    const details = getLessonDetails(l, course.title);
                    return (
                      <div key={l} className="border-b border-border/40 last:border-b-0">
                        <button
                          onClick={() => toggleLesson(l)}
                          className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium hover:bg-muted/40 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className={`h-4 w-4 transition-colors ${
                              isCompleted ? "text-accent" : isExpanded ? "text-primary animate-pulse" : "text-muted-foreground group-hover:text-foreground"
                            }`} />
                            <span className={isExpanded ? "text-primary font-semibold" : isCompleted ? "text-accent font-medium line-through decoration-accent/40" : "text-foreground"}>
                              {l}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-semibold text-accent bg-accent/15 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                            {details.duration}
                          </span>
                        </button>
                        
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 text-sm bg-muted/20 border-t border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="space-y-3">
                              <div className="text-xs leading-relaxed text-muted-foreground">
                                <span className="font-semibold text-foreground block mb-1">Learning Objective:</span>
                                {details.objective}
                              </div>
                              
                              <div>
                                <span className="font-semibold text-foreground text-xs block mb-1">Key Topics Covered:</span>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                                  {details.topics.map((topic, index) => (
                                    <li key={index} className="flex items-center gap-1.5">
                                      <span className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* Playable Mini Quiz Widget */}
                              <InteractiveQuiz
                                courseId={course.id}
                                lessonName={l}
                                courseTitle={course.title}
                                onComplete={() => setCompletedLessons(prev => [...prev, l])}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
 
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="text-sm text-muted-foreground">Course Access</div>
            <div className="mt-1 text-4xl font-semibold text-accent">Free</div>
            <div className="mt-1 text-xs text-accent font-medium">100% Free Lifetime Access</div>
 
            {isEnrolled ? (
              <Link
                to="/dashboard"
                className="mt-6 flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px]"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                Go to dashboard
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-lg disabled:opacity-60 transition hover:translate-y-[-1px] cursor-pointer"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                {enrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Enrolling...
                  </span>
                ) : (
                  "Enroll now"
                )}
              </button>
            )}
 
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {["Lifetime access", "Live cohort calls", "Auto-graded assignments", "Certificate on completion", "Cohort community"].map((b) => (
                <li key={b} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> {b}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}