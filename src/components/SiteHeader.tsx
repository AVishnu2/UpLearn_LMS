import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut, ShieldCheck, Briefcase, BookOpen } from "lucide-react";
import { useAuth, type Role } from "@/hooks/useAuth";

export function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  // Navigation links based strictly on the authenticated user's role
  const navItems = [
    { to: "/", label: "Home", show: true },
    { to: "/courses", label: "Courses", show: true },
    {
      to: "/dashboard",
      label: role === "admin" ? "Student View" : "My Dashboard",
      show: role === "student" || role === "admin",
    },
    {
      to: "/faculty",
      label: role === "admin" ? "Faculty View" : "Faculty Portal",
      show: role === "faculty" || role === "admin",
    },
    {
      to: "/admin",
      label: "Admin Portal",
      show: role === "admin",
    },
    { to: "/certification", label: "Certification", show: true },
  ];

  const getRoleBadge = (r: Role | null) => {
    switch (r) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin
          </span>
        );
      case "faculty":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Briefcase className="h-3.5 w-3.5" /> Faculty
          </span>
        );
      case "student":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <BookOpen className="h-3.5 w-3.5" /> Student
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl shadow-sm" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="h-5 w-5 text-background" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            UpLearn<span className="text-muted-foreground">LMS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems
            .filter((n) => n.show)
            .map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-muted" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
        </nav>

        {/* User Status / Auth Controls */}
        {user ? (
          <div className="flex items-center gap-3">
            {getRoleBadge(role)}

            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
              {user.user_metadata?.full_name || user.email}
            </span>

            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition hover:opacity-95"
              style={{ background: "var(--gradient-primary)" }}
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
