import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap } from "lucide-react";

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
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const res = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, fullName || email.split("@")[0], role);
    setBusy(false);
    if (res.error) return setErr(res.error);
    if (mode === "signup") {
      const r = await signIn(email, password);
      if (r.error) return setErr(r.error);
    }
    nav({ to: role === "faculty" ? "/faculty" : "/dashboard" });
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
          <GraduationCap className="h-5 w-5 text-background" />
        </span>
        <span className="text-lg font-semibold">UpLearnLMS</span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "signin" ? "Sign in to continue learning." : "No email confirmation needed — instant access."}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <>
            <Field label="Full name">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </Field>
            <Field label="I am a">
              <div className="grid grid-cols-2 gap-2">
                {(["student", "faculty"] as const).map((r) => (
                  <button type="button" key={r} onClick={() => setRole(r)}
                    className={`rounded-lg border px-3 py-2 text-sm capitalize ${role === r ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}
        <Field label="Email">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Password">
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>

        {err && <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</div>}

        <button type="submit" disabled={busy}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground shadow-md disabled:opacity-60"
          style={{ background: "var(--gradient-primary)" }}>
          {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); }}
        className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground">
        {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </button>
      <Link to="/" className="mt-2 text-center text-xs text-muted-foreground hover:text-foreground">← Back to home</Link>
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