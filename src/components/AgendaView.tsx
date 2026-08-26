import { useState } from "react";
import { todayIso } from "../domain/daily-budget";
import type { Appointment } from "../domain/types";
import { Button, EmptyState, PageIntro } from "./Common";
import { Icon } from "./Icon";

export function AgendaView({ appointments, onAdd }: { appointments: Appointment[]; onAdd: (item: Appointment) => void }) {
  const [showForm, setShowForm] = useState(false); const [title, setTitle] = useState(""); const [time, setTime] = useState("09:00");
  const today = todayIso();
  const todayAppointments = appointments.filter((item) => item.date === today).slice().sort((a, b) => a.time.localeCompare(b.time));
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date());
  const dayAndMonth = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(new Date());
  function submit(event: React.FormEvent) { event.preventDefault(); if (!title.trim()) return; onAdd({ id: `appointment-${Date.now()}`, title: title.trim(), date: today, time }); setTitle(""); setShowForm(false); }
  return <><PageIntro eyebrow="Compromissos" title="Agenda" description="Uma visão objetiva do que já tem hora marcada." action={<Button onClick={() => setShowForm((value) => !value)}><Icon name="plus" /> Novo compromisso</Button>} />{showForm && <form className="card form-card" onSubmit={submit}><div className="form-heading"><h2>Novo compromisso</h2><button type="button" className="icon-close" onClick={() => setShowForm(false)} aria-label="Fechar"><Icon name="close" /></button></div><label>Compromisso<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: reunião, consulta..." /></label><label>Horário<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label><Button type="submit">Salvar compromisso</Button></form>}<section className="card list-card"><div className="date-heading"><div><p className="eyebrow">Hoje</p><h2>{dayAndMonth}</h2></div><span className="muted">{weekday}</span></div>{todayAppointments.length ? todayAppointments.map((item) => <div className="appointment-row large" key={item.id}><span className="time-label">{item.time}</span><div><strong>{item.title}</strong><small>{item.location ?? "Sem local definido"}</small></div></div>) : <EmptyState title="Agenda livre" description="Você não tem compromissos cadastrados para hoje." />}</section></>;
}
