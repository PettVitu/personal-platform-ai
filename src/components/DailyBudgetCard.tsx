import type { DailyBudgetResult } from "../domain/daily-budget";
import { formatCurrency } from "./Common";

export function DailyBudgetCard({ result, compact = false }: { result: DailyBudgetResult; compact?: boolean }) {
  const tone = result.remainingToday < 0 ? "negative" : "positive";
  if (compact) {
    return (
      <article className="card daily-budget-card daily-budget-compact">
        <span className="eyebrow">Controle diário</span>
        <strong className={tone}>{formatCurrency(result.remainingToday)}</strong>
        <small className="muted">disponível hoje, de um orçamento de {formatCurrency(result.dailyBudget)}</small>
      </article>
    );
  }
  return (
    <article className="card daily-budget-card">
      <div className="card-heading">
        <h2>Controle diário</h2>
        <small className="muted">recalculado todo dia 1º</small>
      </div>
      <strong className={`daily-budget-remaining ${tone}`}>{formatCurrency(result.remainingToday)}</strong>
      <p className="muted">disponível para gastar hoje, de um orçamento diário de {formatCurrency(result.dailyBudget)} (já gastou {formatCurrency(result.spentToday)} hoje)</p>
      <div className="detail-line"><span>Saldo atual</span><strong>{formatCurrency(result.currentBalance)}</strong></div>
      <div className="detail-line"><span>Receitas previstas até o fim do mês</span><strong className="positive">+{formatCurrency(result.futureIncome)}</strong></div>
      <div className="detail-line"><span>Contas previstas até o fim do mês</span><strong className="negative">−{formatCurrency(result.committedBills)}</strong></div>
      <div className="detail-line"><span>Categorias previstas (proporcional aos dias restantes)</span><strong className="negative">−{formatCurrency(result.committedCategories)}</strong></div>
      <div className="detail-line"><span>Dias restantes no mês</span><strong>{result.daysRemaining} de {result.daysInMonth}</strong></div>
      <p className="muted small-print">O orçamento de cada dia zera à meia-noite — não acumula sobra do dia anterior. É um freio de referência, não uma poupança.</p>
    </article>
  );
}
