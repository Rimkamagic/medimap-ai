import { AlertTriangle, ShieldCheck } from "lucide-react";

export function SafetyNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-xl border border-red-200 bg-red-50 text-red-700 ${compact ? "px-4 py-3 text-sm" : "px-6 py-5"}`} role="note">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p>
          이 서비스의 AI 분석은 참고용이며 의료진의 진단을 대신하지 않습니다. 증상이 심하거나 지속되면 의료기관을 방문하세요. 의약품 복용 전 의사 또는 약사와 상담하세요.
        </p>
      </div>
    </div>
  );
}

export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800">
      <ShieldCheck className="size-4" aria-hidden="true" />
      데이터 보호됨: 민감 정보는 선택 시에만 저장
    </div>
  );
}
