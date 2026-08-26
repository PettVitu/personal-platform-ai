import { useEffect, useState } from "react";
import { evaluateScoreCall } from "../domain/investment-evaluation";
import { investmentRepository } from "../domain/repositories";
import type { InvestmentHistoryEntry, InvestmentInsightsResponse, InvestmentSuggestion, WatchlistResponse } from "../domain/types";
import { EmptyState, PageIntro } from "./Common";
import { Icon } from "./Icon";

const formatDateTime = (value: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

const CONDITION_LABELS: Record<string, string> = {
  fundamentos_alto: "fundamentos altos",
  fundamentos_medio: "fundamentos medianos",
  fundamentos_baixo: "fundamentos fracos",
  noticia_alto: "notícias positivas",
  noticia_medio: "notícias neutras",
  noticia_baixo: "notícias negativas",
  acao: "é ação",
  fii: "é FII",
};
const OUTCOME_LABELS: Record<string, string> = {
  retorno_positivo: "retorno positivo depois",
  retorno_estavel_ou_negativo: "retorno estável ou negativo depois",
};

export function InvestmentsView() {
  const [suggestions, setSuggestions] = useState<InvestmentSuggestion[]>([]);
  const [history, setHistory] = useState<InvestmentHistoryEntry[]>([]);
  const [insights, setInsights] = useState<InvestmentInsightsResponse | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistResponse | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistError, setWatchlistError] = useState<string | null>(null);

  async function loadAll() {
    const [suggestionsResult, watchlistResult] = await Promise.all([investmentRepository.suggestions(), investmentRepository.watchlist()]);
    setSuggestions(suggestionsResult.suggestions);
    setSources(suggestionsResult.sources);
    setDemo(suggestionsResult.demo);
    setWatchlist(watchlistResult);
    setHistory(await investmentRepository.history());
    setInsights(await investmentRepository.insights());
  }

  useEffect(() => {
    let active = true;
    loadAll()
      .catch(() => { if (active) setError("Não foi possível carregar as sugestões agora."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function handleAdd(ticker: string) {
    setWatchlistError(null);
    try {
      await investmentRepository.addTicker(ticker);
      await loadAll();
    } catch {
      setWatchlistError("Não foi possível adicionar esse ticker — confira o formato (ex.: PETR4, MXRF11).");
    }
  }

  async function handleRemove(ticker: string) {
    setWatchlistError(null);
    try {
      await investmentRepository.removeTicker(ticker);
      await loadAll();
    } catch {
      setWatchlistError("Não foi possível remover esse ticker agora.");
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Conselheiro de investimentos"
        title="Ações e FIIs"
        description="Sugestões informativas para o longo prazo, com fundamentos e notícias auditáveis. Nada aqui é executado automaticamente — a decisão é sempre sua."
      />
      {demo && <div className="card status-message" role="status">Exibindo dados demonstrativos. Configure `BRAPI_TOKEN` e `MARKETAUX_API_KEY` para dados reais.</div>}
      {error && <div className="card status-message" role="status">{error}</div>}
      {watchlist && <WatchlistPanel watchlist={watchlist} error={watchlistError} onAdd={handleAdd} onRemove={handleRemove} />}
      {loading ? (
        <p className="muted loading-line"><span className="spinner" aria-hidden="true" /> Calculando sugestões…</p>
      ) : suggestions.length ? (
        <section className="investments-grid">
          {suggestions.map((item) => <SuggestionCard key={item.ticker} item={item} />)}
        </section>
      ) : (
        <EmptyState title="Nenhuma sugestão" description="Não há ativos monitorados no momento." />
      )}
      {sources.length > 0 && <p className="muted small-print">Fontes: {sources.join(" · ")}</p>}
      {insights && <InsightsPanel result={insights} />}
      {history.length > 0 && <HistoryPanel entries={history} />}
    </>
  );
}

function WatchlistPanel({ watchlist, error, onAdd, onRemove }: { watchlist: WatchlistResponse; error: string | null; onAdd: (ticker: string) => void; onRemove: (ticker: string) => void }) {
  const [ticker, setTicker] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ticker.trim()) return;
    onAdd(ticker.trim());
    setTicker("");
  }

  return (
    <article className="card list-card watchlist-panel">
      <div className="card-heading">
        <h2>Sua watchlist</h2>
        {watchlist.isDefault && <small className="muted">padrão — adicione um ativo para personalizar</small>}
      </div>
      <div className="watchlist-chips">
        {watchlist.entries.map((entry) => (
          <span key={entry.ticker} className="watchlist-chip">
            {entry.ticker}
            {watchlist.editable && <button type="button" onClick={() => onRemove(entry.ticker)} aria-label={`Remover ${entry.ticker}`}><Icon name="close" /></button>}
          </span>
        ))}
      </div>
      {watchlist.editable ? (
        <form className="watchlist-add-form" onSubmit={submit}>
          <input value={ticker} onChange={(event) => setTicker(event.target.value.toUpperCase())} placeholder="Ex.: BBAS3" aria-label="Adicionar ticker à watchlist" maxLength={7} />
          <button type="submit">Adicionar</button>
        </form>
      ) : (
        <p className="muted small-print">Entre com sua conta para personalizar a watchlist.</p>
      )}
      {error && <p className="muted small-print">{error}</p>}
    </article>
  );
}

function InsightsPanel({ result }: { result: InvestmentInsightsResponse }) {
  return (
    <article className="card list-card investments-history">
      <div className="card-heading">
        <h2>Análise estatística</h2>
        <small className="muted">{result.sampleSize} sugestões avaliadas até agora</small>
      </div>
      {result.insights.length > 0 ? (
        <>
          <ul className="history-list">
            {result.insights.map((insight, index) => (
              <li key={index}>
                <span>
                  Quando {insight.conditions.map((item) => CONDITION_LABELS[item] ?? item).join(" e ")} → {OUTCOME_LABELS[insight.outcome] ?? insight.outcome}
                </span>
                <span className="muted">confiança {(insight.confidence * 100).toFixed(0)}% · suporte {(insight.support * 100).toFixed(0)}% · lift {insight.lift.toFixed(1)}x</span>
              </li>
            ))}
          </ul>
          <p className="muted small-print">Regras de associação (Apriori) mineradas sobre o histórico real avaliado. Não é previsão nem recomendação — é um padrão estatístico observado até agora, que pode mudar conforme mais dados chegam.</p>
        </>
      ) : (
        <EmptyState title="Ainda não há dados suficientes" description={`É preciso pelo menos ${result.minSampleSize} sugestões reais com retorno já avaliado (7+ dias) para começar a achar padrões. Hoje há ${result.sampleSize}.`} />
      )}
    </article>
  );
}

function HistoryPanel({ entries }: { entries: InvestmentHistoryEntry[] }) {
  const evaluated = entries.filter((entry) => entry.realizedReturnPct !== null);
  const calls = evaluated.map((entry) => evaluateScoreCall(entry.score, entry.realizedReturnPct!)).filter((call): call is "acertou" | "errou" => call !== null);
  const hits = calls.filter((call) => call === "acertou").length;

  return (
    <article className="card list-card investments-history">
      <div className="card-heading">
        <h2>Histórico recente</h2>
        <small className="muted">últimas {entries.length} sugestões geradas</small>
      </div>
      <ul className="history-list">
        {entries.slice(0, 20).map((entry) => {
          const call = entry.realizedReturnPct !== null ? evaluateScoreCall(entry.score, entry.realizedReturnPct) : null;
          return (
            <li key={entry.id}>
              <span className="history-ticker">{entry.ticker}</span>
              <span className="history-score">{entry.score}/100</span>
              <span className="muted">fund. {entry.scoreBreakdown.fundamentals} · not. {entry.scoreBreakdown.sentiment}</span>
              {entry.realizedReturnPct !== null ? (
                <span className={entry.realizedReturnPct > 0 ? "positive" : entry.realizedReturnPct < 0 ? "negative" : "muted"}>
                  {entry.realizedReturnPct > 0 ? "+" : ""}{entry.realizedReturnPct.toFixed(1)}% desde a sugestão{call && ` · ${call}`}
                </span>
              ) : (
                <span className="muted">{entry.demo ? "demo — sem retorno real" : "aguardando retorno (7+ dias)"}</span>
              )}
              <span className="muted history-time">{formatDateTime(entry.asOf)}{entry.demo ? " · demo" : ""}</span>
            </li>
          );
        })}
      </ul>
      <p className="muted small-print">
        {calls.length > 0
          ? `Score acertou a direção em ${hits}/${calls.length} sugestões avaliadas (score ≥ 60 esperando alta, ≤ 40 esperando queda ou estabilidade; ${evaluated.length - calls.length} ficaram na faixa neutra, sem chamada).`
          : "Cada sugestão real guarda o preço do momento; a partir de 7 dias, o retorno até o preço atual é comparado com o score dado."}
      </p>
    </article>
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
