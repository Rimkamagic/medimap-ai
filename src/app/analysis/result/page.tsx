"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, BarChart3, BriefcaseMedical, CircleAlert, Hospital, Leaf, Pill, RotateCcw } from "lucide-react";
import { SafetyNotice } from "@/components/SafetyNotice";
import { medicines } from "@/data/medicines";
import { useMediMapStore } from "@/store/useMediMapStore";

const urgencyTone = {
  EMERGENCY: "bg-red-600 text-white",
  URGENT: "bg-red-100 text-red-700",
  ROUTINE: "bg-blue-100 text-blue-700",
  SELF_CARE: "bg-teal-100 text-teal-700"
};

const urgencyLabel = {
  EMERGENCY: "응급도: 매우 높음",
  URGENT: "응급도: 주의",
  ROUTINE: "응급도: 보통",
  SELF_CARE: "응급도: 낮음"
 };

export default function AnalysisResultPage() {
  const router = useRouter();
  const result = useMediMapStore((state) => state.result);
  const draft = useMediMapStore((state) => state.draft);

  if (!result) {
    return (
      <div className="page-shell py-16">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-extrabold">분석 결과가 없습니다</h1>
          <p className="mt-3 text-slate-700">증상 입력부터 다시 진행해 주세요.</p>
          <button onClick={() => router.push("/")} className="btn-primary mt-6 px-6 py-3">
            처음으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-12">
      <section className={`mb-10 rounded-xl p-8 shadow-lg ${result.urgency === "EMERGENCY" ? "bg-red-600 text-white" : "bg-teal-800 text-white"}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold opacity-90">분석 완료</p>
            <h1 className="mt-3 text-4xl font-extrabold">{result.urgency === "URGENT" ? "빠른 진료 상담을 권장합니다" : "입력하신 증상을 정리했습니다"}</h1>
            <p className="mt-4 text-lg opacity-95">{result.summary}</p>
          </div>
          <span className={`rounded-full px-5 py-2 font-extrabold ${urgencyTone[result.urgency]}`}>{urgencyLabel[result.urgency]}</span>
        </div>
      </section>

      <div className="grid gap-7 lg:grid-cols-[0.45fr_1fr]">
        <aside className="card p-7">
          <h2 className="flex items-center gap-3 text-2xl font-extrabold">
            <BriefcaseMedical className="size-6 text-teal-800" aria-hidden="true" /> 입력하신 증상
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold"># {draft.symptoms ?? "증상"}</span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold"># 통증 {draft.painLevel ?? 0}/10</span>
            {draft.fever && <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold"># 발열</span>}
          </div>
          <blockquote className="mt-20 border-t border-slate-300 pt-8 text-lg italic text-slate-600">{draft.extraDescription || draft.symptoms || result.summary}</blockquote>
        </aside>

        <section className="card p-7">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-extrabold">
            <BarChart3 className="size-6 text-teal-800" aria-hidden="true" /> 가능성이 있는 원인
          </h2>
          <div className="space-y-4">
            {result.possibleCauses.map((cause, index) => (
              <div key={cause.name} className="rounded-lg border border-slate-300 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`text-xl font-extrabold ${index === 0 ? "text-red-700" : ""}`}>{cause.name}</h3>
                  <span className="rounded bg-slate-200 px-3 py-1 text-sm font-bold">{index === 0 ? "높음" : "참고"}</span>
                </div>
                <p className="mt-3 leading-7 text-slate-700">{cause.reason}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-2">
        <section className="rounded-xl border border-teal-200 bg-teal-50 p-7">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-extrabold text-teal-800">
            <Hospital className="size-6" aria-hidden="true" /> 권장 진료과
          </h2>
          <div className="space-y-4">
            {result.recommendedDepartments.map((department) => (
              <div key={department.name} className="rounded-lg bg-white p-5">
                <h3 className="text-xl font-extrabold text-teal-800">{department.name}</h3>
                <p className="mt-2 leading-7 text-slate-700">{department.reason}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-red-200 bg-red-50 p-7">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-extrabold text-red-700">
            <CircleAlert className="size-6" aria-hidden="true" /> 위험 신호 (Red Flags)
          </h2>
          <div className="space-y-4">
            {result.warningSigns.map((warning) => (
              <div key={warning} className="flex items-center gap-4 rounded-lg bg-white p-4">
                <AlertCircle className="size-5 text-red-600" aria-hidden="true" />
                <span className="font-semibold text-slate-700">{warning}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card mt-7 border-t-4 border-t-blue-700 p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold">일반의약품 정보 (참고용)</h2>
          <span className="text-sm text-slate-600">출처: 식품의약품안전처 의약품안전나라</span>
        </div>
        <p className="mb-5 text-slate-700">아래는 복용 권고가 아니라 약사와 상담할 수 있는 성분 또는 제품 정보입니다.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {medicines.slice(0, 3).map((medicine) => (
            <Link key={medicine.itemSeq} href={`/medicine/${medicine.itemSeq}`} className="rounded-lg border border-slate-300 bg-slate-50 p-5 transition hover:border-teal-700">
              <p className="text-sm font-bold text-blue-700">약물명</p>
              <h3 className="mt-2 text-xl font-extrabold">{medicine.itemName}</h3>
              <p className="mt-4 text-sm text-slate-700">{medicine.ingredients.join(", ")}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm font-semibold text-blue-700">
          응급 상황에서의 복용은 반드시 의료진이나 119 구급대원의 안내에 따르세요.
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-slate-200 p-7">
        <h2 className="mb-5 flex items-center gap-3 text-2xl font-extrabold">
          <Leaf className="size-6 text-teal-800" aria-hidden="true" /> 생활 관리 방법
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {result.selfCare.map((care, index) => (
            <div key={care} className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white font-extrabold text-teal-800">{index + 1}</span>
              <p className="leading-7 text-slate-700">{care}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/map?type=hospital" className="btn-primary px-9 py-4 text-lg">
          <Hospital className="size-5" aria-hidden="true" /> 주변 병원 찾기
        </Link>
        <Link href="/map?type=pharmacy" className="btn-blue px-9 py-4 text-lg">
          <Pill className="size-5" aria-hidden="true" /> 주변 약국 찾기
        </Link>
        <Link href="/symptom" className="btn-outline border-slate-400 px-9 py-4 text-lg text-slate-700">
          <RotateCcw className="size-5" aria-hidden="true" /> 다시 분석하기
        </Link>
      </div>

      <div className="mt-9">
        <SafetyNotice />
      </div>
    </div>
  );
}
