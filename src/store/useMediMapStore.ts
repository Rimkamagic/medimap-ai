"use client";

import { create } from "zustand";
import type { AnalysisResult, SearchHistoryItem, SymptomInput } from "@/types/health";

interface MediMapState {
  draft: Partial<SymptomInput>;
  result: AnalysisResult | null;
  history: SearchHistoryItem[];
  setDraft: (draft: Partial<SymptomInput>) => void;
  setResult: (result: AnalysisResult | null) => void;
  setHistory: (history: SearchHistoryItem[]) => void;
  addHistory: (item: SearchHistoryItem) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
}

const historyStorageKey = "medimap-history";

function readHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(historyStorageKey) ?? "[]") as SearchHistoryItem[];
  } catch {
    return [];
  }
}

function writeHistory(history: SearchHistoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(historyStorageKey, JSON.stringify(history));
}

export const useMediMapStore = create<MediMapState>((set, get) => ({
  draft: {},
  result: null,
  history: [],
  setDraft: (draft) => set({ draft: { ...get().draft, ...draft } }),
  setResult: (result) => set({ result }),
  setHistory: (history) => {
    writeHistory(history);
    set({ history });
  },
  addHistory: (item) => {
    const next = [item, ...get().history].slice(0, 20);
    writeHistory(next);
    set({ history: next });
  },
  removeHistory: (id) => {
    const next = get().history.filter((item) => item.id !== id);
    writeHistory(next);
    set({ history: next });
  },
  clearHistory: () => {
    writeHistory([]);
    set({ history: [] });
  }
}));

export function hydrateHistory() {
  useMediMapStore.setState({ history: readHistory() });
}
