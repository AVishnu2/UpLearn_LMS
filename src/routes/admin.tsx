import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, BookOpen, Award, TrendingUp, Settings, 
  UserCheck, UserMinus, UserPlus, Bell, CheckCircle2, AlertTriangle, 
  Search, Filter, Activity, Server, Database, RefreshCw, Sparkles, ArrowRight
} from "lucide-react";
import { useAuth, type Role } from "@/hooks/useAuth";
import { useRealtimeTable, type DbAnnouncement, type DbCourse } from "@/hooks/useRealtime";
import { supabase } from "@/integrations/supabase/client";
import { courses as staticCourses } from "@/data/lms";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — UpLearnLMS" },
      { name: "description", content: "Master administration, user role management, system analytics, and course governance." },
    ],
  }),
  component: AdminDashboard,
});

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
  status: "active" | "suspended";
};

const INITIAL_USERS: AdminUser[] = [
  { id: "u-1", name: "Alex Johnson", email: "student@uplearn.io", role: "student", joinedAt: "2026-04-12", status: "active" },
  { id: "u-2", name: "Dr. Ananya Sharma", email: "faculty@uplearn.io", role: "faculty", joinedAt: "2026-03-20", status: "active" },
  { id: "u-3", name: "Vikram Malhotra", email: "admin@uplearn.io", role: "admin", joinedAt: "2026-01-10", status: "active" },
  { id: "u-4", name: "Sneha Patel", email: "sneha.p@example.com", role: "student", joinedAt: "2026-05-02", status: "active" },
  { id: "u-5", name: "Karan Verma", email: "karan.v@example.com", role: "faculty", joinedAt: "2026-02-15", status: "active" },
  { id: "u-6", name: "Rohan Mehta", email: "rohan.m@example.com", role: "student", joinedAt: "2026-05-18", status: "active" },
  { id: "u-7", name: "Pooja Hegde", email: "pooja.h@example.com", role: "student", joinedAt: "2026-05-22", status: "active" },
  { id: "u-8", name: "Maya Iyer", email: "maya.i@example.com", role: "faculty", joinedAt: "2026-03-01", status: "active" },
];

