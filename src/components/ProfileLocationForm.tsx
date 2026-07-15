"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, MapPin, Save } from "lucide-react";
import { preferredRegions } from "@/data/regions";
import { getProfileLocation, saveProfileLocation } from "@/lib/profile";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ProfileLocationForm() {
  const router = useRouter();
  const [regionId, setRegionId] = useState(preferredRegions[0]?.id ?? "");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      const id = window.setTimeout(() => {
        setError("Supabase 환경변수가 설정되어 있지 않습니다.");
        setLoading(false);
      }, 0);
      return () => window.clearTimeout(id);
    }

    const client = supabase;

    let mounted = true;

    async function loadProfile() {
      const { data } = await client.auth.getUser();

      if (!mounted) return;

      if (!data.user) {
        router.push("/login");
        return;
      }

      setDisplayName((data.user.user_metadata?.display_name as string | undefined) ?? "");

      const profile = await getProfileLocation(client, data.user.id);
      if (!mounted) return;

      if (profile) {
        const matchedRegion = preferredRegions.find((region) => region.placeName === profile.preferredPlaceName);
        if (matchedRegion) {
          setRegionId(matchedRegion.id);
        }
      }

      setLoading(false);
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase 환경변수가 설정되어 있지 않습니다.");
      return;
    }

    setSaving(true);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      const region = await saveProfileLocation(supabase, data.user.id, regionId, displayName);
      setMessage(`${region.placeName} 기준으로 저장했습니다.`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "기준 지역 저장 중 문제가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-shell py-14">
        <div className="card mx-auto max-w-2xl p-8 text-center font-bold text-slate-700">기준 지역을 불러오는 중입니다.</div>
      </div>
    );
  }

  return (
    <div className="page-shell py-14">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-extrabold text-teal-800">
            <LocateFixed className="size-4" aria-hidden="true" />
            위치정보 최소 저장
          </p>
          <h1 className="text-3xl font-extrabold">기준 지역 설정</h1>
          <p className="mt-3 text-slate-700">정확한 현재 좌표 대신 지역/랜드마크 기준 위치만 저장합니다. 지도에서 현재 위치 권한을 거절하면 이 위치를 기준으로 병원과 약국을 정렬합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6 p-8">
          <label>
            <span className="mb-2 block font-bold">표시 이름</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="field" placeholder="홍길동" autoComplete="name" />
          </label>

          <fieldset>
            <legend className="mb-3 font-bold">기준 지역</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {preferredRegions.map((region) => (
                <label key={region.id} className={`cursor-pointer rounded-xl border p-4 ${regionId === region.id ? "border-teal-700 bg-teal-50" : "border-slate-300 bg-white"}`}>
                  <input type="radio" name="preferredRegion" value={region.id} checked={regionId === region.id} onChange={() => setRegionId(region.id)} className="sr-only" />
                  <span className="flex items-start gap-3">
                    <MapPin className="mt-1 size-5 shrink-0 text-teal-800" aria-hidden="true" />
                    <span>
                      <span className="block text-lg font-extrabold">{region.placeName}</span>
                      <span className="mt-1 block text-sm text-slate-600">{region.regionName}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-teal-800" role="status">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="btn-primary px-6 py-4" disabled={saving}>
              <Save className="size-5" aria-hidden="true" />
              {saving ? "저장 중..." : "기준 지역 저장"}
            </button>
            <button type="button" onClick={() => router.push("/map")} className="btn-outline px-6 py-4">
              지도 보기
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
