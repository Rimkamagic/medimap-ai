import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { AnalysisResult, SearchHistoryItem, SymptomInput, Urgency } from "@/types/health";

const tableName = "medimap_analysis_history";

interface HistoryRow {
  id: string;
  created_at: string;
  device_id: string;
  summary: string;
  urgency: Urgency;
  departments: string[];
  symptom_input: SymptomInput;
  analysis_result: AnalysisResult;
}

function toHistoryItem(row: Pick<HistoryRow, "id" | "created_at" | "summary" | "urgency" | "departments">): SearchHistoryItem {
  return {
    id: row.id,
    createdAt: row.created_at,
    summary: row.summary,
    urgency: row.urgency,
    departments: row.departments
  };
}

export async function listSupabaseHistory(deviceId: string): Promise<SearchHistoryItem[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(tableName)
    .select("id, created_at, summary, urgency, departments")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error("Failed to read Supabase history.");
  }

  return (data ?? []).map((row) => toHistoryItem(row as Pick<HistoryRow, "id" | "created_at" | "summary" | "urgency" | "departments">));
}

export async function saveSupabaseHistory(input: {
  deviceId: string;
  symptomInput: SymptomInput;
  analysisResult: AnalysisResult;
}): Promise<SearchHistoryItem | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  if (!input.symptomInput.saveHistory) {
    return null;
  }

  const departments = input.analysisResult.recommendedDepartments.map((department) => department.name);
  const { data, error } = await supabase
    .from(tableName)
    .insert({
      device_id: input.deviceId,
      summary: input.analysisResult.summary,
      urgency: input.analysisResult.urgency,
      departments,
      symptom_input: input.symptomInput,
      analysis_result: input.analysisResult
    })
    .select("id, created_at, summary, urgency, departments")
    .single();

  if (error) {
    throw new Error("Failed to save Supabase history.");
  }

  return toHistoryItem(data as Pick<HistoryRow, "id" | "created_at" | "summary" | "urgency" | "departments">);
}

export async function deleteSupabaseHistory(deviceId: string, id: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const { error } = await supabase.from(tableName).delete().eq("device_id", deviceId).eq("id", id);
  if (error) {
    throw new Error("Failed to delete Supabase history.");
  }
}

export async function clearSupabaseHistory(deviceId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const { error } = await supabase.from(tableName).delete().eq("device_id", deviceId);
  if (error) {
    throw new Error("Failed to clear Supabase history.");
  }
}
