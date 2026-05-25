# 🎓 UpLearnLMS — All-in-One Learning Management System

> **Built for the EdTech LMS Hackathon** — One platform replacing 6 disconnected tools.

UpLearnLMS unifies **courses, live classes, assignments, fee collection, communities and certifications** for institutes, coaching centers and cohort programs — all in one beautiful, modern interface.

---

## 🚀 Live Features

| Feature | Description |
|---|---|
| 📚 **Courses & Marketplace** | Publish, sell and manage digital courses with rich content, quizzes and certificates |
| 🎥 **Live Classes** | Schedule cohort calls, record sessions and stream straight to the student portal |
| 💳 **Fees & Reminders** | Installments, auto-reminders and reconciliation — built for Indian institutes |
| 💬 **Community & Chats** | Cohort groups, DMs, announcements and parent updates in one inbox |
| 🏆 **Auto Certificates** | Generate PDF certificates the moment a learner crosses the finish line |
| 👥 **Batch Management** | Group students by batch, assign faculty, track attendance and progress |
| 🔐 **Authentication** | Secure sign-up / sign-in with Supabase Auth |
| 📊 **Student Dashboard** | Progress tracking, enrolled courses, activity feed |
| 👨‍🏫 **Faculty Portal** | Manage students, assignments and course content |

---

## 🛠️ Tech Stack

### ⚛️ Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | v19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | v5.8 | Type-safe JavaScript |
| [TanStack Router](https://tanstack.com/router) | v1.168 | File-based routing |
| [TanStack Query](https://tanstack.com/query) | v5.83 | Server state management & data fetching |
| [TanStack Start](https://tanstack.com/start) | v1.167 | Full-stack React framework |

### 🎨 Styling & UI

| Technology | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | latest | Pre-built accessible UI components |
| [Radix UI](https://www.radix-ui.com/) | latest | Headless accessible component primitives |
| [Lucide React](https://lucide.dev/) | v0.575 | Beautiful open-source icons |
| [Recharts](https://recharts.org/) | v2.15 | Chart & data visualization library |
| [Embla Carousel](https://www.embla-carousel.com/) | v8.6 | Lightweight carousel/slider |
| [Sonner](https://sonner.emilkowal.ski/) | v2 | Toast notification library |
| [Vaul](https://vaul.emilkowal.ski/) | v1.1 | Drawer component |

### 🗄️ Backend & Database

| Technology | Version | Purpose |
|---|---|---|
| [Supabase](https://supabase.com/) | v2.106 | Backend-as-a-service (PostgreSQL + Auth + Realtime) |
| [Supabase Auth](https://supabase.com/auth) | — | User authentication & session management |
| [Supabase Realtime](https://supabase.com/realtime) | — | Live data updates & subscriptions |

### 🏗️ Build & Infrastructure

| Technology | Version | Purpose |
|---|---|---|
| [Vite](https://vitejs.dev/) | v7.3 | Lightning-fast build tool & dev server |
| [Cloudflare Workers](https://workers.cloudflare.com/) | — | Edge deployment & serverless runtime |
| [@cloudflare/vite-plugin](https://github.com/cloudflare/workers-sdk) | v1.25 | Cloudflare integration for Vite |
| [Bun](https://bun.sh/) | latest | Fast JavaScript runtime & package manager |

### 📋 Forms & Validation

| Technology | Version | Purpose |
|---|---|---|
| [React Hook Form](https://react-hook-form.com/) | v7.71 | Performant form state management |
| [Zod](https://zod.dev/) | v3.24 | Schema validation & type inference |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | v5.2 | Connects Zod with React Hook Form |

### 🧰 Utilities

| Technology | Purpose |
|---|---|
| [date-fns](https://date-fns.org/) | Date formatting & manipulation |
| [clsx](https://github.com/lukeed/clsx) | Conditional CSS class merging |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Tailwind class conflict resolution |
| [class-variance-authority](https://cva.style/) | Component variant styling |

---

## 📁 Project Structure

```
src/
├── assets/
│   └── images/          # Course cover images
├── components/
│   ├── SiteHeader.tsx   # Global navigation header
│   └── ui/              # shadcn/ui component library
├── data/
│   └── lms.ts           # Static course & LMS data
├── hooks/
│   ├── useAuth.tsx      # Authentication hook
│   └── useRealtime.ts   # Supabase realtime hook
├── integrations/
│   └── supabase/        # Supabase client, types & middleware
├── lib/
│   └── utils.ts         # Shared utility functions
├── routes/              # File-based pages (TanStack Router)
│   ├── index.tsx        # Landing page
│   ├── auth.tsx         # Login / Sign-up
│   ├── dashboard.tsx    # Student dashboard
│   ├── courses.tsx      # Courses layout
│   ├── courses.index.tsx       # Course listing
│   ├── courses.$courseId.tsx   # Course detail
│   ├── faculty.tsx      # Faculty portal
│   └── certification.tsx       # Certificate generation
├── router.tsx           # Router configuration
└── styles.css           # Global styles & design tokens
supabase/
└── migrations/          # Database migration files
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18 or [Bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) project

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install
# or with bun
bun install
```

### Environment Variables

Create a `.env` file in the root directory (never commit this file!):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Dev Server

```bash
npm run dev
# App will be available at http://localhost:8080
```

### Build for Production

```bash
npm run build
```

---

## 🔐 Environment & Security

- `.env` is listed in `.gitignore` and will **never** be committed to the repository.
- Use `.env.example` as a template for required environment variables.
- All secrets are accessed via `import.meta.env` in Vite.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 🏆 Hackathon

Built with ♥ for the **EdTech LMS Hackathon** — UpLearnLMS

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
