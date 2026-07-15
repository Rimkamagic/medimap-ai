"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeAlert, BrainCircuit, MapPin, Pill, Stethoscope } from "lucide-react";
import { getDeviceId } from "@/lib/deviceId";
import { useMediMapStore } from "@/store/useMediMapStore";
import type { AnalysisResult } from "@/types/health";

const steps = [
  { label: "응급 증상 확인", icon: BadgeAlert },
  { label: "증상 내용 분석", icon: BrainCircuit },
  { label: "진료과 찾기", icon: Stethoscope },
  { label: "의약품 정보 확인", icon: Pill },
  { label: "주변 의료기관 검색", icon: MapPin }
];

export default function AnalysisLoadingPage() {
  const router = useRouter();
  const draft = useMediMapStore((state) => state.draft);
  const setResult = useMediMapStore((state) => state.setResult);
  const addHistory = useMediMapStore((state) => state.addHistory);
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const requested = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => Math.min(value + 1, steps.length - 1)), 650);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    async function analyze() {
      try {
        if (!draft.symptoms) {
          router.replace("/symptom");
          return;
        }

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft)
        });
        const payload = (await response.json()) as AnalysisResult | { error: string };

        if (!response.ok || "error" in payload) {
          throw new Error("분석 요청을 처리하지 못했습니다.");
        }

        setResult(payload);

        if (draft.saveHistory) {
          const localItem = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            summary: payload.summary,
            urgency: payload.urgency,
            departments: payload.recommendedDepartments.map((department) => department.name)
          };
          addHistory(localItem);

          void fetch("/api/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-medimap-device-id": getDeviceId()
            },
            body: JSON.stringify({
              symptomInput: draft,
              analysisResult: payload
            })
          });
        }

        window.setTimeout(() => {
          router.replace(payload.urgency === "EMERGENCY" ? "/emergency" : "/analysis/result");
        }, 1300);
      } catch {
        setError("분석 중 문제가 발생했습니다. 입력 화면으로 돌아가 다시 시도해 주세요.");
      }
    }

    void analyze();
  }, [addHistory, draft, router, setResult]);

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_8%_8%,#c7e8ea_0,transparent_24%),linear-gradient(140deg,#f8fafc_55%,#b7cdfd_100%)]">
      <div className="page-shell flex flex-col items-center py-8 text-center">
        <p className="text-2xl font-extrabold text-teal-800">MediMap AI</p>
        <div className="mt-5 grid size-80 place-items-center rounded-full border border-slate-200 bg-white shadow-lg">
          <div className="h-36 w-52 rounded-lg bg-[linear-gradient(135deg,#dbeff0,#ffffff_45%,#8bd7d4)] p-6 shadow-inner">
            <div className="h-3 w-28 rounded bg-teal-700/70" />
            <div className="mt-5 h-16 rounded bg-white/80" />
          </div>
        </div>
        <h1 className="mt-10 text-4xl font-extrabold">입력한 증상을 안전하게 분석하고 있습니다</h1>
        <p className="mt-5 text-lg text-slate-700">잠시만 기다려주시면 최적의 의료 가이드를 제공해 드립니다.</p>

        <div className="card mt-12 w-full max-w-3xl p-5">
          <div className="mb-7 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-teal-700 transition-all" style={{ width: `${Math.max(20, (active + 1) * 20)}%` }} />
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.label} className={`flex items-center justify-between rounded-lg p-5 text-left ${index === active ? "bg-slate-50" : "opacity-45"}`}>
                <span className="flex items-center gap-4 font-bold">
                  <span className="grid size-10 place-items-center rounded-full bg-teal-100 text-teal-800">
                    <step.icon className="size-5" aria-hidden="true" />
                  </span>
                  {step.label}
                </span>
                {index === active && <span className="size-5 animate-pulse rounded-full border-2 border-teal-700" aria-label="진행 중" />}
              </div>
            ))}
          </div>
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
