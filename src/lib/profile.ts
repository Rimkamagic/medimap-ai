"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultPreferredRegion, findPreferredRegion } from "@/data/regions";
import type { UserProfileLocation } from "@/types/health";

interface ProfileRow {
  user_id: string;
  display_name: string | null;
  preferred_region: string;
  preferred_place_name: string;
  preferred_latitude: number;
  preferred_longitude: number;
}

export async function getProfileLocation(supabase: SupabaseClient, userId: string): Promise<UserProfileLocation | null> {
  const { data, error } = await supabase
    .from("medimap_profiles")
    .select("user_id, display_name, preferred_region, preferred_place_name, preferred_latitude, preferred_longitude")
    .eq("user_id", userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    userId: data.user_id,
    displayName: data.display_name,
    preferredRegion: data.preferred_region,
    preferredPlaceName: data.preferred_place_name,
    preferredLatitude: Number(data.preferred_latitude),
    preferredLongitude: Number(data.preferred_longitude)
  };
}

export async function hasProfileLocation(supabase: SupabaseClient, userId: string) {
  const profile = await getProfileLocation(supabase, userId);
  return Boolean(profile);
}

export async function saveProfileLocation(supabase: SupabaseClient, userId: string, regionId: string, displayName?: string) {
  const region = findPreferredRegion(regionId);

  const { error } = await supabase.from("medimap_profiles").upsert({
    user_id: userId,
    display_name: displayName?.trim() || null,
    preferred_region: region.regionName,
    preferred_place_name: region.placeName,
    preferred_latitude: region.latitude,
    preferred_longitude: region.longitude,
    updated_at: new Date().toISOString()
  });

  if (error) {
    throw error;
  }

  return region;
}

export function getDefaultProfileLocation(userId = "default"): UserProfileLocation {
  return {
    userId,
    preferredRegion: defaultPreferredRegion.regionName,
    preferredPlaceName: defaultPreferredRegion.placeName,
    preferredLatitude: defaultPreferredRegion.latitude,
    preferredLongitude: defaultPreferredRegion.longitude
  };
}
