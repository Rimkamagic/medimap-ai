import type { SearchHistoryItem } from "@/types/health";

export const historySeed: SearchHistoryItem[] = [
  {
    id: "seed-1",
    createdAt: new Date().toISOString(),
    summary: "심한 가슴 통증 및 호흡 곤란",
    urgency: "EMERGENCY",
    departments: ["내과", "응급의학과"]
  },
  {
    id: "seed-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    summary: "눈의 피로 및 이물감",
    urgency: "ROUTINE",
    departments: ["안과"]
  },
  {
    id: "seed-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    summary: "발목 염좌 및 부기",
    urgency: "ROUTINE",
    departments: ["정형외과"]
  }
];
