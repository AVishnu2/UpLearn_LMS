import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, type Role } from "@/hooks/useAuth";
import { GraduationCap, ShieldCheck, Briefcase, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — UpLearnLMS" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function navigateForRole(r?: Role | null) {
    if (r === "admin") {
      nav({ to: "/admin" });
    } else if (r === "faculty") {
      nav({ to: "/faculty" });
    } else {
      nav({ to: "/dashboard" });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    if (mode === "signin") {
      const res = await signIn(email, password);
      setBusy(false);
      if (res.error) {
        setErr(res.error);
        return;
      }
      navigateForRole(res.role);
    } else {
      const res = await signUp(email, password, fullName.trim() || email.split("@")[0], role);
      setBusy(false);
      if (res.error) {
        setErr(res.error);
        return;
      }
      navigateForRole(res.role || role);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl shadow-sm" style={{ background: "var(--gradient-primary)" }}>
          <GraduationCap className="h-5 w-5 text-background" />
        </span>
        <span className="text-xl font-bold tracking-tight">UpLearn<span className="text-muted-foreground">LMS</span></span>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card/80 p-6 md:p-8 backdrop-blur shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {mode === "signin" ? "Sign in to UpLearn" : "Create an account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" 
            ? "Enter your email and password to access your role-based portal." 
            : "Register with your role to get access to tailored tools."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <Field label="Full Name">
                <input
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>

              <Field label="Select Your Role">
                <div className="grid grid-cols-3 gap-2">
                  {(["student", "faculty", "admin"] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center rounded-xl border p-2.5 text-xs font-semibold capitalize transition ${
                        role === r
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {r === "student" && <BookOpen className="mb-1 h-4 w-4 text-blue-500" />}
                      {r === "faculty" && <Briefcase className="mb-1 h-4 w-4 text-emerald-500" />}
                      {r === "admin" && <ShieldCheck className="mb-1 h-4 w-4 text-purple-500" />}
                      {r}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          <Field label="Email Address">
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Field>

          {err && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              <p className="font-semibold">{err}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-95 disabled:opacity-60"
            style={{ background: "var(--gradient-primary)" }}
          >
            {busy ? "Authenticating..." : mode === "signin" ? "Sign In" : "Create Account"}
            {!busy && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setErr(null);
            }}
            className="hover:text-foreground hover:underline"
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
          <Link to="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
