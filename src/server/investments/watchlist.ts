import type { AssetClass } from "../../domain/types";
import { prisma } from "../db";

export type WatchlistEntry = { ticker: string; name: string; assetClass: AssetClass };

export const DEFAULT_WATCHLIST: WatchlistEntry[] = [
  { ticker: "PETR4", name: "Petrobras PN", assetClass: "acao" },
  { ticker: "VALE3", name: "Vale ON", assetClass: "acao" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", assetClass: "acao" },
  { ticker: "WEGE3", name: "WEG ON", assetClass: "acao" },
  { ticker: "MXRF11", name: "Maxi Renda FII", assetClass: "fii" },
  { ticker: "HGLG11", name: "CSHG Logística FII", assetClass: "fii" },
];

const MAX_TICKERS = 15;
const TICKER_PATTERN = /^[A-Z]{4}[0-9]{1,2}$/;

export function isValidTicker(value: string): boolean {
  return TICKER_PATTERN.test(value);
}

// Heurística B3: FII/fundo geralmente termina em 11 (nem sempre — units e BDRs
// também usam 11 —, mas é a melhor aproximação sem consultar um cadastro real).
function guessAssetClass(ticker: string): AssetClass {
  return ticker.endsWith("11") ? "fii" : "acao";
}

export async function getWatchlistForUser(userId: string | null): Promise<{ entries: WatchlistEntry[]; isDefault: boolean }> {
  if (!userId) return { entries: DEFAULT_WATCHLIST, isDefault: true };
  const rows = await prisma.watchlistItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  if (rows.length === 0) return { entries: DEFAULT_WATCHLIST, isDefault: true };
  return { entries: rows.map((row) => ({ ticker: row.ticker, name: row.name, assetClass: row.assetClass as AssetClass })), isDefault: false };
}

export async function addTicker(userId: string, tickerInput: string): Promise<WatchlistEntry[]> {
  const ticker = tickerInput.trim().toUpperCase();
  if (!isValidTicker(ticker)) throw new Error("Ticker inválido — use o formato da B3, ex.: PETR4 ou MXRF11.");

  const current = await prisma.watchlistItem.findMany({ where: { userId } });
  // primeira vez que este usuário mexe na watchlist: parte da padrão, não do zero
  const base = current.length === 0 ? DEFAULT_WATCHLIST : current.map((row) => ({ ticker: row.ticker, name: row.name, assetClass: row.assetClass as AssetClass }));
  if (base.length >= MAX_TICKERS) throw new Error(`Limite de ${MAX_TICKERS} ativos por watchlist.`);
  if (base.some((entry) => entry.ticker === ticker)) return base;

  if (current.length === 0) {
    await prisma.watchlistItem.createMany({ data: DEFAULT_WATCHLIST.map((entry) => ({ userId, ...entry })) });
  }
  await prisma.watchlistItem.create({ data: { userId, ticker, name: ticker, assetClass: guessAssetClass(ticker) } });

  const rows = await prisma.watchlistItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  return rows.map((row) => ({ ticker: row.ticker, name: row.name, assetClass: row.assetClass as AssetClass }));
}

export async function removeTicker(userId: string, tickerInput: string): Promise<WatchlistEntry[]> {
  const ticker = tickerInput.trim().toUpperCase();
  const current = await prisma.watchlistItem.findMany({ where: { userId } });
  if (current.length === 0) {
    // ainda na padrão implícita: materializa ela sem o ticker removido
    const remaining = DEFAULT_WATCHLIST.filter((entry) => entry.ticker !== ticker);
    await prisma.watchlistItem.createMany({ data: remaining.map((entry) => ({ userId, ...entry })) });
    return remaining;
  }
  await prisma.watchlistItem.deleteMany({ where: { userId, ticker } });
  const rows = await prisma.watchlistItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  return rows.map((row) => ({ ticker: row.ticker, name: row.name, assetClass: row.assetClass as AssetClass }));
}
