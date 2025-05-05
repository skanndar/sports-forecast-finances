// src/lib/scenarioService.ts
import { supabase, isSupabaseConfigured, getCurrentUserId } from "./supabase";
import { Scenario, Settings } from "./types";

// --- helpers ---------------------------------------------------------------

const LS_KEY = "sports-finance-scenarios";

const toScenario = (row: any): Scenario => ({
  id: row.id,
  name: row.name,
  settings: row.settings,
  results: undefined, // se calculará a demanda
});

// --- load ------------------------------------------------------------------

export const loadScenarios = async (): Promise<Scenario[]> => {
  // 1) Supabase
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (userId) {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("user_id", userId);

      if (error) console.error("Supabase load error:", error);
      if (data) return data.map(toScenario);
    }
  }

  // 2) localStorage
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("localStorage load error:", e);
    return [];
  }
};

// --- save ------------------------------------------------------------------

export const saveScenario = async (
  name: string,
  settings: Settings,
): Promise<string> => {
  const id = crypto.randomUUID();

  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (userId) {
      const { error } = await supabase.from("scenarios").insert({
        id,
        user_id: userId,
        name,
        settings,
      });
      if (!error) return id;
      console.error("Supabase save error:", error);
    }
  }

  // fallback localStorage
  try {
    const list: Scenario[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    list.push({ id, name, settings, results: undefined });
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("localStorage save error:", e);
  }
  return id;
};

// --- update ----------------------------------------------------------------

export const updateScenario = async (
  id: string,
  name: string,
  settings: Settings,
): Promise<void> => {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (userId) {
      const { error } = await supabase
        .from("scenarios")
        .update({ name, settings })
        .eq("id", id)
        .eq("user_id", userId);
      if (!error) return;
      console.error("Supabase update error:", error);
    }
  }

  // fallback localStorage
  try {
    const list: Scenario[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    const idx = list.findIndex((s) => s.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], name, settings };
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error("localStorage update error:", e);
  }
};

// --- delete ----------------------------------------------------------------

export const deleteScenario = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (userId) {
      const { error } = await supabase
        .from("scenarios")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (!error) return;
      console.error("Supabase delete error:", error);
    }
  }

  // fallback localStorage
  try {
    const list: Scenario[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("localStorage delete error:", e);
  }
};
