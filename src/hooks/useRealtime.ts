import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbAnnouncement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  created_by: string | null;
};

export type DbCourse = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  level: string;
  blurb: string;
  cover: string;
  hours: number;
  lessons: number;
  created_at: string;
};

export function useRealtimeTable<T extends { id: string; created_at: string }>(table: "announcements" | "courses") {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!mounted) return;
        setRows(((data ?? []) as unknown) as T[]);
        setLoading(false);
      });

    const channel = supabase
      .channel(`rt-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
        setRows((prev) => {
          if (payload.eventType === "INSERT") return [payload.new as T, ...prev];
          if (payload.eventType === "UPDATE")
            return prev.map((r) => (r.id === (payload.new as T).id ? (payload.new as T) : r));
          if (payload.eventType === "DELETE")
            return prev.filter((r) => r.id !== (payload.old as T).id);
          return prev;
        });
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [table]);

  return { rows, loading };
}