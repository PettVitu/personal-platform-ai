import { useEffect, useState } from "react";
import { investmentRepository } from "../domain/repositories";
import type { InvestmentSuggestion } from "../domain/types";
import { EmptyState, PageIntro } from "./Common";

export function InvestmentsView() {
  const [suggestions, setSuggestions] = useState<InvestmentSuggestion[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    investmentRepository
      .suggestions()
      .then((result) => {
        if (!active) return;
        setSuggestions(result.suggestions);
        setSources(result.sources);
        setDemo(result.demo);
      })
      .catch(() => { if (active) setError("Não foi possível carregar as sugestões agora."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Conselheiro de investimentos"
        title="Ações e FIIs"
        description="Sugestões informativas para o longo prazo, com fundamentos e notícias auditáveis. Nada aqui é executado automaticamente — a decisão é sempre sua."
      />
      {demo && <div className="card status-message" role="status">Exibindo dados demonstrativos. Configure `BRAPI_TOKEN` e `MARKETAUX_API_KEY` para dados reais.</div>}
      {error && <div className="card status-message" role="status">{error}</div>}
      {loading ? (
        <p className="muted">Calculando sugestões…</p>
      ) : suggestions.length ? (
        <section className="investments-grid">
          {suggestions.map((item) => <SuggestionCard key={item.ticker} item={item} />)}
        </section>
      ) : (
        <EmptyState title="Nenhuma sugestão" description="Não há ativos monitorados no momento." />
      )}
      {sources.length > 0 && <p className="muted small-print">Fontes: {sources.join(" · ")}</p>}
    </>
  );
}

function SuggestionCard({ item }: { item: InvestmentSuggestion }) {
  return (
    <article className="card list-card">
      <div className="card-heading">
        <h2>{item.ticker} <small className="muted">{item.name}</small></h2>
        <strong>{item.score}/100</strong>
      </div>
      <p className="intro-copy">{item.explanation}</p>
      <div className="score-breakdown">
        <span>Fundamentos: {item.scoreBreakdown.fundamentals}</span>
        <span>Notícias: {item.scoreBreakdown.sentiment}</span>
      </div>
      {item.news.length > 0 && (
        <ul className="news-list">
          {item.news.slice(0, 2).map((news) => (
            <li key={news.url}>
              <a href={news.url} target="_blank" rel="noreferrer">{news.headline}</a> <small className="muted">({news.source})</small>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
