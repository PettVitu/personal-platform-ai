export type Theme = "light" | "dark" | "cyberpunk";
export const THEME_STORAGE_KEY = "personal-platform-ai:theme";
export const THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "cyberpunk", label: "Cyberpunk" },
];

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || stored === "cyberpunk" ? stored : "light";
}

export function applyTheme(theme: Theme): void {
  if (theme === "light") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
