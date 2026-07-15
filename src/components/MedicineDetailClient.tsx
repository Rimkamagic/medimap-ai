"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, Info, Pill, ShieldCheck, TriangleAlert } from "lucide-react";
import { SafetyNotice, PrivacyBadge } from "@/components/SafetyNotice";
import type { Medicine } from "@/types/health";

export function MedicineDetailClient({ id }: { id: string }) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMedicine() {
      try {
        const response = await fetch(`/api/medicines/${encodeURIComponent(id)}`);
        const payload = (await response.json()) as { medicine?: Medicine; error?: string };

        if (!response.ok || !payload.medicine) {
          throw new Error(payload.error ?? "의약품 정보를 찾을 수 없습니다.");
        }

        if (!cancelled) {
          setMedicine(payload.medicine);
        }
      } catch {
        if (!cancelled) {
          setError("의약품 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadMedicine();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell py-10">
        <div className="card p-8 text-center">
          <p className="text-lg font-bold text-teal-800">의약품 정보를 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="page-shell py-10">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-extrabold">의약품 정보를 찾을 수 없습니다</h1>
          <p className="mt-3 text-slate-700">{error}</p>
          <Link href="/analysis/result" className="btn-primary mt-6 px-6 py-3">
            분석 결과로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const isPrescription = medicine.classification.includes("전문의약품");

  return (
    <div className="page-shell py-10">
      <Link href="/analysis/result" className="mb-8 inline-flex items-center gap-3 text-lg font-bold text-teal-800">
        <ArrowLeft className="size-5" aria-hidden="true" />
        MediMap AI
      </Link>

      <section className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="card grid min-h-72 place-items-center p-8">
          <div className="w-full rounded-lg bg-slate-100 p-7 text-center shadow-inner">
            <Pill className="mx-auto size-16 text-teal-700" aria-hidden="true" />
            <p className="mt-5 text-sm text-slate-600">의약품 상세정보 화면</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-3">
            <span className={`rounded-full px-4 py-2 text-sm font-bold text-white ${isPrescription ? "bg-red-700" : "bg-blue-700"}`}>{medicine.classification}</span>
            <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold">내복약</span>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold">{medicine.itemName}</h1>
          <p className="mt-6 text-xl">{medicine.companyName}</p>
          <div className="mt-8">
            <PrivacyBadge />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="card p-6">
          <h2 className="mb-5 flex items-center gap-3 font-extrabold text-teal-800">
            <Pill className="size-5" aria-hidden="true" /> 주성분
          </h2>
          <p className="text-lg">{medicine.ingredients.join(", ")}</p>
          <p className="mt-5 text-sm text-slate-600">정확한 성분 함량은 제품 표시를 확인하세요.</p>
        </div>

        <div className="rounded-xl bg-teal-800 p-7 text-white shadow-lg">
          <h2 className="mb-5 flex items-center gap-3 font-extrabold">
            <ShieldCheck className="size-6" aria-hidden="true" /> 효능 / 효과
          </h2>
          <p className="text-lg leading-9">{medicine.efficacy}</p>
        </div>
      </section>

      <section className="card mt-6 p-7">
        <h2 className="mb-6 flex items-center gap-3 text-xl font-extrabold">
          <CalendarDays className="size-6 text-teal-800" aria-hidden="true" /> 사용방법
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex gap-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-50 font-extrabold text-teal-800">01</span>
            <p className="leading-8">{medicine.usage}</p>
          </div>
          <div className="flex gap-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-red-100 font-extrabold text-red-700">!</span>
            <p className="leading-8">최대 용량, 복용 간격, 병용 가능 여부는 의사 또는 약사와 상담하세요.</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.45fr]">
        <div className="card p-7">
          <h2 className="mb-5 flex items-center gap-3 text-xl font-extrabold text-red-700">
            <TriangleAlert className="size-6" aria-hidden="true" /> 주의사항
          </h2>
          <ul className="list-disc space-y-3 pl-5 leading-8">
            <li>{medicine.precautions}</li>
            <li>{medicine.interactions}</li>
          </ul>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-3 font-extrabold">
              <Info className="size-5" aria-hidden="true" /> 부작용
            </h2>
            <p className="leading-7">{medicine.sideEffects}</p>
          </div>
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-3 font-extrabold">
              <Pill className="size-5" aria-hidden="true" /> 보관방법
            </h2>
            <p className="leading-7">{medicine.storage}</p>
          </div>
        </div>
      </section>

      <div className="mt-9 text-center">
        <a href={medicine.sourceUrl} target="_blank" rel="noreferrer" className="btn-primary px-9 py-4">
          식품의약품안전처 의약품안전나라 원문 보기
          <ExternalLink className="size-5" aria-hidden="true" />
        </a>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <SafetyNotice />
      </div>
    </div>
  );
}
