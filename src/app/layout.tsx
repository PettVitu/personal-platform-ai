import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "personal platform AI",
  description: "Um espaço pessoal para organizar tarefas, compromissos e informações.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
