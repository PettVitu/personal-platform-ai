import { useState } from "react";
import { todayIso } from "../domain/daily-budget";
import type { Appointment } from "../domain/types";
import { Button, EmptyState, PageIntro } from "./Common";
import { Icon } from "./Icon";

export function AgendaView({ appointments, onAdd, onUpdate, onDelete }: { appointments: Appointment[]; onAdd: (item: Appointment) => void; onUpdate: (item: Appointment) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<Appointment | null>(null); const [showForm, setShowForm] = useState(false);
  const today = todayIso();
  const todayAppointments = appointments.filter((item) => item.date === today).slice().sort((a, b) => a.time.localeCompare(b.time));
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date());
  const dayAndMonth = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(new Date());
  function openNew() { setEditing(null); setShowForm(true); }
  function save(item: Appointment) { if (editing) onUpdate(item); else onAdd(item); setShowForm(false); setEditing(null); }
  return <>
    <PageIntro eyebrow="Compromissos" title="Agenda" description="Uma visão objetiva do que já tem hora marcada." action={<Button onClick={openNew}><Icon name="plus" /> Novo compromisso</Button>} />
    {showForm && <AppointmentForm initial={editing ?? undefined} defaultDate={today} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    <section className="card list-card">
      <div className="date-heading"><div><p className="eyebrow">Hoje</p><h2>{dayAndMonth}</h2></div><span className="muted">{weekday}</span></div>
      {todayAppointments.length ? todayAppointments.map((item) => <AppointmentRow key={item.id} item={item} onEdit={() => { setEditing(item); setShowForm(true); }} onDelete={() => { if (window.confirm(`Excluir o compromisso "${item.title}"?`)) onDelete(item.id); }} />) : <EmptyState title="Agenda livre" description="Você não tem compromissos cadastrados para hoje." />}
    </section>
  </>;
}

function AppointmentForm({ initial, defaultDate, onSave, onCancel }: { initial?: Appointment; defaultDate: string; onSave: (item: Appointment) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? ""); const [date, setDate] = useState(initial?.date ?? defaultDate); const [time, setTime] = useState(initial?.time ?? "09:00"); const [location, setLocation] = useState(initial?.location ?? "");
  function submit(event: React.FormEvent) { event.preventDefault(); if (!title.trim()) return; onSave({ id: initial?.id ?? `appointment-${Date.now()}`, title: title.trim(), date, time, location: location.trim() || undefined }); }
  return <form className="card form-card" onSubmit={submit}>
    <div className="form-heading"><h2>{initial ? "Editar compromisso" : "Novo compromisso"}</h2><button type="button" className="icon-close" onClick={onCancel} aria-label="Fechar"><Icon name="close" /></button></div>
    <label>Compromisso<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: reunião, consulta..." /></label>
    <div className="form-grid"><label>Data<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Horário<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label></div>
    <label>Local (opcional)<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ex.: Clínica Centro" /></label>
    <div className="form-actions"><Button variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit">{initial ? "Salvar alterações" : "Salvar compromisso"}</Button></div>
  </form>;
}

function AppointmentRow({ item, onEdit, onDelete }: { item: Appointment; onEdit: () => void; onDelete: () => void }) {
  return <div className="appointment-row large"><span className="time-label">{item.time}</span><div><strong>{item.title}</strong><small>{item.location ?? "Sem local definido"}</small></div><button className="edit-button" onClick={onEdit}>Editar</button><button className="delete-button" onClick={onDelete} aria-label={`Excluir ${item.title}`}><Icon name="close" /></button></div>;
}
