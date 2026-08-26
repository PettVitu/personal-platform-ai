import type { AppData } from "./types";

const STORAGE_KEY = "personal-platform-ai:data:v1";

export function loadAppData(seed: AppData): AppData {
  if (typeof window === "undefined") return seed;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return seed;
    const parsed = JSON.parse(stored) as Partial<AppData>;
    return {
      ...seed,
      ...parsed,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks.filter(Boolean) : seed.tasks,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions.filter(Boolean) : seed.transactions,
      bills: Array.isArray(parsed.bills) ? parsed.bills.filter(Boolean) : seed.bills,
      appointments: Array.isArray(parsed.appointments) ? parsed.appointments.filter(Boolean) : seed.appointments,
      documents: Array.isArray(parsed.documents) ? parsed.documents.filter(Boolean) : seed.documents,
      budgetCategories: Array.isArray(parsed.budgetCategories) ? parsed.budgetCategories.filter(Boolean) : seed.budgetCategories,
    };
  } catch {
    return seed;
  }
}

export function saveAppData(data: AppData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