export function AdminDashboard() {
  const { user, role, switchRole, loginAsDemo } = useAuth();
  const nav = useNavigate();
  const { rows: announcements } = useRealtimeTable<DbAnnouncement>("announcements");
  const { rows: liveCourses } = useRealtimeTable<DbCourse>("courses");

  const [activeTab, setActiveTab] = useState<"users" | "courses" | "announcements" | "system">("users");
  const [usersList, setUsersList] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem("uplearn_admin_users");
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_USERS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeBody, setNewNoticeBody] = useState("");
  const [isPostingNotice, setIsPostingNotice] = useState(false);
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // New user form state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>("student");

  // Save users list
  const saveUsers = (updated: AdminUser[]) => {
    setUsersList(updated);
    try {
      localStorage.setItem("uplearn_admin_users", JSON.stringify(updated));
    } catch {}
  };

  // Change user role
  const handleRoleChange = (userId: string, newRole: Role) => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    saveUsers(updated);

    // If changing currently logged in user's role
    if (user && (user.id === userId || user.email === usersList.find((u) => u.id === userId)?.email)) {
      switchRole(newRole);
    }
  };

  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    const updated = usersList.map((u) => 
      u.id === userId ? { ...u, status: u.status === "active" ? ("suspended" as const) : ("active" as const) } : u
    );
    saveUsers(updated);
  };

  // Add new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: AdminUser = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      joinedAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    saveUsers([newUser, ...usersList]);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUserModal(false);
  };

  // Post announcement
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeBody.trim()) return;

    setIsPostingNotice(true);
    try {
      await supabase.from("announcements").insert({
        title: newNoticeTitle.trim(),
        body: newNoticeBody.trim(),
        created_by: user?.id || null,
      });
    } catch {}

    setNewNoticeTitle("");
    setNewNoticeBody("");
    setIsPostingNotice(false);
    setNoticeSuccess(true);
    setTimeout(() => setNoticeSuccess(false), 3000);
  };

  // Access Control: Check if user has admin privileges
  if (role !== "admin") {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Admin Privileges Required
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The Admin Portal is restricted to platform administrators. Your current role is{" "}
          <span className="font-semibold capitalize text-foreground">{role || "unauthenticated"}</span>.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3">
          {role === "faculty" && (
            <Link
              to="/faculty"
              className="rounded-xl border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted"
            >
              Back to Faculty Portal
            </Link>
          )}

          {role === "student" && (
            <Link
              to="/dashboard"
              className="rounded-xl border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted"
            >
              Back to Student Dashboard
            </Link>
          )}

          {!user && (
            <Link
              to="/auth"
              className="rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md"
              style={{ background: "var(--gradient-primary)" }}
            >
              Sign In with Administrator Account
            </Link>
          )}
        </div>
      </main>
    );
  }

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const studentCount = usersList.filter((u) => u.role === "student").length;
  const facultyCount = usersList.filter((u) => u.role === "faculty").length;
  const adminCount = usersList.filter((u) => u.role === "admin").length;
  const totalCourses = staticCourses.length + liveCourses.length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
            </span>
            <span className="text-xs text-muted-foreground">Session: {user?.email}</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            System Administration & Control
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage users, assign role-based permissions, govern courses, and monitor platform health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/faculty"
            className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted"
          >
            Open Faculty View →
          </Link>
          <Link
            to="/dashboard"
            className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted"
          >
            Open Student View →
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Users
            </span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-3 text-3xl font-bold">{usersList.length}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-blue-500">{studentCount} Students</span> ·{" "}
            <span className="font-semibold text-emerald-500">{facultyCount} Faculty</span> ·{" "}
            <span className="font-semibold text-purple-500">{adminCount} Admins</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Published Courses
            </span>
            <BookOpen className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-bold">{totalCourses}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {liveCourses.length} created via portal · 100% Free Access
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Certificates Issued
            </span>
            <Award className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-3 text-3xl font-bold">1,480+</div>
          <p className="mt-1 text-xs text-muted-foreground">Instant cryptographic verification</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Platform Status
            </span>
            <Server className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-3 flex items-center gap-2 text-2xl font-bold text-emerald-500">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            100% Online
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Edge CDN & Supabase Realtime active</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border pb-3">
        {[
          { key: "users", label: "User & Role Management", icon: Users },
          { key: "courses", label: "Course Governance", icon: BookOpen },
          { key: "announcements", label: "Institute Announcements", icon: Bell },
          { key: "system", label: "Audit & Security Logs", icon: Activity },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: User & Role Management */}
      {activeTab === "users" && (
        <section className="mt-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 text-xs">
                {(["all", "student", "faculty", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`rounded-lg px-2.5 py-1 capitalize transition ${
                      roleFilter === r
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90"
              style={{ background: "var(--gradient-primary)" }}
            >
              <UserPlus className="h-4 w-4" /> Add User
            </button>
          </div>

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                <h3 className="text-lg font-bold">Add New Platform User</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a user profile and immediately assign their system role.
                </p>

                <form onSubmit={handleAddUser} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground">Full Name</label>
                    <input
                      required
                      placeholder="Jane Doe"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground">Role</label>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      {(["student", "faculty", "admin"] as const).map((r) => (
                        <button
                          type="button"
                          key={r}
                          onClick={() => setNewUserRole(r)}
                          className={`rounded-lg border py-2 text-xs font-medium capitalize ${
                            newUserRole === r
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">User</th>
                    <th className="px-5 py-3.5 font-semibold">Current Role</th>
                    <th className="px-5 py-3.5 font-semibold">Joined</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="transition hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            u.role === "admin"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                              : u.role === "faculty"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{u.joinedAt}</td>

                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {u.status}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground mr-1">Switch:</span>
                          {(["student", "faculty", "admin"] as const).map((r) => (
                            <button
                              key={r}
                              disabled={u.role === r}
                              onClick={() => handleRoleChange(u.id, r)}
                              className={`rounded-lg px-2 py-1 text-xs capitalize transition ${
                                u.role === r
                                  ? "bg-muted font-bold opacity-40 cursor-default"
                                  : "border border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No users match the search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Course Governance */}
      {activeTab === "courses" && (
        <section className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold">Course Catalog Governance</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Review published curriculum, verify instructor assignments, and monitor enrollments.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...liveCourses, ...staticCourses].map((c: any) => (
                <div key={c.id} className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {c.category || "General"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" /> Approved
                      </span>
                    </div>
                    <h3 className="mt-2 font-bold line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">Instructor: {c.instructor}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                    <span className="text-muted-foreground">{c.hours || 8}h · {c.lessons || 12} lessons</span>
                    <Link
                      to={`/courses/${c.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      Inspect Course →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Announcements */}
      {activeTab === "announcements" && (
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold">Broadcast Announcement</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Send global updates that sync in real-time to all Student and Faculty dashboards.
            </p>

            <form onSubmit={handlePostAnnouncement} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground">Notice Title</label>
                <input
                  required
                  placeholder="e.g. System Maintenance & Exam Schedule Update"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground">Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write message to students and instructors..."
                  value={newNoticeBody}
                  onChange={(e) => setNewNoticeBody(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {noticeSuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-600">
                  Announcement broadcasted successfully to all users!
                </div>
              )}

              <button
                type="submit"
                disabled={isPostingNotice}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Bell className="h-4 w-4" />
                {isPostingNotice ? "Broadcasting..." : "Broadcast Notice"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold">Recent Announcements</h2>
            <p className="mt-1 text-xs text-muted-foreground">Live feed of institute communications.</p>

            <div className="mt-4 space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-xl border border-border bg-background p-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{a.title}</h4>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{a.body}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  No announcements broadcasted yet.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Audit & Security Logs */}
      {activeTab === "system" && (
        <section className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold">System Audit & Security Logs</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Real-time security telemetry, access audits, and role modification history.
            </p>

            <div className="mt-4 space-y-2.5 font-mono text-xs">
              {[
                { time: "Just now", type: "AUTH", msg: `Admin session verified for user: ${user?.email}`, level: "info" },
                { time: "2 mins ago", type: "ROLE_GATE", msg: "Role verification executed: student, faculty, admin policies enforced", level: "info" },
                { time: "14 mins ago", type: "DB_SYNC", msg: "Supabase realtime publication channel verified: courses, announcements", level: "info" },
                { time: "1 hour ago", type: "SECURITY", msg: "TLS 1.3 handshake enforced; SSL Certificate active", level: "success" },
                { time: "3 hours ago", type: "STORAGE", msg: "Persistent local store snapshot generated successfully", level: "info" },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5">
                  <span className="text-muted-foreground shrink-0">{log.time}</span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">{log.type}</span>
                  <span className="flex-1 text-foreground">{log.msg}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
