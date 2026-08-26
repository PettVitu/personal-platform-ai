import type { InvestmentSuggestionsResponse } from "../../domain/types";
import { fetchQuotes } from "./brapiClient";
import { fetchNews } from "./newsClient";
import { scoreAsset } from "./scoring";

export async function buildSuggestions(): Promise<InvestmentSuggestionsResponse> {
  const [{ quotes, demo: quotesDemo }, { news, demo: newsDemo }] = await Promise.all([fetchQuotes(), fetchNews()]);
  const suggestions = quotes
    .map((quote) => scoreAsset(quote, news.filter((item) => item.relatedTickers.includes(quote.ticker))))
    .sort((a, b) => b.score - a.score);
  const sources = [quotesDemo ? "Brapi (dados demonstrativos)" : "Brapi", newsDemo ? "Notícias (dados demonstrativos)" : "Marketaux"];
  return { suggestions, demo: quotesDemo || newsDemo, sources };
}
