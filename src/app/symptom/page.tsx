"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, ClipboardPenLine, Cross, FileText, Thermometer, Zap } from "lucide-react";
import { symptomSchema, type SymptomFormValues } from "@/lib/schemas";
import { useMediMapStore } from "@/store/useMediMapStore";

const areas = [
  { value: "head", label: "머리/얼굴" },
  { value: "chest", label: "가슴/호흡기" },
  { value: "abdomen", label: "복부/소화기" },
  { value: "limbs", label: "팔/다리/관절" }
];

const ageGroups = [
  { value: "infant", label: "영유아" },
  { value: "teen", label: "청소년" },
  { value: "adult", label: "성인" },
  { value: "middle", label: "중장년" },
  { value: "senior", label: "고령자" }
] as const;

export default function SymptomPage() {
  const router = useRouter();
  const draft = useMediMapStore((state) => state.draft);
  const setDraft = useMediMapStore((state) => state.setDraft);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      symptoms: draft.symptoms ?? "",
      affectedArea: draft.affectedArea ?? "chest",
      onset: draft.onset ?? "방금 전",
      painLevel: draft.painLevel ?? 7,
      fever: draft.fever ?? false,
      trauma: draft.trauma ?? false,
      ageGroup: draft.ageGroup ?? "adult",
      gender: draft.gender ?? "female",
      pregnant: draft.pregnant ?? false,
      allergies: draft.allergies ?? "",
      conditions: draft.conditions ?? "",
      medications: draft.medications ?? "",
      extraDescription: draft.extraDescription ?? "",
      healthConsent: draft.healthConsent ?? false,
      saveHistory: draft.saveHistory ?? false
    }
  });

  function onSubmit(values: SymptomFormValues) {
    setDraft(values);
    router.push("/analysis/loading");
  }

  return (
    <div className="page-shell py-12">
      <div className="mb-9">
        <h1 className="text-4xl font-extrabold">상세 증상 입력</h1>
        <p className="mt-4 text-slate-700">정확한 AI 분석을 위해 현재 겪고 계신 증상을 상세히 알려주세요.</p>
        <div className="mt-7 h-2 rounded-full bg-slate-200">
          <div className="h-2 w-2/3 rounded-full bg-teal-700" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.7fr]">
          <section className="card p-6">
            <h2 className="mb-5 flex items-center gap-2 font-bold">
              <Activity className="size-5 text-teal-800" aria-hidden="true" /> 아픈 부위
            </h2>
            <Controller
              control={control}
              name="affectedArea"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4" role="radiogroup" aria-label="아픈 부위">
                  {areas.map((area) => (
                    <button key={area.value} type="button" onClick={() => field.onChange(area.value)} className={`choice min-h-24 ${field.value === area.value ? "choice-active" : ""}`}>
                      {area.label}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.affectedArea && <p className="error-text">{errors.affectedArea.message}</p>}
          </section>

          <section className="card p-6">
            <h2 className="mb-2 flex items-center gap-2 font-bold">
              <Zap className="size-5 text-red-600" aria-hidden="true" /> 통증 정도
            </h2>
            <p className="text-sm text-slate-600">0(없음) ~ 10(극심함)</p>
            <Controller
              control={control}
              name="painLevel"
              render={({ field }) => (
                <>
                  <input value={field.value} onChange={(event) => field.onChange(Number(event.target.value))} type="range" min="0" max="10" className="mt-8 w-full accent-teal-700" aria-label="통증 정도" />
                  <div className="mt-5 flex justify-between text-2xl font-extrabold text-teal-800">
                    <span>0</span>
                    <span>{field.value}</span>
                    <span>10</span>
                  </div>
                </>
              )}
            />
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-6">
            <label htmlFor="onset" className="mb-4 flex items-center gap-2 font-bold">
              <Thermometer className="size-5 text-teal-800" aria-hidden="true" /> 증상 시작 시점
            </label>
            <select id="onset" {...register("onset")} className="field">
              <option>방금 전</option>
              <option>오늘 아침</option>
              <option>어제부터</option>
              <option>3일 이상</option>
              <option>1주 이상</option>
            </select>
            {errors.onset && <p className="error-text">{errors.onset.message}</p>}
          </section>

          <section className="card grid grid-cols-2 gap-6 p-6">
            <Toggle control={control} name="fever" label="발열 여부" />
            <Toggle control={control} name="trauma" label="외상 여부" />
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="card p-6">
            <h2 className="mb-4 font-bold">나이대</h2>
            <Controller
              control={control}
              name="ageGroup"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {ageGroups.map((group) => (
                    <button key={group.value} type="button" onClick={() => field.onChange(group.value)} className={`choice py-3 ${field.value === group.value ? "choice-active" : ""}`}>
                      {group.label}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.ageGroup && <p className="error-text">{errors.ageGroup.message}</p>}
            <h2 className="mb-4 mt-7 font-bold">성별 및 기타</h2>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => field.onChange("male")} className={`choice ${field.value === "male" ? "choice-active" : ""}`}>
                    남성
                  </button>
                  <button type="button" onClick={() => field.onChange("female")} className={`choice ${field.value === "female" ? "choice-active" : ""}`}>
                    여성
                  </button>
                </div>
              )}
            />
            {errors.gender && <p className="error-text">{errors.gender.message}</p>}
            <label className="mt-4 flex items-center gap-3 rounded-lg bg-slate-100 p-3">
              <input type="checkbox" {...register("pregnant")} className="size-5" />
              임신 여부 (해당 시 체크)
            </label>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold">
              <Cross className="size-5 text-teal-800" aria-hidden="true" /> 의료 이력
            </h2>
            <div className="grid gap-4">
              <label>
                <span className="mb-2 block text-sm font-bold">기저질환</span>
                <input {...register("conditions")} className="field" placeholder="예: 고혈압, 당뇨 등" />
              </label>
              <label>
                <span className="mb-2 block text-sm font-bold">알레르기</span>
                <input {...register("allergies")} className="field" placeholder="예: 항생제 알레르기, 특정 음식 등" />
              </label>
              <label>
                <span className="mb-2 block text-sm font-bold">현재 복용 중인 약</span>
                <input {...register("medications")} className="field" placeholder="예: 아스피린, 비타민 등" />
              </label>
            </div>
          </section>
        </div>

        <section className="card p-6">
          <label htmlFor="symptoms" className="mb-4 flex items-center gap-2 font-bold">
            <ClipboardPenLine className="size-5 text-teal-800" aria-hidden="true" /> 증상 설명
          </label>
          <textarea id="symptoms" {...register("symptoms")} className="field min-h-28" placeholder="주 증상을 자세히 적어주세요." />
          {errors.symptoms && <p className="error-text">{errors.symptoms.message}</p>}
          <label htmlFor="extraDescription" className="mb-4 mt-6 flex items-center gap-2 font-bold">
            <FileText className="size-5 text-teal-800" aria-hidden="true" /> 추가 설명 (선택)
          </label>
          <textarea id="extraDescription" {...register("extraDescription")} className="field min-h-28" placeholder="더 자세한 증상이나 걱정되는 부분을 자유롭게 적어주세요." />
        </section>

        <div className="border-t border-slate-300 pt-7">
          <label className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <input type="checkbox" {...register("healthConsent")} className="mt-1 size-5" />
            <span>
              <strong>건강정보 수집 및 이용 동의 (필수)</strong>
              <br />
              입력하신 정보는 AI 증상 분석 및 의료 정보 제공을 위해서만 사용됩니다. 민감정보로 분류되어 엄격히 보호됩니다.
            </span>
          </label>
          {errors.healthConsent && <p className="error-text">{errors.healthConsent.message}</p>}
          <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5">
            <input type="checkbox" {...register("saveHistory")} className="mt-1 size-5" />
            <span>
              <strong>검색 기록 저장 선택</strong>
              <br />
              선택하지 않으면 증상 입력 내용은 브라우저나 서버에 저장하지 않습니다.
            </span>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.8fr_1.4fr]">
          <button type="button" onClick={() => router.push("/")} className="btn-outline px-6 py-4">
            <ArrowLeft className="size-5" aria-hidden="true" /> 이전 단계로
          </button>
          <button type="submit" className="btn-primary px-6 py-4">
            증상 분석하기
          </button>
        </div>
      </form>
    </div>
  );
}

function Toggle({ control, name, label }: { control: ReturnType<typeof useForm<SymptomFormValues>>["control"]; name: "fever" | "trauma"; label: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="flex flex-col items-center gap-4 font-bold">
          {label}
          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className={`relative h-10 w-20 rounded-full transition ${field.value ? "bg-teal-700" : "bg-slate-300"}`}
            aria-pressed={field.value}
          >
            <span className={`absolute top-1 size-8 rounded-full bg-white shadow transition ${field.value ? "left-11" : "left-1"}`} />
          </button>
        </label>
      )}
    />
  );
}
