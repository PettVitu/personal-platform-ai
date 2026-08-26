import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "personal platform AI",
  icons: { icon: "/icon.svg" },
  description: "Um espaço pessoal para organizar tarefas, compromissos e informações.",
};

// Roda antes da hidratação pra aplicar o tema salvo sem "flash" do tema claro
// piscando primeiro. A chave precisa bater com THEME_STORAGE_KEY em domain/theme.ts.
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("personal-platform-ai:theme");if(t==="dark"||t==="cyberpunk")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />{children}</body></html>;
}
