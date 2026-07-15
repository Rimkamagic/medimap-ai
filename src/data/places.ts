import type { MedicalPlace } from "@/types/health";

export const kmuCenter = {
  latitude: 35.8534,
  longitude: 128.4809
};

export const medicalPlaces: MedicalPlace[] = [
  {
    id: "dongsan-er",
    type: "emergency",
    name: "계명대학교 동산병원 응급의료센터",
    departments: ["응급의학과", "내과", "외과"],
    latitude: 35.8539,
    longitude: 128.4802,
    address: "대구광역시 달서구 달구벌대로 1035",
    phone: "053-258-6301",
    openingHours: "24시간 응급진료"
  },
  {
    id: "kmu-family",
    type: "hospital",
    name: "계명가정의학과의원",
    departments: ["가정의학과", "내과"],
    latitude: 35.8518,
    longitude: 128.4826,
    address: "대구광역시 달서구 호산동로 12",
    phone: "053-555-1020",
    openingHours: "09:00-18:00"
  },
  {
    id: "seongseo-ortho",
    type: "hospital",
    name: "성서정형외과의원",
    departments: ["정형외과", "재활의학과"],
    latitude: 35.8551,
    longitude: 128.4841,
    address: "대구광역시 달서구 계대동문로 45",
    phone: "053-584-2001",
    openingHours: "09:00-19:00"
  },
  {
    id: "hope-pharmacy",
    type: "pharmacy",
    name: "희망약국",
    departments: ["일반의약품", "복약 상담"],
    latitude: 35.8528,
    longitude: 128.4792,
    address: "대구광역시 달서구 달구벌대로 1011",
    phone: "053-987-6543",
    openingHours: "08:30-21:00"
  },
  {
    id: "campus-pharmacy",
    type: "pharmacy",
    name: "캠퍼스온누리약국",
    departments: ["처방 조제", "건강기능식품"],
    latitude: 35.8548,
    longitude: 128.4779,
    address: "대구광역시 달서구 신당로 58",
    phone: "053-581-7788",
    openingHours: "09:00-20:00"
  }
];
