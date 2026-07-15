"use client";

const deviceIdKey = "medimap-device-id";

export function getDeviceId() {
  const existing = window.localStorage.getItem(deviceIdKey);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(deviceIdKey, next);
  return next;
}
