import { useEffect, useState } from "react";
import { investmentRepository } from "../domain/repositories";
import type { InvestmentHistoryEntry, InvestmentSuggestion, WatchlistResponse } from "../domain/types";
import { EmptyState, PageIntro } from "./Common";
import { Icon } from "./Icon";

const formatDateTime = (value: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

export function InvestmentsView() {
  const [suggestions, setSuggestions] = useState<InvestmentSuggestion[]>([]);
  const [history, setHistory] = useState<InvestmentHistoryEntry[]>([]);
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
        <p className="muted">Calculando sugestões…</p>
      ) : suggestions.length ? (
        <section className="investments-grid">
          {suggestions.map((item) => <SuggestionCard key={item.ticker} item={item} />)}
        </section>
      ) : (
        <EmptyState title="Nenhuma sugestão" description="Não há ativos monitorados no momento." />
      )}
      {sources.length > 0 && <p className="muted small-print">Fontes: {sources.join(" · ")}</p>}
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

function HistoryPanel({ entries }: { entries: InvestmentHistoryEntry[] }) {
  return (
    <article className="card list-card investments-history">
      <div className="card-heading">
        <h2>Histórico recente</h2>
        <small className="muted">últimas {entries.length} sugestões geradas</small>
      </div>
      <ul className="history-list">
        {entries.slice(0, 20).map((entry) => (
          <li key={entry.id}>
            <span className="history-ticker">{entry.ticker}</span>
            <span className="history-score">{entry.score}/100</span>
            <span className="muted">fund. {entry.scoreBreakdown.fundamentals} · not. {entry.scoreBreakdown.sentiment}</span>
            <span className="muted history-time">{formatDateTime(entry.asOf)}{entry.demo ? " · demo" : ""}</span>
          </li>
        ))}
      </ul>
      <p className="muted small-print">Guardado no banco de dados. Serve para comparar, no futuro, cada score com o retorno real observado depois.</p>
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
