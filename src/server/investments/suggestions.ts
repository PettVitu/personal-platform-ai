import type { InvestmentSuggestionsResponse } from "../../domain/types";
import { fetchQuotes } from "./brapiClient";
import { recordSuggestions } from "./history";
import { fetchNews } from "./newsClient";
import { scoreAsset } from "./scoring";
import { getWatchlistForUser } from "./watchlist";

export async function buildSuggestions(userId: string | null): Promise<InvestmentSuggestionsResponse> {
  const { entries: watchlist, isDefault } = await getWatchlistForUser(userId);
  const [{ quotes, demo: quotesDemo }, { news, demo: newsDemo }] = await Promise.all([fetchQuotes(watchlist), fetchNews(watchlist)]);
  const suggestions = quotes
    .map((quote) => scoreAsset(quote, news.filter((item) => item.relatedTickers.includes(quote.ticker))))
    .sort((a, b) => b.score - a.score);
  const demo = quotesDemo || newsDemo;
  const sources = [
    quotesDemo ? "Brapi (dados demonstrativos)" : "Brapi (preço e P/L reais; dividend yield ainda demonstrativo — plano gratuito não libera esse dado)",
    newsDemo ? "Notícias (dados demonstrativos)" : "Marketaux",
  ];
  if (isDefault) sources.push("watchlist padrão");
  await recordSuggestions(suggestions, demo);
  return { suggestions, demo, sources };
}
