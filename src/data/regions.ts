import type { PreferredRegion } from "@/types/health";

export const preferredRegions: PreferredRegion[] = [
  {
    id: "kmu-seongseo",
    regionName: "대구광역시 달서구",
    placeName: "계명대학교 성서캠퍼스",
    latitude: 35.8534,
    longitude: 128.4809
  },
  {
    id: "daegu-downtown",
    regionName: "대구광역시 중구",
    placeName: "반월당역",
    latitude: 35.8646,
    longitude: 128.5934
  },
  {
    id: "seoul-gangnam",
    regionName: "서울특별시 강남구",
    placeName: "강남역",
    latitude: 37.4979,
    longitude: 127.0276
  },
  {
    id: "seoul-jongno",
    regionName: "서울특별시 종로구",
    placeName: "광화문역",
    latitude: 37.5716,
    longitude: 126.9769
  },
  {
    id: "busan-seomyeon",
    regionName: "부산광역시 부산진구",
    placeName: "서면역",
    latitude: 35.1578,
    longitude: 129.0592
  }
];

export const defaultPreferredRegion = preferredRegions[0];

export function findPreferredRegion(regionId: string) {
  return preferredRegions.find((region) => region.id === regionId) ?? defaultPreferredRegion;
}
