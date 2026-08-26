import { randomUUID } from "node:crypto";
import type { InvestmentHistoryEntry, InvestmentSuggestion } from "../../domain/types";

const MAX_ENTRIES = 200;

// Adaptador temporário em memória. Deve ser substituído por persistência real
// antes de comparar sugestões passadas com resultado de mercado observado depois.
// Guardado em globalThis porque o Next.js empacota cada rota de API separadamente
// em desenvolvimento: um módulo comum importado por rotas diferentes acaba duplicado,
// e cada cópia teria seu próprio array se o estado vivesse numa variável de módulo.
declare global {
  // eslint-disable-next-line no-var
  var __investmentHistory: InvestmentHistoryEntry[] | undefined;
}

function store(): InvestmentHistoryEntry[] {
  if (!globalThis.__investmentHistory) globalThis.__investmentHistory = [];
  return globalThis.__investmentHistory;
}

export function recordSuggestions(suggestions: InvestmentSuggestion[], demo: boolean): void {
  const entries: InvestmentHistoryEntry[] = suggestions.map((item) => ({
    id: randomUUID(),
    ticker: item.ticker,
    score: item.score,
    scoreBreakdown: item.scoreBreakdown,
    asOf: item.asOf,
    demo,
  }));
  globalThis.__investmentHistory = [...entries, ...store()].slice(0, MAX_ENTRIES);
}

export function getHistory(): InvestmentHistoryEntry[] {
  return store();
}
