"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Info, LocateFixed, MapPin, Navigation, Phone, Search } from "lucide-react";
import { kmuCenter, medicalPlaces } from "@/data/places";
import { calculateDistanceKm } from "@/lib/distance";
import type { MedicalPlace } from "@/types/health";

type PlaceType = "all" | MedicalPlace["type"];

interface NaverMapInstance {
  setCenter(center: unknown): void;
  setZoom(zoom: number): void;
}

interface NaverMarkerInstance {
  setMap(map: NaverMapInstance | null): void;
}

interface NaverInfoWindow {
  open(map: NaverMapInstance, marker: NaverMarkerInstance): void;
}

interface NaverMapsApi {
  maps?: {
    Map?: new (element: HTMLElement, options: Record<string, unknown>) => NaverMapInstance;
    LatLng?: new (latitude: number, longitude: number) => unknown;
    Marker?: new (options: Record<string, unknown>) => NaverMarkerInstance;
    InfoWindow?: new (options: Record<string, unknown>) => NaverInfoWindow;
    Event?: { addListener(target: object, eventName: string, listener: () => void): void };
  };
}

declare global {
  interface Window {
    naver?: NaverMapsApi;
    __medimapNaverMapReady?: () => void;
  }
}

const NAVER_SCRIPT_ID = "naver-map-script";
const NAVER_CALLBACK_NAME = "__medimapNaverMapReady";

function isNaverMapsReady() {
  const maps = window.naver?.maps;
  return Boolean(maps?.Map && maps.LatLng && maps.Marker && maps.InfoWindow && maps.Event);
}

