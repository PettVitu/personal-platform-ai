import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <section className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{description}</p></div>{action}</section>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-icon"><Icon name="plus" /></div><strong>{title}</strong><p>{description}</p>{action}</div>;
}

export function Button({ children, variant = "primary", onClick, type = "button" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost"; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} className={`${variant}-button`} onClick={onClick}>{children}</button>;
}

export const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const formatDate = (value: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`)).replace(" de ", " ");
