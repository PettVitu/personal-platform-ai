import type { Metadata } from "next";
import "../../styles.css";

export const metadata: Metadata = {
  title: "Vibe Coding",
  description: "Aprenda programação criando coisas que você quer mostrar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
