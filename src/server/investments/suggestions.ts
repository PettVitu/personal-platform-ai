import type { InvestmentSuggestionsResponse } from "../../domain/types";
import { fetchQuotes } from "./brapiClient";
import { recordSuggestions } from "./history";
import { fetchNews } from "./newsClient";
import { scoreAsset } from "./scoring";

export async function buildSuggestions(): Promise<InvestmentSuggestionsResponse> {
  const [{ quotes, demo: quotesDemo }, { news, demo: newsDemo }] = await Promise.all([fetchQuotes(), fetchNews()]);
  const suggestions = quotes
    .map((quote) => scoreAsset(quote, news.filter((item) => item.relatedTickers.includes(quote.ticker))))
    .sort((a, b) => b.score - a.score);
  const demo = quotesDemo || newsDemo;
  const sources = [
    quotesDemo ? "Brapi (dados demonstrativos)" : "Brapi (preço e P/L reais; dividend yield ainda demonstrativo — plano gratuito não libera esse dado)",
    newsDemo ? "Notícias (dados demonstrativos)" : "Marketaux",
  ];
  recordSuggestions(suggestions, demo);
  return { suggestions, demo, sources };
}
