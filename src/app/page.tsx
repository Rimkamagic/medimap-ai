"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardPenLine, Cross, Hospital, LocateFixed, Map, Pill, Stethoscope } from "lucide-react";
import { useMediMapStore } from "@/store/useMediMapStore";

const quickSymptoms = ["두통", "발열", "복통", "기침", "목 통증", "허리 통증", "관절 통증", "피부 증상"];

export default function HomePage() {
  const router = useRouter();
  const setDraft = useMediMapStore((state) => state.setDraft);
  const [symptoms, setSymptoms] = useState("");

  function startAnalysis() {
    setDraft({ symptoms });
    router.push("/symptom");
  }

  return (
    <div className="page-shell py-14">
      <section className="mb-14">
        <h1 className="text-4xl font-extrabold tracking-normal md:text-5xl">오늘 몸 상태가 어떠신가요?</h1>
        <p className="mt-7 text-xl text-slate-700">AI가 귀하의 증상을 분석하고 가장 가까운 의료기관을 찾아드립니다.</p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="card p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold">
              <ClipboardPenLine className="size-6 text-teal-800" aria-hidden="true" />
              증상 상세 입력
            </h2>
            <Cross className="hidden size-28 text-teal-900/10 md:block" aria-hidden="true" />
          </div>
          <label htmlFor="symptoms" className="sr-only">
            증상 입력
          </label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(event) => setSymptoms(event.target.value)}
            className="field min-h-44 resize-y text-lg"
            placeholder="어제부터 목이 아프고 열이 조금 나요."
          />
          <p className="mb-3 mt-8 font-semibold">자주 찾는 증상</p>
          <div className="flex flex-wrap gap-3">
            {quickSymptoms.map((symptom) => (
              <button key={symptom} type="button" onClick={() => setSymptoms((current) => `${current} ${symptom}`.trim())} className="rounded-full border border-slate-400 px-5 py-1.5 text-base">
                {symptom}
              </button>
            ))}
          </div>
          <button type="button" onClick={startAnalysis} className="btn-primary mt-9 w-full px-6 py-4 text-2xl">
            <Stethoscope className="size-6" aria-hidden="true" />
            AI로 증상 분석하기
          </button>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl bg-blue-700 p-8 text-white shadow-xl">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold">
              <LocateFixed className="size-7" aria-hidden="true" />내 주변 정보
            </h2>
            <p className="mt-5 text-lg leading-8">현재 위치를 사용하여 주변 병원과 약국을 안내합니다.</p>
            <p className="mt-36 flex items-center gap-3 text-lg font-bold">
              <Map className="size-6" aria-hidden="true" />
              대구광역시 달서구 계명대 주변
            </p>
          </div>
          <button type="button" onClick={() => router.push("/map")} className="group relative min-h-32 w-full overflow-hidden rounded-xl border border-slate-300 bg-slate-200 text-teal-800">
            <span className="absolute inset-0 bg-[linear-gradient(135deg,#dbeff0_25%,transparent_25%),linear-gradient(45deg,#c8e4e8_25%,transparent_25%)] bg-[length:36px_36px] opacity-70" />
            <span className="relative inline-flex items-center gap-3 rounded-full bg-white/90 px-8 py-4 text-lg font-extrabold shadow">
              <Map className="size-6" aria-hidden="true" />
              지도 크게 보기
            </span>
          </button>
        </aside>
      </section>

      <section className="mt-20">
        <div className="mb-10 flex items-center gap-8">
          <div className="h-px flex-1 bg-slate-400" />
          <h2 className="text-2xl font-extrabold text-slate-700">MediMap 이용 방법</h2>
          <div className="h-px flex-1 bg-slate-400" />
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {[
            { icon: ClipboardPenLine, title: "1. 증상 입력", body: "불편하신 부위와 증상을 텍스트로 자유롭게 작성해주세요." },
            { icon: Stethoscope, title: "2. AI 분석", body: "입력된 정보를 바탕으로 가능한 원인과 주의사항을 분석합니다." },
            { icon: Hospital, title: "3. 병원·약국 찾기", body: "주변 의료 시설을 추천하고 바로 길 안내를 시작합니다." }
          ].map((item) => (
            <div key={item.title} className="card px-8 py-10 text-center">
              <div className="mx-auto mb-8 grid size-20 place-items-center rounded-full bg-teal-700 text-white">
                <item.icon className="size-9" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-extrabold">{item.title}</h3>
              <p className="mt-5 text-lg leading-8 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <Pill className="size-4" aria-hidden="true" />
          의약품 정보는 복용 권고가 아닌 상담 참고 자료입니다.
        </span>
      </div>
    </div>
  );
}
