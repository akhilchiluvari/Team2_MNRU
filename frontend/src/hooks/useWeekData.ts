import { useState, useEffect, useCallback } from "react";
import { WeekInfo, WeekData, SectionData, EntryBase, SectionStatus } from "@/types/report";
import { SECTIONS } from "@/data/sections";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Json } from "@/integrations/supabase/types";

export function useWeekData() {
  const { user } = useAuth();
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [activeWeekId, setActiveWeekId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const activeWeek = weeks.find((w) => w.weekInfo.id === activeWeekId) || null;

  // Fetch all weeks and their entries
  const fetchData = useCallback(async () => {
    if (!user) { setWeeks([]); setLoading(false); return; }
    setLoading(true);

    const [weeksRes, entriesRes] = await Promise.all([
      supabase.from("weeks").select("*").order("created_at", { ascending: false }),
      supabase.from("section_entries").select("*"),
    ]);

    const weekRows = weeksRes.data || [];
    const entryRows = entriesRes.data || [];

    const weekDataList: WeekData[] = weekRows.map((w) => {
      const weekEntries = entryRows.filter((e) => e.week_id === w.id);
      const sections: Record<string, SectionData> = {};

      weekEntries.forEach((e) => {
        if (!sections[e.section_id]) sections[e.section_id] = { entries: [] };
        const entryData = (typeof e.entry_data === "object" && e.entry_data !== null ? e.entry_data : {}) as Record<string, any>;
        sections[e.section_id].entries.push({
          id: e.id,
          contributorName: e.contributor_name,
          file: e.file_data || undefined,
          fileName: e.file_name || undefined,
          createdAt: e.created_at,
          updatedAt: e.updated_at,
          createdBy: e.created_by,
          ...entryData,
        } as EntryBase & { createdBy?: string });
        sections[e.section_id].lastUpdatedBy = e.contributor_name;
        sections[e.section_id].lastUpdatedAt = e.updated_at;
      });

      return {
        weekInfo: {
          id: w.id,
          startDate: w.start_date,
          endDate: w.end_date,
          label: w.label,
          createdAt: w.created_at,
          updatedAt: w.updated_at,
        },
        sections,
      };
    });

    setWeeks(weekDataList);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createWeek = useCallback(async (startDate: string, endDate: string, label: string) => {
    if (!user) return "";
    const { data, error } = await supabase.from("weeks").insert({
      start_date: startDate,
      end_date: endDate,
      label,
      created_by: user.id,
    }).select().single();

    if (error || !data) return "";
    await fetchData();
    setActiveWeekId(data.id);
    return data.id;
  }, [user, fetchData]);

  const deleteWeek = useCallback(async (weekId: string) => {
    // Delete entries first, then the week
    await supabase.from("section_entries").delete().eq("week_id", weekId);
    await supabase.from("weeks").delete().eq("id", weekId);
    if (activeWeekId === weekId) setActiveWeekId(null);
    await fetchData();
  }, [activeWeekId, fetchData]);

  const getSectionData = useCallback((sectionId: string): SectionData => {
    return activeWeek?.sections[sectionId] || { entries: [] };
  }, [activeWeek]);

  const addEntry = useCallback(async (sectionId: string, entry: Record<string, any>, contributorName: string, file?: string, fileName?: string) => {
    if (!user || !activeWeekId) return;
    await supabase.from("section_entries").insert({
      week_id: activeWeekId,
      section_id: sectionId,
      contributor_name: contributorName,
      entry_data: entry as unknown as Json,
      file_data: file || null,
      file_name: fileName || null,
      created_by: user.id,
    });
    await fetchData();
  }, [user, activeWeekId, fetchData]);

  const updateEntry = useCallback(async (sectionId: string, entryId: string, updates: Record<string, any>) => {
    const { contributorName, file, fileName, ...entryData } = updates;
    const updatePayload: Record<string, any> = { entry_data: entryData as unknown as Json };
    if (contributorName !== undefined) updatePayload.contributor_name = contributorName;
    if (file !== undefined) updatePayload.file_data = file;
    if (fileName !== undefined) updatePayload.file_name = fileName;

    await supabase.from("section_entries").update(updatePayload).eq("id", entryId);
    await fetchData();
  }, [fetchData]);

  const deleteEntry = useCallback(async (sectionId: string, entryId: string) => {
    await supabase.from("section_entries").delete().eq("id", entryId);
    await fetchData();
  }, [fetchData]);

  const getSectionStatus = useCallback((sectionId: string): SectionStatus => {
    const section = activeWeek?.sections[sectionId];
    if (!section || section.entries.length === 0) return "empty";
    const config = SECTIONS.find((s) => s.id === sectionId);
    if (!config) return "empty";
    const allFilled = section.entries.every((entry: any) =>
      config.fields.filter((f) => f.required).every((f) => {
        const val = entry[f.key];
        return val !== undefined && val !== null && val.toString().trim() !== "";
      })
    );
    return allFilled ? "completed" : "in-progress";
  }, [activeWeek]);

  const getCompletionStats = useCallback(() => {
    let completed = 0;
    let inProgress = 0;
    SECTIONS.forEach((s) => {
      const status = getSectionStatus(s.id);
      if (status === "completed") completed++;
      else if (status === "in-progress") inProgress++;
    });
    return { completed, inProgress, total: SECTIONS.length };
  }, [getSectionStatus]);

  return {
    weeks,
    activeWeek,
    activeWeekId,
    setActiveWeekId,
    createWeek,
    deleteWeek,
    getSectionData,
    addEntry,
    updateEntry,
    deleteEntry,
    getSectionStatus,
    getCompletionStats,
    loading,
  };
}
