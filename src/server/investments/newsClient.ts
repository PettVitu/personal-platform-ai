import type { InvestmentNews, Sentiment } from "../../domain/types";
import { getWatchlist } from "./brapiClient";

const DEMO_NEWS: InvestmentNews[] = [
  { headline: "Petrobras anuncia novo plano de investimentos no pré-sal", url: "https://example.com/demo/petr4", source: "Demo News", publishedAt: "2026-08-20T09:00:00.000Z", sentiment: "positivo", relatedTickers: ["PETR4"] },
  { headline: "Vale eleva previsão de produção de minério para o ano", url: "https://example.com/demo/vale3", source: "Demo News", publishedAt: "2026-08-19T09:00:00.000Z", sentiment: "positivo", relatedTickers: ["VALE3"] },
  { headline: "Itaú reporta alta na inadimplência do trimestre", url: "https://example.com/demo/itub4", source: "Demo News", publishedAt: "2026-08-18T09:00:00.000Z", sentiment: "negativo", relatedTickers: ["ITUB4"] },
  { headline: "WEG mantém guidance sem alterações relevantes", url: "https://example.com/demo/wege3", source: "Demo News", publishedAt: "2026-08-17T09:00:00.000Z", sentiment: "neutro", relatedTickers: ["WEGE3"] },
  { headline: "Maxi Renda distribui rendimento estável no mês", url: "https://example.com/demo/mxrf11", source: "Demo News", publishedAt: "2026-08-16T09:00:00.000Z", sentiment: "neutro", relatedTickers: ["MXRF11"] },
];

type MarketauxEntity = { symbol: string; sentiment_score?: number };
type MarketauxItem = { title: string; url: string; source: string; published_at: string; entities?: MarketauxEntity[] };

export async function fetchNews(): Promise<{ news: InvestmentNews[]; demo: boolean }> {
  const apiKey = process.env.MARKETAUX_API_KEY;
  if (!apiKey) return { news: DEMO_NEWS, demo: true };
  try {
    const symbols = getWatchlist().map((item) => `${item.ticker}.SA`).join(",");
    const response = await fetch(`https://api.marketaux.com/v1/news/all?symbols=${symbols}&language=pt&api_token=${apiKey}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`marketaux respondeu ${response.status}`);
    const body = (await response.json()) as { data?: MarketauxItem[] };
    if (!body.data?.length) throw new Error("marketaux sem dados");
    const news: InvestmentNews[] = body.data.map((item) => ({
      headline: item.title,
      url: item.url,
      source: item.source,
      publishedAt: item.published_at,
      sentiment: sentimentFromScore(item.entities?.[0]?.sentiment_score),
      relatedTickers: (item.entities ?? []).map((entity) => entity.symbol.replace(".SA", "")),
    }));
    return { news, demo: false };
  } catch {
    return { news: DEMO_NEWS, demo: true };
  }
}

function sentimentFromScore(value: number | undefined): Sentiment {
  if (value === undefined) return "neutro";
  if (value > 0.15) return "positivo";
  if (value < -0.15) return "negativo";
  return "neutro";
}
