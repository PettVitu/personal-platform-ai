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

type BrapiResult = { symbol: string; regularMarketPrice?: number; longName?: string; dividendYield?: number; priceEarnings?: number };

export function getWatchlist() {
  return WATCHLIST;
}

export async function fetchQuotes(): Promise<{ quotes: InvestmentQuote[]; demo: boolean }> {
  const token = process.env.BRAPI_TOKEN;
  const now = new Date().toISOString();
  if (!token) return { quotes: buildDemoQuotes(now), demo: true };
  try {
    const tickers = WATCHLIST.map((item) => item.ticker).join(",");
    const response = await fetch(`https://brapi.dev/api/quote/${tickers}?token=${token}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`brapi respondeu ${response.status}`);
    const body = (await response.json()) as { results?: BrapiResult[] };
    if (!body.results?.length) throw new Error("brapi sem resultados");
    const quotes: InvestmentQuote[] = WATCHLIST.map((entry) => {
      const found = body.results!.find((item) => item.symbol === entry.ticker);
      const demo = DEMO_FUNDAMENTALS[entry.ticker];
      return {
        ticker: entry.ticker,
        name: found?.longName ?? entry.name,
        assetClass: entry.assetClass,
        price: found?.regularMarketPrice ?? demo.price,
        dividendYield: found?.dividendYield ?? demo.dividendYield,
        priceToEarnings: found?.priceEarnings ?? demo.priceToEarnings,
        updatedAt: now,
      };
    });
    return { quotes, demo: false };
  } catch {
    return { quotes: buildDemoQuotes(now), demo: true };
  }
}

function buildDemoQuotes(now: string): InvestmentQuote[] {
  return WATCHLIST.map((entry) => ({ ticker: entry.ticker, name: entry.name, assetClass: entry.assetClass, ...DEMO_FUNDAMENTALS[entry.ticker], updatedAt: now }));
}
