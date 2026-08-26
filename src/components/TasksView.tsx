import { useState } from "react";
import { todayIso } from "../domain/daily-budget";
import type { Task } from "../domain/types";
import { Button, EmptyState, formatDate, PageIntro } from "./Common";
import { Icon } from "./Icon";

type TaskFormProps = { initial?: Task; onSave: (task: Task) => void; onCancel: () => void };

export function TasksView({ tasks, onAdd, onUpdate, onToggle, onDelete }: { tasks: Task[]; onAdd: (task: Task) => void; onUpdate: (task: Task) => void; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<Task | null>(null); const [showForm, setShowForm] = useState(false);
  const safeTasks = tasks.filter(Boolean); const pending = safeTasks.filter((task) => task.status === "pending"); const completed = safeTasks.filter((task) => task.status === "completed");
  function openNew() { setEditing(null); setShowForm(true); }
  function save(task: Task) { if (editing) onUpdate(task); else onAdd(task); setShowForm(false); setEditing(null); }
  return <>
    <PageIntro eyebrow="Organização" title="Tarefas" description="Tire as coisas da cabeça e coloque-as em um lugar confiável." action={<Button onClick={openNew}><Icon name="plus" /> Nova tarefa</Button>} />
    {showForm && <TaskForm initial={editing ?? undefined} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    <section className="card list-card"><div className="card-heading"><h2>Em aberto <span className="count-badge">{pending.length}</span></h2></div>{pending.length ? pending.slice().sort((a, b) => a.date.localeCompare(b.date)).map((task) => <TaskItem key={task.id} task={task} onToggle={() => onToggle(task.id)} onEdit={() => { setEditing(task); setShowForm(true); }} onDelete={() => onDelete(task.id)} />) : <EmptyState title="Tudo em dia" description="Você não tem tarefas pendentes." />}</section>
    {completed.length > 0 && <section className="card list-card completed-section"><div className="card-heading"><h2>Concluídas <span className="count-badge">{completed.length}</span></h2></div>{completed.map((task) => <TaskItem key={task.id} task={task} onToggle={() => onToggle(task.id)} onEdit={() => { setEditing(task); setShowForm(true); }} onDelete={() => onDelete(task.id)} />)}</section>}
  </>;
}

function TaskForm({ initial, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? ""); const [date, setDate] = useState(initial?.date ?? todayIso()); const [time, setTime] = useState(initial?.time ?? ""); const [priority, setPriority] = useState<Task["priority"]>(initial?.priority ?? "media");
  function submit(event: React.FormEvent) { event.preventDefault(); if (!title.trim()) return; onSave({ id: initial?.id ?? `task-${Date.now()}`, title: title.trim(), date, time: time || undefined, priority, status: initial?.status ?? "pending", notes: initial?.notes }); }
  return <form className="card form-card" onSubmit={submit}><div className="form-heading"><h2>{initial ? "Editar tarefa" : "Nova tarefa"}</h2><button type="button" className="icon-close" onClick={onCancel} aria-label="Fechar"><Icon name="close" /></button></div><label>Título<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="O que precisa ser feito?" /></label><div className="form-grid"><label>Data<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Horário<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label></div><label>Prioridade<select value={priority} onChange={(event) => setPriority(event.target.value as Task["priority"])}><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></select></label><div className="form-actions"><Button variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit">{initial ? "Salvar alterações" : "Salvar tarefa"}</Button></div></form>;
}

function TaskItem({ task, onToggle, onEdit, onDelete }: { task: Task; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  return <div className={`task-row task-item ${task.status === "completed" ? "completed" : ""}`}><button className="check-button" onClick={onToggle} aria-label="Alternar conclusão">{task.status === "completed" && <Icon name="check" />}</button><div><strong>{task.title}</strong><small>{formatDate(task.date)}{task.time ? ` · ${task.time}` : ""}</small></div><span className={`priority-label ${task.priority}`}>{task.priority}</span><button className="edit-button" onClick={onEdit} aria-label={`Editar ${task.title}`}>Editar</button><button className="delete-button" onClick={() => { if (window.confirm("Excluir esta tarefa?")) onDelete(); }} aria-label={`Excluir ${task.title}`}><Icon name="close" /></button></div>;
}
