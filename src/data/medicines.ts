import type { Medicine } from "@/types/health";

export const medicines: Medicine[] = [
  {
    itemSeq: "MOCK-ACET-500",
    itemName: "타이레놀정 500mg",
    companyName: "한국존슨앤드존슨판매(주)",
    classification: "일반의약품",
    ingredients: ["아세트아미노펜 500mg"],
    efficacy: "감기로 인한 발열 및 통증, 두통, 신경통, 근육통, 월경통 등의 완화에 쓰이는 성분 정보를 제공합니다.",
    usage: "성인 및 12세 이상 소아는 제품 표시와 약사 상담에 따라 복용 여부와 용량을 확인하세요.",
    precautions: "간 질환이 있거나 매일 세 잔 이상 정기적으로 술을 마시는 경우 반드시 전문가와 상담하세요.",
    interactions: "다른 해열진통제, 감기약과 함께 사용할 경우 성분이 중복될 수 있어 주의가 필요합니다.",
    sideEffects: "발진, 두드러기, 구역, 구토 등이 나타날 수 있으며 이상 증상 지속 시 복용을 중단하고 상담하세요.",
    storage: "밀폐용기, 실온(1~30도) 보관. 어린이의 손이 닿지 않는 곳에 보관하세요.",
    sourceUrl: "https://nedrug.mfds.go.kr"
  },
  {
    itemSeq: "MOCK-IBU-200",
    itemName: "이부프로펜정 200mg",
    companyName: "메디맵제약",
    classification: "일반의약품",
    ingredients: ["이부프로펜 200mg"],
    efficacy: "두통, 치통, 근육통, 관절통, 발열 완화에 사용되는 성분 정보를 제공합니다.",
    usage: "식후 복용 여부와 용량은 제품 표시 및 약사 상담을 통해 확인하세요.",
    precautions: "위장관 출혈 병력, 신장 질환, 임신 후기에는 사용 전 의료진 상담이 필요합니다.",
    interactions: "항응고제, 스테로이드, 다른 NSAIDs와 병용 시 출혈 또는 위장 장애 위험이 증가할 수 있습니다.",
    sideEffects: "속쓰림, 복통, 발진, 부종 등이 나타날 수 있습니다.",
    storage: "습기를 피해 실온 보관하세요.",
    sourceUrl: "https://nedrug.mfds.go.kr"
  },
  {
    itemSeq: "MOCK-ANTACID",
    itemName: "위편한 제산정",
    companyName: "대구헬스케어",
    classification: "일반의약품",
    ingredients: ["수산화마그네슘", "탄산칼슘"],
    efficacy: "속쓰림, 위산 과다, 위부 불쾌감 완화에 쓰이는 성분 정보를 제공합니다.",
    usage: "증상 발생 시 제품 표시를 확인하고 약사와 상담할 수 있습니다.",
    precautions: "신장 질환이 있거나 다른 약을 복용 중이면 상호작용 상담이 필요합니다.",
    interactions: "일부 항생제와 갑상선약의 흡수를 방해할 수 있어 복용 간격 상담이 필요합니다.",
    sideEffects: "변비 또는 설사가 나타날 수 있습니다.",
    storage: "직사광선을 피해 건조한 곳에 보관하세요.",
    sourceUrl: "https://nedrug.mfds.go.kr"
  }
];

export function searchMockMedicines(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return medicines;
  return medicines.filter((medicine) => {
    const haystack = [medicine.itemName, medicine.companyName, medicine.classification, ...medicine.ingredients, medicine.efficacy].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}

export function findMockMedicine(id: string) {
  return medicines.find((medicine) => medicine.itemSeq === id);
}
