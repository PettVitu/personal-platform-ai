"use client";

import { useEffect, useState } from "react";
import { AgendaView } from "../components/AgendaView";
import { AppShell, type AppRoute } from "../components/AppShell";
import { FinanceView } from "../components/FinanceView";
import { MoreView } from "../components/MoreView";
import { TasksView } from "../components/TasksView";
import { TodayView } from "../components/TodayView";
import { seedData } from "../domain/seed";
import { loadAppData, saveAppData } from "../domain/storage";
import type { AppData, Appointment, DocumentNote, Task, Transaction } from "../domain/types";

export default function HomePage() {
  const [route, setRoute] = useState<AppRoute>("today");
  const [data, setData] = useState<AppData>(seedData);
  const [ready, setReady] = useState(false);
  useEffect(() => { setData(loadAppData(seedData)); setReady(true); if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []);
  useEffect(() => { if (ready) saveAppData(data); }, [data, ready]);
  const update = (change: Partial<AppData>) => setData((current) => ({ ...current, ...change }));
  const toggleTask = (id: string) => update({ tasks: data.tasks.map((task) => task.id === id ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task) });
  const deleteTask = (id: string) => update({ tasks: data.tasks.filter((task) => task.id !== id) });
  const content = route === "today" ? <TodayView data={data} onNavigate={setRoute} onToggleTask={toggleTask} /> : route === "tasks" ? <TasksView tasks={data.tasks} onAdd={(task: Task) => update({ tasks: [...data.tasks, task] })} onUpdate={(task) => update({ tasks: data.tasks.map((current) => current.id === task.id ? task : current) })} onToggle={toggleTask} onDelete={deleteTask} /> : route === "finance" ? <FinanceView transactions={data.transactions} bills={data.bills} onAddTransaction={(item: Transaction) => update({ transactions: [...data.transactions, item] })} onUpdateTransaction={(item) => update({ transactions: data.transactions.map((current) => current.id === item.id ? item : current) })} onDeleteTransaction={(id) => update({ transactions: data.transactions.filter((item) => item.id !== id) })} onToggleBill={(id) => update({ bills: data.bills.map((bill) => bill.id === id ? { ...bill, paid: !bill.paid } : bill) })} onUpdateBill={(item) => update({ bills: data.bills.some((bill) => bill.id === item.id) ? data.bills.map((bill) => bill.id === item.id ? item : bill) : [...data.bills, item] })} onDeleteBill={(id) => update({ bills: data.bills.filter((bill) => bill.id !== id) })} /> : route === "agenda" ? <AgendaView appointments={data.appointments} onAdd={(item: Appointment) => update({ appointments: [...data.appointments, item] })} /> : <MoreView documents={data.documents} onAddDocument={(item: DocumentNote) => update({ documents: [...data.documents, item] })} />;
  return <AppShell route={route} onNavigate={setRoute}>{content}</AppShell>;
}
