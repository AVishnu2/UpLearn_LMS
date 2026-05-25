import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/dashboard", label: "Student" },
  { to: "/faculty", label: "Faculty" },
  { to: "/certification", label: "Certification" },
] as const;

export function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="h-5 w-5 text-background" />
          </span>
          <span className="text-lg font-semibold tracking-tight">UpLearn<span className="text-muted-foreground">LMS</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm text-foreground bg-muted" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {role ?? "..."} · {user.email}
            </span>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}