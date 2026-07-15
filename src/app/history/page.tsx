"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, History, LockKeyhole, RotateCcw, Trash2 } from "lucide-react";
import { SafetyNotice } from "@/components/SafetyNotice";
import { historySeed } from "@/data/historySeed";
import { getDeviceId } from "@/lib/deviceId";
import { hydrateHistory, useMediMapStore } from "@/store/useMediMapStore";
import type { SearchHistoryItem, Urgency } from "@/types/health";

const urgencyLabel: Record<Urgency, string> = {
  EMERGENCY: "응급도: 높음",
  URGENT: "응급도: 주의",
  ROUTINE: "응급도: 보통",
  SELF_CARE: "응급도: 낮음"
};

export default function HistoryPage() {
  const history = useMediMapStore((state) => state.history);
  const setHistory = useMediMapStore((state) => state.setHistory);
  const removeHistory = useMediMapStore((state) => state.removeHistory);
  const clearHistory = useMediMapStore((state) => state.clearHistory);
  const [hydrated, setHydrated] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      hydrateHistory();
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    async function loadRemoteHistory() {
      try {
        const response = await fetch("/api/history", {
          headers: { "x-medimap-device-id": getDeviceId() }
        });
        const payload = (await response.json()) as { history?: SearchHistoryItem[] };

        if (!cancelled && response.ok && payload.history && payload.history.length > 0) {
          setHistory(payload.history);
        }
      } finally {
        if (!cancelled) {
          setRemoteReady(true);
        }
      }
    }

    void loadRemoteHistory();
    return () => {
      cancelled = true;
    };
  }, [hydrated, setHistory]);

  const displayHistory = useMemo(() => (hydrated && history.length > 0 ? history : historySeed), [history, hydrated]);
  const usingSeed = hydrated && history.length === 0;

  async function handleRemove(id: string) {
    removeHistory(id);
    await fetch(`/api/history?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-medimap-device-id": getDeviceId() }
    });
  }

  async function handleClear() {
    clearHistory();
    await fetch("/api/history?id=all", {
      method: "DELETE",
      headers: { "x-medimap-device-id": getDeviceId() }
    });
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-slate-300 bg-slate-100 p-8 lg:block">
        <h1 className="text-2xl font-extrabold text-teal-800">MediMap AI</h1>
        <p className="mt-2 text-sm text-slate-600">AI Health Partner</p>
        <nav className="mt-10 space-y-4" aria-label="기록 메뉴">
          {["Symptom Analysis", "Nearby Hospitals", "Nearby Pharmacies", "Search History"].map((item) => (
            <div key={item} className={`flex items-center gap-3 rounded-lg px-3 py-3 font-bold ${item === "Search History" ? "bg-teal-700 text-white" : "text-slate-700"}`}>
              <History className="size-5" aria-hidden="true" /> {item}
            </div>
          ))}
        </nav>
      </aside>

      <section className="px-5 py-12 md:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold">검색 기록</h1>
              <p className="mt-5 text-lg text-slate-700">저장에 동의한 분석 기록만 안전하게 관리하세요.</p>
            </div>
            <button type="button" onClick={handleClear} className="inline-flex items-center gap-2 font-bold text-red-700" disabled={history.length === 0}>
              <Trash2 className="size-5" aria-hidden="true" /> 전체 기록 삭제
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-teal-200 bg-teal-50 p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-6">
                <div className="grid size-16 place-items-center rounded-xl bg-teal-800 text-white">
                  <LockKeyhole className="size-8" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-teal-800">Supabase 저장 시스템</h2>
                  <p className="mt-3 text-lg leading-8 text-slate-700">검색 기록 저장을 선택한 항목만 서버 Route Handler를 통해 Supabase에 저장됩니다. 서비스 키는 브라우저에 노출되지 않습니다.</p>
                </div>
              </div>
              <span className="rounded-full border border-teal-800 px-7 py-3 font-bold text-teal-800">{remoteReady ? "동기화 확인" : "동기화 중"}</span>
            </div>
          </div>

          {usingSeed && <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">저장된 검색 기록이 없어 디자인 확인용 예시를 표시합니다. 실제 기록은 사용자가 분석 시 검색 기록 저장을 선택한 경우에만 저장됩니다.</div>}

          <div className="mt-10 space-y-10">
            <HistoryGroup label="오늘" items={displayHistory.slice(0, 2)} onRemove={handleRemove} seed={usingSeed} />
            <HistoryGroup label="이전 기록" items={displayHistory.slice(2)} onRemove={handleRemove} seed={usingSeed} />
          </div>

          <div className="mt-14">
            <SafetyNotice compact />
          </div>
        </div>
      </section>
    </div>
  );
}

function HistoryGroup({ label, items, onRemove, seed }: { label: string; items: SearchHistoryItem[]; onRemove: (id: string) => void; seed: boolean }) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center gap-5">
        <span className="rounded-lg bg-teal-100 px-4 py-2 font-extrabold text-teal-800">{label}</span>
        <div className="h-px flex-1 bg-slate-300" />
      </div>
      <div className="space-y-6">
        {items.map((item) => (
          <article key={item.id} className="card p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-4" aria-hidden="true" /> {formatTime(item.createdAt)}
                  </span>
                  <span className={`rounded px-2 py-1 font-bold ${item.urgency === "EMERGENCY" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{urgencyLabel[item.urgency]}</span>
                </div>
                <h2 className="mt-4 text-2xl font-extrabold">{item.summary}</h2>
                <p className="mt-3 text-slate-700">추천 진료과: {item.departments.join(" / ")}</p>
              </div>
              <div className="grid gap-3 md:w-32">
                <Link href="/analysis/result" className="btn-primary px-4 py-3">
                  <RotateCcw className="size-4" aria-hidden="true" /> 다시 보기
                </Link>
                <button type="button" onClick={() => onRemove(item.id)} disabled={seed} className="rounded-lg border border-slate-300 px-4 py-3 font-bold text-slate-700 disabled:opacity-50">
                  기록 삭제
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "시간 정보 없음";
  return new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(date);
}
