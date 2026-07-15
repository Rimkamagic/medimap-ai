"use client";

import Link from "next/link";
import { AlertOctagon, CheckCircle2, Cross, MapPin, Phone, Send, ShieldAlert } from "lucide-react";
import { SafetyNotice } from "@/components/SafetyNotice";
import { emergencySignals } from "@/config/emergencySignals";
import { medicalPlaces } from "@/data/places";
import { useMediMapStore } from "@/store/useMediMapStore";

export default function EmergencyPage() {
  const result = useMediMapStore((state) => state.result);
  const matched = result?.emergencyMatchedSignals?.length ? result.emergencyMatchedSignals : ["심한 흉통", "호흡곤란", "의식 저하"];
  const nearestEr = medicalPlaces.find((place) => place.type === "emergency");

  return (
    <div className="page-shell py-10">
      <section className="mx-auto max-w-4xl rounded-2xl bg-red-700 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 font-bold">
              <AlertOctagon className="size-5" aria-hidden="true" /> 긴급 경고 (Critical Alert)
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight">즉시 의료기관의 도움이 필요할 수 있습니다</h1>
            <p className="mt-6 text-lg leading-8">현재 입력된 증상은 응급 상황일 가능성이 높습니다. 지체하지 말고 가까운 응급실을 방문하거나 구조 요청을 하십시오.</p>
          </div>
          <div className="grid gap-4 md:w-72">
            <a href="tel:119" className="rounded-xl bg-white px-6 py-4 text-center text-xl font-extrabold text-red-700">
              <Phone className="mr-2 inline size-5" aria-hidden="true" /> 119 전화하기
            </a>
            <Link href="/map?type=emergency" className="rounded-xl border-2 border-white px-6 py-4 text-center text-xl font-extrabold">
              <Send className="mr-2 inline size-5" aria-hidden="true" /> 가까운 응급실 찾기
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 grid max-w-4xl gap-7 lg:grid-cols-[1fr_320px]">
        <section className="card p-7">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-extrabold text-red-700">
            <ShieldAlert className="size-6" aria-hidden="true" /> 위험 신호 (Red Flags)
          </h2>
          <div className="space-y-4">
            {emergencySignals
              .filter((signal) => matched.includes(signal.label))
              .map((signal) => (
                <div key={signal.id} className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <h3 className="flex items-center gap-3 font-extrabold text-red-700">
                    <Cross className="size-5" aria-hidden="true" /> {signal.label}
                  </h3>
                  <p className="mt-2 text-slate-700">{signal.description}</p>
                </div>
              ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl bg-blue-700 p-7 text-white">
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-extrabold">
              <Cross className="size-6" aria-hidden="true" /> 응급실 방문 수칙
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <CheckCircle2 className="size-5" aria-hidden="true" /> 119 구급차 이용 권장
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="size-5" aria-hidden="true" /> 신분증 지참
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="size-5" aria-hidden="true" /> 음식물 섭취 금지
              </li>
            </ul>
          </div>
          {nearestEr && (
            <div className="rounded-xl border border-slate-300 bg-slate-200 p-6">
              <p className="text-sm font-bold">현재 위치 기반 추천</p>
              <h3 className="mt-3 text-lg font-extrabold">{nearestEr.name}</h3>
              <p className="mt-2 flex gap-2 text-sm">
                <MapPin className="size-4 text-red-700" aria-hidden="true" /> {nearestEr.address}
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-slate-300 bg-slate-300 shadow-lg">
        <div className="min-h-72 bg-[radial-gradient(circle_at_55%_48%,#e52b2b_0_4%,transparent_5%),linear-gradient(35deg,transparent_48%,#b8d5d2_49%,#b8d5d2_51%,transparent_52%),linear-gradient(120deg,transparent_46%,#d0dddd_47%,#d0dddd_51%,transparent_52%)] bg-[length:100%_100%,220px_220px,300px_300px] p-7 text-white">
          <div className="mt-36">
            <h2 className="text-2xl font-extrabold drop-shadow">가장 가까운 3차 병원 응급실</h2>
            <p className="mt-2 drop-shadow">현재 교통 상황 및 대기시간은 실제 기관에 확인하세요.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <SafetyNotice />
      </div>
    </div>
  );
}
