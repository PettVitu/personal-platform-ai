import type { InvestmentQuote } from "../../domain/types";
import type { WatchlistEntry } from "./watchlist";

const DEMO_FUNDAMENTALS: Record<string, { price: number; dividendYield: number; priceToEarnings: number | null }> = {
  PETR4: { price: 38.42, dividendYield: 12.8, priceToEarnings: 4.1 },
  VALE3: { price: 61.15, dividendYield: 9.4, priceToEarnings: 5.6 },
  ITUB4: { price: 33.87, dividendYield: 6.1, priceToEarnings: 9.2 },
  WEGE3: { price: 39.5, dividendYield: 1.8, priceToEarnings: 28.4 },
  MXRF11: { price: 10.21, dividendYield: 11.9, priceToEarnings: null },
  HGLG11: { price: 162.4, dividendYield: 8.7, priceToEarnings: null },
};

// Ticker fora da lista demonstrativa conhecida (ex.: adicionado manualmente pelo
// usuário) cai num valor neutro, claramente placeholder, em vez de quebrar.
const FALLBACK_DEMO = { price: 10, dividendYield: 5, priceToEarnings: 15 };

type BrapiResult = { symbol: string; regularMarketPrice?: number; longName?: string; priceEarnings?: number | null };

// O plano gratuito da Brapi só aceita 1 ativo por requisição e não libera o
// módulo que traria dividendYield real — por isso uma chamada por ticker, e
// dividendYield continua vindo do valor demonstrativo mesmo com token configurado.
export async function fetchQuotes(watchlist: WatchlistEntry[]): Promise<{ quotes: InvestmentQuote[]; demo: boolean }> {
  const token = process.env.BRAPI_TOKEN;
  const now = new Date().toISOString();
  if (!token) return { quotes: buildDemoQuotes(watchlist, now), demo: true };

  const results = await Promise.all(watchlist.map((entry) => fetchOne(entry.ticker, token)));
  const anyReal = results.some((result) => result !== null);
  const quotes: InvestmentQuote[] = watchlist.map((entry, index) => {
    const found = results[index];
    const demo = DEMO_FUNDAMENTALS[entry.ticker] ?? FALLBACK_DEMO;
    return {
      ticker: entry.ticker,
      name: found?.longName ?? entry.name,
      assetClass: entry.assetClass,
      price: found?.regularMarketPrice ?? demo.price,
      dividendYield: demo.dividendYield,
      priceToEarnings: found ? (found.priceEarnings ?? null) : demo.priceToEarnings,
      updatedAt: now,
    };
  });
  return { quotes, demo: !anyReal };
}

// Usado pela comparação score x retorno real (server/investments/history.ts):
// busca só o preço atual de um ticker, sem watchlist nem fallback demonstrativo —
// se não há token ou a chamada falha, retorna null e quem chamou decide adiar.
export async function fetchCurrentPrice(ticker: string): Promise<number | null> {
  const token = process.env.BRAPI_TOKEN;
  if (!token) return null;
  const result = await fetchOne(ticker, token);
  return result?.regularMarketPrice ?? null;
}

async function fetchOne(ticker: string, token: string): Promise<BrapiResult | null> {
  try {
    const response = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${token}`, { cache: "no-store" });
    if (!response.ok) return null;
    const body = (await response.json()) as { results?: BrapiResult[] };
    return body.results?.[0] ?? null;
  } catch {
    return null;
  }
}

function buildDemoQuotes(watchlist: WatchlistEntry[], now: string): InvestmentQuote[] {
  return watchlist.map((entry) => ({ ticker: entry.ticker, name: entry.name, assetClass: entry.assetClass, ...(DEMO_FUNDAMENTALS[entry.ticker] ?? FALLBACK_DEMO), updatedAt: now }));
}
