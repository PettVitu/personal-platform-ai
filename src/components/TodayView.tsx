import { computeDailyBudget, todayIso } from "../domain/daily-budget";
import type { AppData, Task } from "../domain/types";
import { Button, EmptyState, formatCurrency, formatDate, PageIntro } from "./Common";
import { DailyBudgetCard } from "./DailyBudgetCard";
import { Icon } from "./Icon";

export function TodayView({ data, onNavigate, onToggleTask }: { data: AppData; onNavigate: (route: "tasks" | "finance" | "agenda") => void; onToggleTask: (id: string) => void }) {
  const today = "2026-08-14";
  const dailyBudget = computeDailyBudget({ today: todayIso(), transactions: data.transactions, bills: data.bills, categories: data.budgetCategories });
  const todayTasks = data.tasks.filter((task) => task.date === today);
  const overdue = data.tasks.filter((task) => task.date < today && task.status === "pending");
  const income = data.transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = data.transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const nextBill = data.bills.find((bill) => !bill.paid);

  return <>
    <PageIntro eyebrow="sexta-feira, 14 de agosto" title="Bom dia, Petterson." description="Veja o que merece sua atenção e mantenha o restante sob controle." action={<Button onClick={() => onNavigate("tasks")}><Icon name="plus" /> Nova tarefa</Button>} />
    <DailyBudgetCard result={dailyBudget} compact />
    <section className="today-grid">
      <article className="card priority-card"><div className="card-heading"><div><p className="eyebrow">Prioridade principal</p><h2>{overdue[0]?.title ?? "Escolha uma prioridade para hoje"}</h2></div><span className="priority-mark">!</span></div>{overdue[0] ? <><p className="muted">Está atrasada desde {formatDate(overdue[0].date)}.</p><Button variant="secondary" onClick={() => onToggleTask(overdue[0].id)}>Marcar como concluída</Button></> : <p className="muted">Você não tem tarefas atrasadas. Bom trabalho.</p>}</article>
      <article className="card summary-card"><div className="card-heading"><div><p className="eyebrow">Resumo financeiro</p><h2>{formatCurrency(income - expenses)}</h2></div><button className="link-button" onClick={() => onNavigate("finance")}>Ver finanças <Icon name="arrow" /></button></div><div className="metric-row"><div><span>Receitas</span><strong className="positive">{formatCurrency(income)}</strong></div><div><span>Despesas</span><strong className="negative">{formatCurrency(expenses)}</strong></div></div></article>
    </section>
    <div className="section-heading"><h2>Seu dia</h2><button className="link-button" onClick={() => onNavigate("tasks")}>Ver todas <Icon name="arrow" /></button></div>
    <section className="card list-card">{todayTasks.length ? todayTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => onToggleTask(task.id)} />) : <EmptyState title="Nenhuma tarefa para hoje" description="Adicione algo pequeno e importante para começar." action={<Button onClick={() => onNavigate("tasks")}>Criar tarefa</Button>} />}</section>
    <section className="lower-grid"><article className="card"><div className="card-heading"><h2>Próximos compromissos</h2><button className="link-button" onClick={() => onNavigate("agenda")}>Abrir agenda <Icon name="arrow" /></button></div>{data.appointments.slice(0, 2).map((item) => <div className="appointment-row" key={item.id}><span className="time-label">{item.time}</span><div><strong>{item.title}</strong><small>{item.location ?? "Sem local"}</small></div></div>)}</article><article className="card"><div className="card-heading"><h2>Próximo vencimento</h2><button className="link-button" onClick={() => onNavigate("finance")}>Ver contas <Icon name="arrow" /></button></div>{nextBill ? <div className="bill-highlight"><div><strong>{nextBill.name}</strong><small>vence em {formatDate(nextBill.dueDate)}</small></div><strong className="negative">{formatCurrency(nextBill.amount)}</strong></div> : <p className="muted">Nenhuma conta pendente.</p>}</article></section>
  </>;
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return <div className={`task-row ${task.status === "completed" ? "completed" : ""}`}><button className="check-button" onClick={onToggle} aria-label={task.status === "completed" ? "Reabrir tarefa" : "Concluir tarefa"}>{task.status === "completed" && <Icon name="check" />}</button><div><strong>{task.title}</strong><small>{task.time ?? "Sem horário"}</small></div><span className={`priority-label ${task.priority}`}>{task.priority}</span></div>;
}
