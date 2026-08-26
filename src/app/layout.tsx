import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "personal platform AI",
  icons: { icon: "/icon.svg" },
  description: "Um espaço pessoal para organizar tarefas, compromissos e informações.",
};

// viewportFit "cover" é o que faz o env(safe-area-inset-bottom) usado na navbar
// mobile (overrides.css) funcionar de verdade em telas com barra de gestos/notch.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Roda antes da hidratação pra aplicar o tema salvo sem "flash" do tema claro
// piscando primeiro. A chave precisa bater com THEME_STORAGE_KEY em domain/theme.ts.
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("personal-platform-ai:theme");if(t==="dark"||t==="cyberpunk")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />{children}</body></html>;
}
