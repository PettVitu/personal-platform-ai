import type { AppData } from "./types";

const STORAGE_KEY = "personal-platform-ai:data:v1";

export function loadAppData(seed: AppData): AppData {
  if (typeof window === "undefined") return seed;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? { ...seed, ...JSON.parse(stored) } : seed;
  } catch {
    return seed;
  }
}

export function saveAppData(data: AppData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
