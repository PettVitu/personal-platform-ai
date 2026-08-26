"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";

export type AppRoute = "today" | "spreadsheet" | "tasks" | "finance" | "investments" | "agenda" | "more";

const navItems: { route: AppRoute; label: string; icon: "today" | "tasks" | "finance" | "calendar" | "more" }[] = [
  { route: "today", label: "Hoje", icon: "today" },
  { route: "spreadsheet", label: "Planilha", icon: "finance" },
  { route: "tasks", label: "Tarefas", icon: "tasks" },
  { route: "finance", label: "Finanças", icon: "finance" },
  { route: "investments", label: "Investimentos", icon: "finance" },
  { route: "agenda", label: "Agenda", icon: "calendar" },
  { route: "more", label: "Mais", icon: "more" },
];

export function AppShell({ route, onNavigate, children }: { route: AppRoute; onNavigate: (route: AppRoute) => void; children: ReactNode }) {
  const activeLabel = navItems.find((item) => item.route === route)?.label ?? "Hoje";
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => onNavigate("today")} aria-label="Ir para Hoje"><span className="brand-mark">✦</span><span>personal <em>platform AI</em></span></button>
        <p className="eyebrow sidebar-label">Seu espaço pessoal</p>
        <nav className="nav-list" aria-label="Navegação principal">
          {navItems.map((item) => <NavItem key={item.route} item={item} active={route === item.route} onClick={() => onNavigate(item.route)} />)}
        </nav>
        <div className="sidebar-bottom"><div className="privacy-box"><span className="privacy-dot" /> Dados isolados na sua conta</div><button className="settings-link" onClick={() => onNavigate("more")}>Configurações</button><a className="settings-link" href="/api/auth/signout">Sair</a></div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}><Icon name="menu" /></button>
          <div className="breadcrumb"><span className="muted">Personal</span><span>/</span><strong>{activeLabel}</strong></div>
          <button className="assistant-link" onClick={() => onNavigate("more")}><Icon name="assistant" /> Amarildo</button>
        </header>
        {menuOpen && (
          <>
            <button className="mobile-menu-backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />
            <div className="mobile-menu-panel">
              <p className="eyebrow">Seu espaço pessoal</p>
              <button className="mobile-menu-link" onClick={() => { onNavigate("more"); setMenuOpen(false); }}>Configurações</button>
              <a className="mobile-menu-link" href="/api/auth/signout">Sair</a>
            </div>
          </>
        )}
        <div className="view-container">{children}</div>
      </main>
      <nav className="mobile-nav" aria-label="Navegação mobile">{navItems.map((item) => <NavItem key={item.route} item={item} active={route === item.route} mobile onClick={() => onNavigate(item.route)} />)}</nav>
    </div>
  );
}

function NavItem({ item, active, mobile = false, onClick }: { item: typeof navItems[number]; active: boolean; mobile?: boolean; onClick: () => void }) {
  return <button className={`${mobile ? "mobile-nav-item" : "nav-item"} ${active ? "active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}><Icon name={item.icon} /><span>{item.label}</span></button>;
}
