"use client";

import { useEffect, useMemo, useState } from "react";
import { AgendaView } from "../components/AgendaView";
import { AppShell, type AppRoute } from "../components/AppShell";
import { FinanceView } from "../components/FinanceView";
import { InvestmentsView } from "../components/InvestmentsView";
import { MoreView } from "../components/MoreView";
import { TasksView } from "../components/TasksView";
import { SpreadsheetView } from "../components/SpreadsheetView";
import { TodayView } from "../components/TodayView";
import { appointmentRepository, billRepository, budgetCategoryRepository, localRepository, taskRepository, transactionRepository } from "../domain/repositories";
import { seedData } from "../domain/seed";
import type { AppData, Appointment, BudgetCategory, DocumentNote, RecurringBill, Task, Transaction } from "../domain/types";

const local = localRepository();

export default function HomePage() {
  const [route, setRoute] = useState<AppRoute>("today");
  const [data, setData] = useState<AppData>(seedData);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([taskRepository.list(), transactionRepository.list(), billRepository.list(), budgetCategoryRepository.list(), appointmentRepository.list()]).then(([tasks, transactions, bills, budgetCategories, appointments]) => {
      if (active) { const next = { ...local.getData(), tasks, transactions, bills, budgetCategories, appointments }; local.replaceData(next); setData(next); }
    }).catch(() => {
      if (active) { setData(local.getData()); setMessage("API indisponível. Usando os dados locais deste dispositivo."); }
    }).finally(() => { if (active) setLoading(false); });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").then((registration) => registration.update()).catch(() => undefined);
    return () => { active = false; };
  }, []);

  async function operation<T>(remote: () => Promise<T>, fallback: () => Promise<T>, apply: (value: T) => void) {
    setBusy(true); setMessage(null);
    try { apply(await remote()); }
    catch { setMessage("API indisponível. A operação foi salva localmente neste dispositivo."); apply(await fallback()); }
    finally { setBusy(false); }
  }
  const replace = (change: Partial<AppData>) => setData((current) => ({ ...current, ...change }));
  const addTask = (task: Task) => operation(() => taskRepository.create({ title: task.title, date: task.date, time: task.time, priority: task.priority, notes: task.notes }), () => local.create("tasks", task) as Promise<Task>, (value) => setData((current) => ({ ...current, tasks: [...current.tasks, value] })));
  const updateTask = (task: Task) => operation(() => taskRepository.update(task.id, task), () => local.update("tasks", task.id, task) as Promise<Task>, (value) => setData((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? value : item) })));
  const toggleTask = (id: string) => { const task = data.tasks.find((item) => item.id === id); if (!task) return; updateTask({ ...task, status: task.status === "completed" ? "pending" : "completed" }); };
  const deleteTask = (id: string) => operation(() => taskRepository.remove(id).then(() => id), () => local.remove("tasks", id).then(() => id), (value) => setData((current) => ({ ...current, tasks: current.tasks.filter((item) => item.id !== value) })));
  const addTransaction = (item: Transaction) => operation(() => transactionRepository.create(item), () => local.create("transactions", item) as Promise<Transaction>, (value) => setData((current) => ({ ...current, transactions: [...current.transactions, value] })));
  const updateTransaction = (item: Transaction) => operation(() => transactionRepository.update(item.id, item), () => local.update("transactions", item.id, item) as Promise<Transaction>, (value) => setData((current) => ({ ...current, transactions: current.transactions.map((currentItem) => currentItem.id === item.id ? value : currentItem) })));
  const deleteTransaction = (id: string) => operation(() => transactionRepository.remove(id).then(() => id), () => local.remove("transactions", id).then(() => id), (value) => setData((current) => ({ ...current, transactions: current.transactions.filter((item) => item.id !== value) })));
  const addBill = (item: RecurringBill) => operation(() => billRepository.create({ name: item.name, amount: item.amount, dueDate: item.dueDate }), () => local.create("bills", item) as Promise<RecurringBill>, (value) => setData((current) => ({ ...current, bills: [...current.bills, value] })));
  const updateBill = (item: RecurringBill) => operation(() => billRepository.update(item.id, item), () => local.update("bills", item.id, item) as Promise<RecurringBill>, (value) => setData((current) => ({ ...current, bills: current.bills.map((currentItem) => currentItem.id === item.id ? value : currentItem) })));
  const deleteBill = (id: string) => operation(() => billRepository.remove(id).then(() => id), () => local.remove("bills", id).then(() => id), (value) => setData((current) => ({ ...current, bills: current.bills.filter((item) => item.id !== value) })));
  const deleteSpreadsheetRow = (row: { id: string; source: "task" | "transaction" | "bill" }) => row.source === "task" ? deleteTask(row.id) : row.source === "transaction" ? deleteTransaction(row.id) : deleteBill(row.id);
  const addBudgetCategory = (item: BudgetCategory) => operation(() => budgetCategoryRepository.create({ name: item.name, monthlyAmount: item.monthlyAmount }), () => local.create("budgetCategories", item) as Promise<BudgetCategory>, (value) => setData((current) => ({ ...current, budgetCategories: [...current.budgetCategories, value] })));
  const updateBudgetCategory = (item: BudgetCategory) => operation(() => budgetCategoryRepository.update(item.id, item), () => local.update("budgetCategories", item.id, item) as Promise<BudgetCategory>, (value) => setData((current) => ({ ...current, budgetCategories: current.budgetCategories.map((currentItem) => currentItem.id === item.id ? value : currentItem) })));
  const deleteBudgetCategory = (id: string) => operation(() => budgetCategoryRepository.remove(id).then(() => id), () => local.remove("budgetCategories", id).then(() => id), (value) => setData((current) => ({ ...current, budgetCategories: current.budgetCategories.filter((item) => item.id !== value) })));
  const addAppointment = (item: Appointment) => operation(() => appointmentRepository.create({ title: item.title, date: item.date, time: item.time, location: item.location }), () => local.create("appointments", item) as Promise<Appointment>, (value) => setData((current) => ({ ...current, appointments: [...current.appointments, value] })));
  const updateAppointment = (item: Appointment) => operation(() => appointmentRepository.update(item.id, item), () => local.update("appointments", item.id, item) as Promise<Appointment>, (value) => setData((current) => ({ ...current, appointments: current.appointments.map((currentItem) => currentItem.id === item.id ? value : currentItem) })));
  const deleteAppointment = (id: string) => operation(() => appointmentRepository.remove(id).then(() => id), () => local.remove("appointments", id).then(() => id), (value) => setData((current) => ({ ...current, appointments: current.appointments.filter((item) => item.id !== value) })));

  const content = useMemo(() => route === "today" ? <TodayView data={data} onNavigate={setRoute} onToggleTask={toggleTask} /> : route === "spreadsheet" ? <SpreadsheetView data={data} onToggleTask={toggleTask} onToggleBill={(id) => { const bill = data.bills.find((item) => item.id === id); if (bill) updateBill({ ...bill, paid: !bill.paid }); }} onDelete={deleteSpreadsheetRow} /> : route === "tasks" ? <TasksView tasks={data.tasks} onAdd={addTask} onUpdate={updateTask} onToggle={toggleTask} onDelete={deleteTask} /> : route === "finance" ? <FinanceView transactions={data.transactions} bills={data.bills} budgetCategories={data.budgetCategories} onAddTransaction={addTransaction} onUpdateTransaction={updateTransaction} onDeleteTransaction={deleteTransaction} onToggleBill={(id) => { const bill = data.bills.find((item) => item.id === id); if (bill) updateBill({ ...bill, paid: !bill.paid }); }} onAddBill={addBill} onUpdateBill={updateBill} onDeleteBill={deleteBill} onAddBudgetCategory={addBudgetCategory} onUpdateBudgetCategory={updateBudgetCategory} onDeleteBudgetCategory={deleteBudgetCategory} /> : route === "investments" ? <InvestmentsView /> : route === "agenda" ? <AgendaView appointments={data.appointments} onAdd={addAppointment} onUpdate={updateAppointment} onDelete={deleteAppointment} /> : <MoreView documents={data.documents} onAddDocument={(item: DocumentNote) => replace({ documents: [...data.documents, item] })} />, [route, data]);
  if (loading) return <main className="app-shell"><p className="muted">Carregando seus dados…</p></main>;
  return <AppShell route={route} onNavigate={setRoute}><>{message && <div className="card status-message" role="status">{message} <button className="link-button" onClick={() => window.location.reload()}>Tentar novamente</button></div>}{busy && <div className="status-message" role="status">Salvando…</div>}{content}</></AppShell>;
}
