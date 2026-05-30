import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { TrendingUp, Users, GraduationCap, CheckCircle2, Clock, AlertCircle, Megaphone, Plus, Loader2, Calendar, FileSpreadsheet, MessageSquare, Send, Sparkles, X, Bot, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeTable, type DbAnnouncement, type DbCourse } from "@/hooks/useRealtime";
import { supabase } from "@/integrations/supabase/client";
import { courses as staticCourses } from "@/data/lms";


export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty Dashboard — UpLearnLMS" },
      { name: "description", content: "Manage cohorts, attendance, assignments, and student progress." },
    ],
  }),
  component: FacultyDashboard,
});

const batches = [
  { name: "Web Dev — Cohort 11", students: 64, attendance: 92 },
  { name: "Data Science — Batch B", students: 41, attendance: 87 },
  { name: "UX Pro — Evening", students: 28, attendance: 96 },
];

function FacultyDashboard() {
  const { user, role, loading } = useAuth();
  const { rows: announcements } = useRealtimeTable<DbAnnouncement>("announcements");
  const { rows: liveCourses } = useRealtimeTable<DbCourse>("courses");
  const canManage = role === "faculty" || role === "admin";
  const [profiles, setProfiles] = useState<any[]>([]);
  const [allUserRoles, setAllUserRoles] = useState<any[]>([]);
  const [editingCourse, setEditingCourse] = useState<DbCourse | null>(null);

  // States for Assignments & Live Classes
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [liveClassesList, setLiveClassesList] = useState<any[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [editingLiveClass, setEditingLiveClass] = useState<any | null>(null);

  // Sync data on load
  useEffect(() => {
    // Registered students count
    supabase
      .from("profiles")
      .select("*")
      .then(({ data }) => {
        if (data) {
          setProfiles(data);
        }
      });

    // Fetch user roles
    supabase
      .from("user_roles")
      .select("*")
      .then(({ data }) => {
        if (data) {
          setAllUserRoles(data);
        }
      });

    try {
      // Assignments
      const storedAssignments = localStorage.getItem("uplearn_assignments");
      if (storedAssignments) {
        setAssignmentsList(JSON.parse(storedAssignments));
      } else {
        const defaultAssignments = [
          { id: "a1", course: "Full-Stack Web Development Mastery", title: "Build a REST API with auth", dueIn: "2 days", status: "pending" },
          { id: "a2", course: "Applied Data Science Bootcamp", title: "EDA on Titanic dataset", dueIn: "5 days", status: "in-progress" },
          { id: "a3", course: "UX Design Pro: From Research to Ship", title: "Heuristic audit", dueIn: "Submitted", status: "graded", grade: "A" }
        ];
        localStorage.setItem("uplearn_assignments", JSON.stringify(defaultAssignments));
        setAssignmentsList(defaultAssignments);
      }

      // Live Classes
      const storedLive = localStorage.getItem("uplearn_live_classes");
      if (storedLive) {
        setLiveClassesList(JSON.parse(storedLive));
      } else {
        const defaultLive = [
          { id: "l1", title: "React Server Components — Deep Dive", course: "Full-Stack Web Development Mastery", at: "Today, 6:30 PM", instructor: "Dr. Ananya Sharma" },
          { id: "l2", title: "Building a RAG pipeline live", course: "Building AI Products", at: "Tomorrow, 8:00 PM", instructor: "Karan Verma" },
          { id: "l3", title: "Cohort Q&A", course: "UX Design Pro: From Research to Ship", at: "Fri, 7:00 PM", instructor: "Maya Iyer" }
        ];
        localStorage.setItem("uplearn_live_classes", JSON.stringify(defaultLive));
        setLiveClassesList(defaultLive);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Map database courses to structured objects
  const mappedLiveCourses = liveCourses.map((lc) => ({
    id: lc.id,
    title: lc.title,
    instructor: lc.instructor,
    category: lc.category,
    price: 0,
    rating: 5.0,
    students: 128,
    lessons: 12,
    hours: 8,
    level: lc.level || "Beginner",
    cover: lc.cover || "from-fuchsia-500 to-violet-600",
    blurb: lc.blurb || ""
  }));

  const allCourses = [...staticCourses, ...mappedLiveCourses];

  const studentCount = profiles.length;
  const webDevStudents = profiles.filter((_, idx) => idx % 3 === 0);
  const dataScienceStudents = profiles.filter((_, idx) => idx % 3 === 1);
  const uxProStudents = profiles.filter((_, idx) => idx % 3 === 2);

  const dynamicBatches = [
    { name: "Web Dev — Cohort 11", students: webDevStudents.length, attendance: webDevStudents.length > 0 ? 92 : 0 },
    { name: "Data Science — Batch B", students: dataScienceStudents.length, attendance: dataScienceStudents.length > 0 ? 87 : 0 },
    { name: "UX Pro — Evening", students: uxProStudents.length, attendance: uxProStudents.length > 0 ? 96 : 0 },
  ];

  const liveCohortsCount = dynamicBatches.filter((b) => b.students > 0).length;

  if (loading) {
    return <main className="mx-auto max-w-7xl px-6 py-20 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></main>;
  }
  if (!user) {
    return (
      <main className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Faculty portal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please sign in to access faculty tools.</p>
        <Link to="/auth" className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>Sign in</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header>
        <p className="text-sm text-muted-foreground">Faculty · {role}</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Institute overview</h1>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: Users, k: String(studentCount), v: "Active students", trend: "Live" },
          { icon: GraduationCap, k: String(liveCohortsCount), v: "Live cohorts", trend: "Active" },
          { icon: TrendingUp, k: studentCount > 0 ? "94%" : "0%", v: "Course completion", trend: "Top Rate" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-accent">{s.trend}</span>
            </div>
            <div className="mt-4 text-2xl font-semibold">{s.k}</div>
            <div className="text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Active batches</h2>
            <div className="mt-4 space-y-4">
              {dynamicBatches.map((b) => (
                <div key={b.name} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.students} {b.students === 1 ? "student" : "students"}</div>
                  </div>
                  <div className="mt-3">
                    <Meter label="Attendance" value={b.attendance} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manage Assignments Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-1.5"><FileSpreadsheet className="h-5 w-5 text-primary" /> Manage Assignments ({assignmentsList.length})</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-5 py-3">Due</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignmentsList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center text-muted-foreground text-xs">No assignments scheduled yet.</td>
                    </tr>
                  )}
                  {assignmentsList.map((a) => (
                    <tr key={a.id}>
                      <td className="px-5 py-3 font-medium">{a.title}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{a.course}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{a.dueIn}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          a.status === "graded" ? "bg-accent/20 text-accent" : a.status === "in-progress" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {a.status === "graded" ? `Graded · ${a.grade || "A"}` : a.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingAssignment(a)}
                            className="text-xs text-muted-foreground hover:text-primary transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete assignment "${a.title}"?`)) {
                                const updated = assignmentsList.filter(item => item.id !== a.id);
                                setAssignmentsList(updated);
                                localStorage.setItem("uplearn_assignments", JSON.stringify(updated));
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-destructive transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manage Live Classes Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-1.5"><Calendar className="h-5 w-5 text-primary" /> Manage Live Classes ({liveClassesList.length})</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-5 py-3">Timing</th>
                    <th className="px-5 py-3">Instructor</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {liveClassesList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 text-center text-muted-foreground text-xs">No live classes scheduled.</td>
                    </tr>
                  )}
                  {liveClassesList.map((l) => (
                    <tr key={l.id}>
                      <td className="px-5 py-3 font-medium text-xs md:text-sm">{l.title}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{l.course}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{l.at}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{l.instructor}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingLiveClass(l)}
                            className="text-xs text-muted-foreground hover:text-primary transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete live class "${l.title}"?`)) {
                                const updated = liveClassesList.filter(item => item.id !== l.id);
                                setLiveClassesList(updated);
                                localStorage.setItem("uplearn_live_classes", JSON.stringify(updated));
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-destructive transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          {canManage && (
            <ComposerCard
              editingCourse={editingCourse}
              clearEditing={() => setEditingCourse(null)}
              editingAssignment={editingAssignment}
              clearEditingAssignment={() => setEditingAssignment(null)}
              editingLiveClass={editingLiveClass}
              clearEditingLiveClass={() => setEditingLiveClass(null)}
              assignmentsList={assignmentsList}
              setAssignmentsList={setAssignmentsList}
              liveClassesList={liveClassesList}
              setLiveClassesList={setLiveClassesList}
              allCourses={allCourses}
            />
          )}
          <AnnouncementsCard rows={announcements} canManage={canManage} />
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Live courses ({liveCourses.length})</h2>
            <ul className="mt-4 space-y-3">
              {liveCourses.length === 0 && <li className="text-sm text-muted-foreground">No courses yet — add one above.</li>}
              {liveCourses.slice(0, 10).map((c, i) => (
                <li key={c.id} className="flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="line-clamp-1 text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.instructor} · {c.category} · <span className="text-accent font-semibold">Free</span></div>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                        }}
                        className="text-xs text-muted-foreground hover:text-primary transition cursor-pointer px-2 py-1 rounded hover:bg-primary/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete course "${c.title}"?`)) {
                            const { error } = await supabase.from("courses").delete().eq("id", c.id);
                            if (error) {
                              alert(error.message);
                            }
                          }
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive transition cursor-pointer px-2 py-1 rounded hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <ChatbotWidget
        profiles={profiles}
        allUserRoles={allUserRoles}
        currentUser={user}
        liveCourses={liveCourses}
        announcements={announcements}
        assignmentsList={assignmentsList}
        liveClassesList={liveClassesList}
        liveCohortsCount={liveCohortsCount}
        dynamicBatches={dynamicBatches}
      />
    </main>
  );
}

function ComposerCard({
  editingCourse,
  clearEditing,
  editingAssignment,
  clearEditingAssignment,
  editingLiveClass,
  clearEditingLiveClass,
  assignmentsList,
  setAssignmentsList,
  liveClassesList,
  setLiveClassesList,
  allCourses
}: {
  editingCourse: DbCourse | null;
  clearEditing: () => void;
  editingAssignment: any | null;
  clearEditingAssignment: () => void;
  editingLiveClass: any | null;
  clearEditingLiveClass: () => void;
  assignmentsList: any[];
  setAssignmentsList: React.Dispatch<React.SetStateAction<any[]>>;
  liveClassesList: any[];
  setLiveClassesList: React.Dispatch<React.SetStateAction<any[]>>;
  allCourses: any[];
}) {
  const [tab, setTab] = useState<"announcement" | "course" | "assignment" | "live class">("announcement");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // announcement fields
  const [aTitle, setATitle] = useState("");
  const [aBody, setABody] = useState("");

  // course fields
  const [cTitle, setCTitle] = useState("");
  const [cInstructor, setCInstructor] = useState("");
  const [cCategory, setCCategory] = useState("Development");
  const [cBlurb, setCBlurb] = useState("");

  // assignment fields
  const [asgTitle, setAsgTitle] = useState("");
  const [asgCourse, setAsgCourse] = useState("");
  const [asgDueIn, setAsgDueIn] = useState("3 days");
  const [asgStatus, setAsgStatus] = useState("pending");
  const [asgGrade, setAsgGrade] = useState("");

  // live class fields
  const [lcTitle, setLcTitle] = useState("");
  const [lcCourse, setLcCourse] = useState("");
  const [lcAt, setLcAt] = useState("Today, 6:30 PM");
  const [lcInstructor, setLcInstructor] = useState("");

  // Sync selectors
  useEffect(() => {
    if (allCourses.length > 0) {
      if (!asgCourse) setAsgCourse(allCourses[0].title);
      if (!lcCourse) setLcCourse(allCourses[0].title);
    }
  }, [allCourses]);

  // Load course details
  useEffect(() => {
    if (editingCourse) {
      setTab("course");
      setCTitle(editingCourse.title);
      setCInstructor(editingCourse.instructor);
      setCCategory(editingCourse.category);
      setCBlurb(editingCourse.blurb);
      setMsg(null);
    }
  }, [editingCourse]);

  // Load assignment details
  useEffect(() => {
    if (editingAssignment) {
      setTab("assignment");
      setAsgTitle(editingAssignment.title);
      setAsgCourse(editingAssignment.course);
      setAsgDueIn(editingAssignment.dueIn);
      setAsgStatus(editingAssignment.status);
      setAsgGrade(editingAssignment.grade || "");
      setMsg(null);
    }
  }, [editingAssignment]);

  // Load live class details
  useEffect(() => {
    if (editingLiveClass) {
      setTab("live class");
      setLcTitle(editingLiveClass.title);
      setLcCourse(editingLiveClass.course);
      setLcAt(editingLiveClass.at);
      setLcInstructor(editingLiveClass.instructor);
      setMsg(null);
    }
  }, [editingLiveClass]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    
    if (tab === "announcement") {
      const { error } = await supabase.from("announcements").insert({ title: aTitle, body: aBody, created_by: uid });
      if (error) setMsg(error.message);
      else { setATitle(""); setABody(""); setMsg("Posted ✓"); }
    } else if (tab === "course") {
      if (editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update({
            title: cTitle,
            instructor: cInstructor,
            category: cCategory,
            blurb: cBlurb
          })
          .eq("id", editingCourse.id);
        if (error) setMsg(error.message);
        else {
          setCTitle("");
          setCInstructor("");
          setCBlurb("");
          clearEditing();
          setMsg("Course updated ✓");
        }
      } else {
        const { error } = await supabase.from("courses").insert({
          title: cTitle, instructor: cInstructor, category: cCategory, price: 0, blurb: cBlurb,
          level: "Beginner", cover: "from-fuchsia-500 to-violet-600", created_by: uid,
        });
        if (error) setMsg(error.message);
        else { setCTitle(""); setCInstructor(""); setCBlurb(""); setMsg("Course published ✓"); }
      }
    } else if (tab === "assignment") {
      if (editingAssignment) {
        const updated = assignmentsList.map((a) =>
          a.id === editingAssignment.id
            ? { ...a, title: asgTitle, course: asgCourse, dueIn: asgDueIn, status: asgStatus, grade: asgStatus === "graded" ? asgGrade : undefined }
            : a
        );
        setAssignmentsList(updated);
        localStorage.setItem("uplearn_assignments", JSON.stringify(updated));
        setAsgTitle("");
        setAsgGrade("");
        clearEditingAssignment();
        setMsg("Assignment updated ✓");
      } else {
        const newAsg = {
          id: "asg_" + Math.random().toString(36).substr(2, 9),
          title: asgTitle,
          course: asgCourse || (allCourses[0]?.title ?? ""),
          dueIn: asgDueIn,
          status: asgStatus,
          grade: asgStatus === "graded" ? asgGrade : undefined
        };
        const updated = [...assignmentsList, newAsg];
        setAssignmentsList(updated);
        localStorage.setItem("uplearn_assignments", JSON.stringify(updated));
        setAsgTitle("");
        setAsgGrade("");
        setMsg("Assignment published ✓");
      }
    } else if (tab === "live class") {
      if (editingLiveClass) {
        const updated = liveClassesList.map((l) =>
          l.id === editingLiveClass.id
            ? { ...l, title: lcTitle, course: lcCourse, at: lcAt, instructor: lcInstructor }
            : l
        );
        setLiveClassesList(updated);
        localStorage.setItem("uplearn_live_classes", JSON.stringify(updated));
        setLcTitle("");
        setLcInstructor("");
        clearEditingLiveClass();
        setMsg("Live class updated ✓");
      } else {
        const newLc = {
          id: "lc_" + Math.random().toString(36).substr(2, 9),
          title: lcTitle,
          course: lcCourse || (allCourses[0]?.title ?? ""),
          at: lcAt,
          instructor: lcInstructor
        };
        const updated = [...liveClassesList, newLc];
        setLiveClassesList(updated);
        localStorage.setItem("uplearn_live_classes", JSON.stringify(updated));
        setLcTitle("");
        setLcInstructor("");
        setMsg("Live class published ✓");
      }
    }
    setBusy(false);
  }

  const isEditing = editingCourse !== null || editingAssignment !== null || editingLiveClass !== null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit details" : "Publish in real time"}
        </h2>
      </div>
      <div className="mb-3 flex flex-wrap gap-1 rounded-lg bg-muted p-1 text-xs">
        {([
          { t: "announcement", l: "Announce" },
          { t: "course", l: "Course" },
          { t: "assignment", l: "Assignment" },
          { t: "live class", l: "Live Class" }
        ] as const).map(({ t, l }) => (
          <button
            key={t}
            type="button"
            disabled={isEditing && tab !== t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-2 py-1.5 capitalize text-center disabled:opacity-40 transition ${tab === t ? "bg-card text-foreground font-semibold shadow" : "text-muted-foreground"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-2.5">
        {tab === "announcement" && (
          <>
            <input required placeholder="Title" value={aTitle} onChange={(e) => setATitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <textarea required placeholder="Body" value={aBody} onChange={(e) => setABody(e.target.value)} rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </>
        )}

        {tab === "course" && (
          <>
            <input required placeholder="Course title" value={cTitle} onChange={(e) => setCTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input required placeholder="Instructor" value={cInstructor} onChange={(e) => setCInstructor(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="Category" value={cCategory} onChange={(e) => setCCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <textarea placeholder="Short description" value={cBlurb} onChange={(e) => setCBlurb(e.target.value)} rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </>
        )}

        {tab === "assignment" && (
          <>
            <input required placeholder="Assignment title" value={asgTitle} onChange={(e) => setAsgTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Select Course</label>
              <select value={asgCourse} onChange={(e) => setAsgCourse(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer">
                {allCourses.map((c) => (
                  <option key={c.id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Due time</label>
                <input required placeholder="e.g. 3 days" value={asgDueIn} onChange={(e) => setAsgDueIn(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Status</label>
                <select value={asgStatus} onChange={(e) => setAsgStatus(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="graded">Graded</option>
                </select>
              </div>
            </div>

            {asgStatus === "graded" && (
              <input placeholder="Grade (e.g. A, B+, A-)" value={asgGrade} onChange={(e) => setAsgGrade(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            )}
          </>
        )}

        {tab === "live class" && (
          <>
            <input required placeholder="Live Class title" value={lcTitle} onChange={(e) => setLcTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Select Course</label>
              <select value={lcCourse} onChange={(e) => setLcCourse(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary cursor-pointer">
                {allCourses.map((c) => (
                  <option key={c.id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </div>

            <input required placeholder="Instructor name" value={lcInstructor} onChange={(e) => setLcInstructor(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />

            <input required placeholder="Timing (e.g. Today, 6:30 PM)" value={lcAt} onChange={(e) => setLcAt(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </>
        )}

        {msg && <div className="text-xs text-muted-foreground">{msg}</div>}
        <div className="space-y-2">
          <button type="submit" disabled={busy}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}>
            {busy ? "Saving..." : isEditing ? "Save changes" : `Publish ${tab}`}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setCTitle("");
                setCInstructor("");
                setCBlurb("");
                setAsgTitle("");
                setAsgGrade("");
                setLcTitle("");
                setLcInstructor("");
                clearEditing();
                clearEditingAssignment();
                clearEditingLiveClass();
              }}
              className="w-full rounded-xl border border-border py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/30 cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function AnnouncementsCard({ rows, canManage }: { rows: DbAnnouncement[]; canManage: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-accent" />
        <h2 className="text-lg font-semibold">Live announcements</h2>
        <span className="ml-auto text-xs text-muted-foreground">{rows.length}</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.slice(0, 5).map((a) => (
            <li key={a.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{a.title}</div>
                {canManage && (
                  <button onClick={() => supabase.from("announcements").delete().eq("id", a.id)}
                    className="text-xs text-muted-foreground hover:text-destructive cursor-pointer">Delete</button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: "var(--gradient-primary)" }} />
      </div>
    </div>
  );
}

interface ChatbotWidgetProps {
  profiles: any[];
  allUserRoles: any[];
  currentUser: any;
  liveCourses: any[];
  announcements: any[];
  assignmentsList: any[];
  liveClassesList: any[];
  liveCohortsCount: number;
  dynamicBatches: any[];
}

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

function ChatbotWidget({
  profiles,
  allUserRoles,
  currentUser,
  liveCourses,
  announcements,
  assignmentsList,
  liveClassesList,
  liveCohortsCount,
  dynamicBatches,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your UpLearn Faculty Assistant. 🤖\n\nAsk me anything about registered students, active cohorts, live courses, assignments, or announcements!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const WELCOME_MESSAGE: Message = {
    sender: "bot",
    text: "Hello! I am your UpLearn Faculty Assistant. 🤖\n\nAsk me anything about registered students, active cohorts, live courses, assignments, or announcements!",
    timestamp: new Date(),
  };

  const clearChat = () => {
    if (confirm("Clear all chat history? This cannot be undone.")) {
      setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    }
  };

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: queryText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate AI typing delay
    setTimeout(() => {
      const normalizedQuery = queryText.toLowerCase().trim();
      let responseText = "";

      // Smart keyword parsing engine
      if (
        normalizedQuery.includes("thank") ||
        normalizedQuery.includes("thx") ||
        normalizedQuery.includes("thanks") ||
        normalizedQuery.includes("appreciate")
      ) {
        responseText = `You are very welcome! 😊 It is my absolute pleasure to assist you.\n\nLet me know if you need any other telemetry reports or statistics about active cohorts, courses, or assignments!`;
      } else if (
        normalizedQuery.includes("faculty") ||
        normalizedQuery.includes("teacher") ||
        normalizedQuery.includes("instructor") ||
        normalizedQuery.includes("professor") ||
        normalizedQuery.includes("logged") ||
        normalizedQuery.includes("session")
      ) {
        // Retrieve faculty lists by checking user roles table
        const facultyRoles = allUserRoles.filter(r => r.role === "faculty");
        const facultyIds = facultyRoles.map(r => r.user_id);
        const registeredFaculty = profiles.filter(p => facultyIds.includes(p.id));
        
        // Find current logged in user details
        const loggedInName = profiles.find(p => p.id === currentUser?.id)?.full_name || currentUser?.email || "Faculty Member";

        const asksForNames = 
          normalizedQuery.includes("name") || 
          normalizedQuery.includes("list") || 
          normalizedQuery.includes("who");

        if (asksForNames) {
          const namesList = registeredFaculty.length > 0
            ? registeredFaculty.map((f, idx) => `  ${idx + 1}. **${f.full_name || "Anonymous Faculty"}**`).join("\n")
            : "  *(No faculty profiles registered in directory)*";
          responseText = `👨‍🏫 **Registered Faculty Directory:**\n\nHere are the registered faculty members:\n\n${namesList}\n\n*Current Logged In User:* **${loggedInName}**`;
        } else {
          responseText = `💼 **Faculty Directory & Status:**\n\n• **Registered Faculty:** ${registeredFaculty.length} teacher(s)\n• **Current Session:** You are logged in as **${loggedInName}**.\n\n*Faculty lists are synced in real-time with UpLearn's secure access control database.*`;
        }
      } else if (
        normalizedQuery.includes("student") ||
        normalizedQuery.includes("enrolled") ||
        normalizedQuery.includes("register") ||
        normalizedQuery.includes("who") ||
        normalizedQuery.includes("profile") ||
        normalizedQuery.includes("user") ||
        normalizedQuery.includes("name") ||
        normalizedQuery.includes("list") ||
        normalizedQuery.includes("their")
      ) {
        const asksForNames = 
          normalizedQuery.includes("name") || 
          normalizedQuery.includes("list") || 
          normalizedQuery.includes("their") || 
          normalizedQuery.includes("who are");

        if (asksForNames) {
          const namesList = profiles.length > 0 
            ? profiles.map((p, idx) => `  ${idx + 1}. **${p.full_name || "Anonymous User"}**`).join("\n")
            : "  *(No students registered yet)*";
          responseText = `👥 **Registered Student Directory:**\n\nHere are the names of the currently registered learners on UpLearnLMS:\n\n${namesList}\n\n*Total registered: ${profiles.length} student(s)*`;
        } else {
          responseText = `📊 **Student Enrollment Telemetry:**\n\n• **Total Registered Students:** ${profiles.length} student(s)\n• **Cohort Breakdowns:**\n${dynamicBatches
            .map((b) => `  - **${b.name}:** ${b.students} students (Attendance: ${b.attendance}%)`)
            .join("\n")}\n\n*All statistics are synced in real-time with the Supabase profiles database.*`;
        }
      } else if (
        normalizedQuery.includes("cohort") ||
        normalizedQuery.includes("batch") ||
        normalizedQuery.includes("batches")
      ) {
        responseText = `🎓 **Cohort Telemetry:**\n\n• **Total Active Cohorts:** ${liveCohortsCount} batch(es)\n${dynamicBatches
          .map((b) => `  - **${b.name}:** ${b.students} active student(s) enrolled`)
          .join("\n")}`;
      } else if (
        normalizedQuery.includes("course") ||
        normalizedQuery.includes("courses") ||
        normalizedQuery.includes("subject")
      ) {
        responseText = `📚 **Live Courses Telemetry:**\n\n• **Total Published Courses:** ${liveCourses.length} course(s)\n${
          liveCourses.length > 0
            ? liveCourses.map((c, i) => `  ${i + 1}. **${c.title}** (by ${c.instructor})`).join("\n")
            : "  *(No courses have been published yet. Use the 'Course' composer tab to publish one!)*"
        }`;
      } else if (
        normalizedQuery.includes("announce") ||
        normalizedQuery.includes("update") ||
        normalizedQuery.includes("news") ||
        normalizedQuery.includes("bulletin")
      ) {
        responseText = `📢 **Announcements Telemetry:**\n\n• **Active Announcements:** ${announcements.length}\n${
          announcements.length > 0
            ? announcements.map((a, i) => `  - **${a.title}**: ${a.body}`).join("\n")
            : "  *(No live announcements published.)*"
        }`;
      } else if (
        normalizedQuery.includes("class") ||
        normalizedQuery.includes("live class") ||
        normalizedQuery.includes("schedule") ||
        normalizedQuery.includes("session") ||
        normalizedQuery.includes("meeting")
      ) {
        responseText = `📅 **Live Class Telemetry:**\n\n• **Scheduled Live Sessions:** ${liveClassesList.length}\n${
          liveClassesList.length > 0
            ? liveClassesList
                .map((l) => `  - **${l.title}**\n    *Course:* ${l.course}\n    *Time:* ${l.at}\n    *Instructor:* ${l.instructor}`)
                .join("\n")
            : "  *(No upcoming live classes scheduled.)*"
        }`;
      } else if (
        normalizedQuery.includes("assign") ||
        normalizedQuery.includes("task") ||
        normalizedQuery.includes("grade") ||
        normalizedQuery.includes("homework")
      ) {
        responseText = `📝 **Assignment Telemetry:**\n\n• **Current Active Assignments:** ${assignmentsList.length}\n${
          assignmentsList.length > 0
            ? assignmentsList
                .map((a) => `  - **${a.title}** (Course: ${a.course})\n    *Due:* ${a.dueIn} | *Status:* ${a.status}`)
                .join("\n")
            : "  *(No assignments published.)*"
        }`;
      } else if (
        normalizedQuery.includes("hi") ||
        normalizedQuery.includes("hello") ||
        normalizedQuery.includes("hey") ||
        normalizedQuery.includes("help") ||
        normalizedQuery.includes("who are you")
      ) {
        responseText = `Hello! I'm your virtual institute assistant. 🤖\n\nI can retrieve real-time statistics about:\n- **Registered/Active Students** (Type: *students*)\n- **Live Cohorts** (Type: *cohorts*)\n- **Live Courses** (Type: *courses*)\n- **Announcements** (Type: *announcements*)\n- **Scheduled Classes** (Type: *classes*)\n- **Assignments** (Type: *assignments*)\n\nFeel free to write a message or click one of the quick pills below!`;
      } else {
        responseText = `I'm sorry, I couldn't find a direct match for your query. 😅\n\nTry asking about **students**, **cohorts**, **courses**, **announcements**, **live classes**, or **assignments**. Alternatively, click one of the quick-action pills below!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: responseText,
          timestamp: new Date(),
        },
      ]);
    }, 400);
  };

  const quickPills = [
    { label: "📊 Students", query: "registered students count and breakdowns" },
    { label: "🎓 Cohorts", query: "active live cohorts breakdown" },
    { label: "📚 Courses", query: "live courses list" },
    { label: "📢 Announce", query: "announcements telemetry update" },
    { label: "📅 Classes", query: "live classes schedule details" },
    { label: "📝 Assign", query: "assignments list details" },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
        style={{ background: "var(--gradient-primary)" }}
        title="Toggle Chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 animate-pulse" />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[400px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: "var(--gradient-primary)" }}>
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500 animate-ping" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold flex items-center gap-1.5 leading-none">
                UpLearn Assistant <Sparkles className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
              </h3>
              <p className="mt-1 text-[11px] text-white/80 leading-none">Faculty Telemetry Oracle · Online</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear chat history"
                className="rounded-lg p-1.5 hover:bg-white/10 transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[85%] whitespace-pre-wrap shadow-sm border border-border/40 ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted/70 text-foreground rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-muted-foreground px-1">
                  {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-action Scrollable Pills Container */}
          <div className="border-t border-border/60 bg-muted/30 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => handleQuery(pill.query)}
                  className="shrink-0 rounded-full border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery(inputValue);
            }}
            className="flex items-center gap-2 border-t border-border/60 bg-card p-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about active courses, students, announcements..."
              className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition cursor-pointer shrink-0"
              style={inputValue.trim() ? { background: "var(--gradient-primary)" } : undefined}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}