export function MapExperience({ initialType = "all" }: { initialType?: PlaceType }) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim();
  const [selectedType, setSelectedType] = useState<PlaceType>(initialType);
  const [distance, setDistance] = useState(3);
  const [position, setPosition] = useState(kmuCenter);
  const [locationDenied, setLocationDenied] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [activePlace, setActivePlace] = useState<MedicalPlace | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const naverMap = useRef<NaverMapInstance | null>(null);
  const markers = useRef<NaverMarkerInstance[]>([]);

  const places = useMemo(() => {
    return medicalPlaces
      .map((place) => ({ ...place, distance: calculateDistanceKm(position, place) }))
      .filter((place) => (selectedType === "all" ? true : place.type === selectedType))
      .filter((place) => (place.distance ?? 0) <= distance)
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [distance, position, selectedType]);

  useEffect(() => {
    if (!navigator.geolocation) {
      const id = window.setTimeout(() => setLocationDenied(true), 0);
      return () => window.clearTimeout(id);
    }

    navigator.geolocation.getCurrentPosition(
      (current) => {
        setPosition({ latitude: current.coords.latitude, longitude: current.coords.longitude });
      },
      () => setLocationDenied(true),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    if (!clientId || !mapRef.current || mapUnavailable) return;

    let cancelled = false;
    const initialize = () => {
      if (cancelled || !mapRef.current || naverMap.current) return;

      if (!isNaverMapsReady()) {
        setMapUnavailable(true);
        return;
      }

      const maps = window.naver!.maps!;
      const LatLng = maps.LatLng!;
      const Map = maps.Map!;
      const center = new LatLng(position.latitude, position.longitude);
      naverMap.current = new Map(mapRef.current, { center, zoom: 15 });
      setMapReady(true);
      setMapUnavailable(false);
    };

    window.__medimapNaverMapReady = initialize;

    if (isNaverMapsReady()) {
      initialize();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.getElementById(NAVER_SCRIPT_ID);
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = NAVER_SCRIPT_ID;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}&callback=${NAVER_CALLBACK_NAME}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        if (!cancelled) setMapUnavailable(true);
      };
      document.head.appendChild(script);
    }

    const timeoutId = window.setTimeout(() => {
      if (!cancelled && !isNaverMapsReady()) {
        setMapUnavailable(true);
      }
    }, 10000);

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [clientId, mapUnavailable, position.latitude, position.longitude]);

  useEffect(() => {
    if (!mapReady || !naverMap.current || !isNaverMapsReady()) return;

    const maps = window.naver!.maps!;
    const LatLng = maps.LatLng!;
    const Marker = maps.Marker!;
    const InfoWindow = maps.InfoWindow!;
    const Event = maps.Event!;

    markers.current.forEach((marker) => marker.setMap(null));

    try {
      markers.current = places.map((place) => {
        const marker = new Marker({
          position: new LatLng(place.latitude, place.longitude),
          map: naverMap.current,
          title: place.name
        });
        const info = new InfoWindow({
          content: `<div style="padding:10px;font-weight:700">${place.name}</div>`
        });

        Event.addListener(marker, "click", () => {
          setActivePlace(place);
          info.open(naverMap.current!, marker);
        });

        return marker;
      });
    } catch {
      window.setTimeout(() => setMapUnavailable(true), 0);
    }
  }, [mapReady, places]);

  useEffect(() => {
    if (!mapReady || !naverMap.current || !isNaverMapsReady()) return;

    const LatLng = window.naver!.maps!.LatLng!;
    naverMap.current.setCenter(new LatLng(position.latitude, position.longitude));
  }, [mapReady, position.latitude, position.longitude]);

  function focusPlace(place: MedicalPlace) {
    setActivePlace(place);

    if (isNaverMapsReady() && naverMap.current) {
      const LatLng = window.naver!.maps!.LatLng!;
      naverMap.current.setCenter(new LatLng(place.latitude, place.longitude));
      naverMap.current.setZoom(16);
    }
  }

  const showNaverMap = Boolean(clientId && !mapUnavailable);

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[480px_1fr]">
      <aside className="border-r border-slate-300 bg-white">
        <div className="space-y-5 border-b border-slate-300 p-5">
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="장소 종류 필터">
            {[
              ["all", "전체"],
              ["hospital", "병원"],
              ["pharmacy", "약국"],
              ["emergency", "응급실"]
            ].map(([value, label]) => (
              <button key={value} type="button" onClick={() => setSelectedType(value as PlaceType)} className={`rounded-full px-5 py-3 font-extrabold ${selectedType === value ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-800"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="sr-only">거리 필터</span>
              <select value={distance} onChange={(event) => setDistance(Number(event.target.value))} className="field">
                <option value={1}>1km</option>
                <option value={3}>3km</option>
                <option value={5}>5km</option>
              </select>
            </label>
            <button type="button" onClick={() => setPosition(kmuCenter)} className="rounded-lg border border-slate-300 px-4 py-3 font-bold">
              현재 위치로 이동
            </button>
          </div>
          {locationDenied && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700" role="status">
              위치 권한이 거절되어 계명대학교 주변 mock 위치를 기준으로 표시합니다. 정확한 위치는 저장하지 않습니다.
            </div>
          )}
          <p className="flex gap-2 text-sm text-slate-700">
            <Info className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
            영업시간은 실제 정보와 다를 수 있으므로 방문 전 전화 확인이 필요합니다.
          </p>
        </div>
        <div className="space-y-4 p-5">
          {places.length === 0 ? (
            <div className="rounded-xl border border-slate-200 p-6 text-center text-slate-600">조건에 맞는 의료기관이 없습니다.</div>
          ) : (
            places.map((place) => <PlaceCard key={place.id} place={place} active={activePlace?.id === place.id} onFocus={() => focusPlace(place)} />)
          )}
        </div>
      </aside>

      <section className="relative min-h-[680px] overflow-hidden bg-slate-200">
        {showNaverMap ? (
          <>
            <div ref={mapRef} className="absolute inset-0" aria-label="네이버 지도" />
            {!mapReady && <div className="absolute left-6 top-6 z-10 rounded-lg bg-white/90 p-3 text-sm font-semibold text-slate-700 shadow">네이버 지도를 불러오는 중입니다.</div>}
          </>
        ) : (
          <MockMap places={places} activePlace={activePlace} onFocus={focusPlace} hasClientId={Boolean(clientId)} />
        )}
        <div className="absolute left-1/2 top-8 z-10 flex w-[min(560px,calc(100%-2rem))] -translate-x-1/2 items-center gap-4 rounded-full border border-slate-300 bg-white px-8 py-5 shadow-2xl">
          <Search className="size-6 text-teal-800" aria-hidden="true" />
          <input className="w-full outline-none" placeholder="병원 또는 약국 검색" aria-label="병원 또는 약국 검색" />
          <button className="border-l border-slate-300 pl-5 font-extrabold text-teal-800">검색</button>
        </div>
        <button type="button" onClick={() => setPosition(kmuCenter)} className="absolute bottom-8 right-8 z-10 grid size-14 place-items-center rounded-lg bg-white shadow-lg" aria-label="현재 위치로 이동">
          <Crosshair className="size-6" />
        </button>
      </section>
    </div>
  );
}

function PlaceCard({ place, active, onFocus }: { place: MedicalPlace; active: boolean; onFocus: () => void }) {
  const typeLabel = place.type === "emergency" ? "ER" : place.type === "pharmacy" ? "약국" : "병원";

  return (
    <article className={`rounded-xl border p-5 shadow-sm ${active ? "border-teal-700 bg-teal-50" : "border-slate-300 bg-white"}`}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-extrabold">{place.name}</h2>
        <span className="font-extrabold text-teal-800">{place.distance ? `${place.distance < 1 ? Math.round(place.distance * 1000) + "m" : place.distance.toFixed(1) + "km"}` : typeLabel}</span>
      </div>
      <p className="mt-4 text-slate-700">{place.departments?.join(", ")}</p>
      <p className="mt-2 text-slate-700">{place.address}</p>
      <p className="mt-2 flex items-center gap-2 text-slate-700">
        <Phone className="size-4" aria-hidden="true" /> {place.phone}
      </p>
      <p className={`mt-3 font-bold ${place.type === "emergency" ? "text-red-700" : "text-teal-800"}`}>{place.openingHours}</p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <a href={`tel:${place.phone}`} className="btn-outline py-3">
          전화
        </a>
        <button type="button" onClick={onFocus} className="btn-outline py-3">
          상세
        </button>
        <button type="button" onClick={onFocus} className="btn-primary py-3">
          <Navigation className="size-4" aria-hidden="true" /> 길찾기
        </button>
      </div>
    </article>
  );
}

function MockMap({ places, activePlace, onFocus, hasClientId }: { places: MedicalPlace[]; activePlace: MedicalPlace | null; onFocus: (place: MedicalPlace) => void; hasClientId: boolean }) {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(35deg,transparent_48%,#b8d5d2_49%,#b8d5d2_51%,transparent_52%),linear-gradient(120deg,transparent_46%,#d0dddd_47%,#d0dddd_51%,transparent_52%),linear-gradient(#e8eef0_1px,transparent_1px),linear-gradient(90deg,#e8eef0_1px,transparent_1px)] bg-[length:260px_260px,320px_320px,80px_80px,80px_80px]">
      <div className="absolute left-6 top-6 max-w-md rounded-lg bg-white/90 p-3 text-sm font-semibold text-slate-700 shadow">
        {hasClientId
          ? "네이버 지도 SDK가 준비되지 않아 mock 지도를 표시합니다. 네이버 콘솔에서 Web 서비스 URL, Web Dynamic Map 사용 여부, Client ID 값을 확인해 주세요."
          : "API 키가 없어서 mock 지도 영역을 표시합니다. .env.local 또는 배포 환경변수에 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID를 설정하면 네이버 지도가 연결됩니다."}
      </div>
      <div className="absolute left-[45%] top-[48%] flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 font-bold text-white shadow">
        <LocateFixed className="size-4" aria-hidden="true" /> 현재 위치
      </div>
      {places.map((place, index) => (
        <button
          key={place.id}
          type="button"
          onClick={() => onFocus(place)}
          className={`absolute grid size-14 place-items-center rounded-full border-4 border-white font-extrabold text-white shadow-xl ${place.type === "emergency" ? "bg-red-700" : place.type === "pharmacy" ? "bg-teal-700" : "bg-blue-700"}`}
          style={{ left: `${36 + index * 11}%`, top: `${32 + (index % 3) * 14}%` }}
          aria-label={`${place.name} 마커`}
        >
          <MapPin className="size-7" aria-hidden="true" />
        </button>
      ))}
      {activePlace && <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-white px-5 py-3 font-bold shadow-xl">{activePlace.name}</div>}
    </div>
  );
}
