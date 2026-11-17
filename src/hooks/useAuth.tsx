import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "student" | "faculty" | "admin";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user?: User; role?: Role; error?: string }>;
  signUp: (email: string, password: string, fullName: string, role: Role) => Promise<{ user?: User; role?: Role; error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY_ROLE = "uplearn_user_role";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  // Resolve user's actual role from metadata or user_roles table
  async function resolveRole(u: User): Promise<Role> {
    // 1. Check user metadata
    if (u.user_metadata?.role && ["student", "faculty", "admin"].includes(u.user_metadata.role)) {
      return u.user_metadata.role as Role;
    }
    // 2. Query user_roles table
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id);
      const roles = (data ?? []).map((r: any) => r.role as Role);
      if (roles.includes("admin")) return "admin";
      if (roles.includes("faculty")) return "faculty";
      if (roles.includes("student")) return "student";
    } catch {
      // ignore
    }
    // 3. Fallback to cached role
    const cached = localStorage.getItem(STORAGE_KEY_ROLE) as Role | null;
    if (cached && ["student", "faculty", "admin"].includes(cached)) {
      return cached;
    }
    return "student";
  }

  useEffect(() => {
    let mounted = true;

    // Listen to Supabase auth events
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const resolvedRole = await resolveRole(s.user);
        setRole(resolvedRole);
        localStorage.setItem(STORAGE_KEY_ROLE, resolvedRole);
      } else {
        setRole(null);
        localStorage.removeItem(STORAGE_KEY_ROLE);
      }
      setLoading(false);
    });

    // Check existing session on boot
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const resolvedRole = await resolveRole(data.session.user);
        setRole(resolvedRole);
        localStorage.setItem(STORAGE_KEY_ROLE, resolvedRole);
      }
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const resolvedRole = await resolveRole(data.user);
        setRole(resolvedRole);
        localStorage.setItem(STORAGE_KEY_ROLE, resolvedRole);
        return { user: data.user, role: resolvedRole };
      }

      return { error: "Failed to sign in. Please try again." };
    } catch (err: any) {
      return { error: err.message || "An unexpected error occurred during sign in." };
    }
  };

  const signUp: AuthCtx["signUp"] = async (email, password, fullName, signupRole) => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = fullName.trim() || cleanEmail.split("@")[0];

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: displayName,
            role: signupRole,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        setRole(signupRole);
        localStorage.setItem(STORAGE_KEY_ROLE, signupRole);

        // If session was not returned immediately, sign in
        if (!data.session) {
          const loginRes = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (loginRes.data?.session) {
            setSession(loginRes.data.session);
            setUser(loginRes.data.user);
          }
        }

        // Ensure user_roles has the role
        try {
          await supabase.from("user_roles").upsert({
            user_id: data.user.id,
            role: signupRole,
          });
        } catch {}

        return { user: data.user, role: signupRole };
      }

      return { error: "Registration could not be completed. Please try again." };
    } catch (err: any) {
      return { error: err.message || "An unexpected error occurred during registration." };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY_ROLE);
    setUser(null);
    setRole(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch {}
  };

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        role,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
