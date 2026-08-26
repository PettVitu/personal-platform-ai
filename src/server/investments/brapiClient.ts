import type { AssetClass, InvestmentQuote } from "../../domain/types";

const WATCHLIST: { ticker: string; name: string; assetClass: AssetClass }[] = [
  { ticker: "PETR4", name: "Petrobras PN", assetClass: "acao" },
  { ticker: "VALE3", name: "Vale ON", assetClass: "acao" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", assetClass: "acao" },
  { ticker: "WEGE3", name: "WEG ON", assetClass: "acao" },
  { ticker: "MXRF11", name: "Maxi Renda FII", assetClass: "fii" },
  { ticker: "HGLG11", name: "CSHG Logística FII", assetClass: "fii" },
];

const DEMO_FUNDAMENTALS: Record<string, { price: number; dividendYield: number; priceToEarnings: number | null }> = {
  PETR4: { price: 38.42, dividendYield: 12.8, priceToEarnings: 4.1 },
  VALE3: { price: 61.15, dividendYield: 9.4, priceToEarnings: 5.6 },
  ITUB4: { price: 33.87, dividendYield: 6.1, priceToEarnings: 9.2 },
  WEGE3: { price: 39.5, dividendYield: 1.8, priceToEarnings: 28.4 },
  MXRF11: { price: 10.21, dividendYield: 11.9, priceToEarnings: null },
  HGLG11: { price: 162.4, dividendYield: 8.7, priceToEarnings: null },
};

type BrapiResult = { symbol: string; regularMarketPrice?: number; longName?: string; priceEarnings?: number | null };

export function getWatchlist() {
  return WATCHLIST;
}

// O plano gratuito da Brapi só aceita 1 ativo por requisição e não libera o
// módulo que traria dividendYield real — por isso uma chamada por ticker, e
// dividendYield continua vindo do valor demonstrativo mesmo com token configurado.
export async function fetchQuotes(): Promise<{ quotes: InvestmentQuote[]; demo: boolean }> {
  const token = process.env.BRAPI_TOKEN;
  const now = new Date().toISOString();
  if (!token) return { quotes: buildDemoQuotes(now), demo: true };

  const results = await Promise.all(WATCHLIST.map((entry) => fetchOne(entry.ticker, token)));
  const anyReal = results.some((result) => result !== null);
  const quotes: InvestmentQuote[] = WATCHLIST.map((entry, index) => {
    const found = results[index];
    const demo = DEMO_FUNDAMENTALS[entry.ticker];
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

function buildDemoQuotes(now: string): InvestmentQuote[] {
  return WATCHLIST.map((entry) => ({ ticker: entry.ticker, name: entry.name, assetClass: entry.assetClass, ...DEMO_FUNDAMENTALS[entry.ticker], updatedAt: now }));
}
