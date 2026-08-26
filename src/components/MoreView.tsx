import { useState } from "react";
import { todayIso } from "../domain/daily-budget";
import type { DocumentNote } from "../domain/types";
import { Button, EmptyState, PageIntro } from "./Common";
import { Icon } from "./Icon";

export function MoreView({ documents, onAddDocument }: { documents: DocumentNote[]; onAddDocument: (item: DocumentNote) => void }) {
  const [active, setActive] = useState<"more" | "assistant" | "rewrite" | "documents" | "privacy">("more"); const [text, setText] = useState(""); const [result, setResult] = useState("");
  if (active === "assistant") return <Assistant onBack={() => setActive("more")} />;
  if (active === "rewrite") return <Rewrite text={text} setText={setText} result={result} onRewrite={() => setResult(text.trim() ? `Versão revisada:\n\n${text.trim()}\n\nO texto foi simplificado nesta demonstração. Revise antes de salvar.` : "Digite um texto para começar.")} onBack={() => setActive("more")} />;
  if (active === "documents") return <Documents documents={documents} onAddDocument={onAddDocument} onBack={() => setActive("more")} />;
  if (active === "privacy") return <Privacy onBack={() => setActive("more")} />;
  return <><PageIntro eyebrow="Espaço pessoal" title="Mais" description="Ferramentas complementares para organizar e consultar suas informações." /><section className="more-grid"><button className="feature-card" onClick={() => setActive("assistant")}><span className="feature-icon assistant"><Icon name="assistant" /></span><strong>Conversar com Amarildo</strong><small>Consulte seus dados e organize o próximo passo.</small><Icon name="arrow" /></button><button className="feature-card" onClick={() => setActive("rewrite")}><span className="feature-icon">Aa</span><strong>Reformular texto</strong><small>Corrija, simplifique ou resuma sem perder o original.</small><Icon name="arrow" /></button><button className="feature-card" onClick={() => setActive("documents")}><span className="feature-icon">□</span><strong>Documentos</strong><small>{documents.length} documento(s) salvo(s) neste dispositivo.</small><Icon name="arrow" /></button><button className="feature-card" onClick={() => setActive("privacy")}><span className="feature-icon">⇩</span><strong>Privacidade e dados</strong><small>Baixe uma cópia dos seus dados ou exclua sua conta.</small><Icon name="arrow" /></button></section><section className="card settings-card"><p className="eyebrow">Privacidade</p><h2>Seus dados ficam com você</h2><p className="muted">Tarefas, finanças, agenda e documentos ficam salvos na sua conta, isolados dos outros usuários. Use “Privacidade e dados” para baixar ou apagar tudo quando quiser.</p></section></>;
}

function Privacy({ onBack }: { onBack: () => void }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function exportData() {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch("/api/account/export");
      if (!response.ok) throw new Error(response.status === 429 ? "Muitas tentativas. Aguarde um minuto e tente de novo." : "Não foi possível gerar a exportação.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "meus-dados.json"; link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível gerar a exportação.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    const typed = window.prompt('Esta ação apaga sua conta e todos os seus dados (tarefas, finanças, agenda, documentos e watchlist) para sempre. Não tem como desfazer.\n\nDigite EXCLUIR para confirmar.');
    if (typed !== "EXCLUIR") return;
    setBusy(true); setMessage(null);
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) throw new Error(response.status === 429 ? "Muitas tentativas. Aguarde um minuto e tente de novo." : "Não foi possível excluir a conta.");
      window.location.href = "/api/auth/signout?callbackUrl=/";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível excluir a conta.");
      setBusy(false);
    }
  }

  return <><button className="back-link" onClick={onBack}>← Voltar</button><PageIntro eyebrow="LGPD" title="Privacidade e dados" description="Baixe uma cópia de tudo que guardamos sobre você, ou apague sua conta e todos os dados associados." />{message && <div className="card status-message" role="status">{message}</div>}<section className="card settings-card"><p className="eyebrow">Exportar</p><h2>Baixar meus dados</h2><p className="muted">Gera um arquivo com suas tarefas, lançamentos, contas, compromissos, documentos e watchlist do conselheiro.</p><Button variant="secondary" onClick={exportData}>{busy ? "Gerando…" : "Baixar meus dados"}</Button></section><section className="card settings-card"><p className="eyebrow">Excluir</p><h2>Excluir minha conta</h2><p className="muted">Remove sua conta e todos os dados associados de forma permanente. Não tem como desfazer.</p><Button variant="ghost" onClick={deleteAccount}>{busy ? "Excluindo…" : "Excluir minha conta"}</Button></section></>;
}

function Assistant({ onBack }: { onBack: () => void }) {
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState("");
  function ask(value = question) { const normalized = value.toLowerCase(); setAnswer(normalized.includes("hoje") ? "Hoje você tem tarefas, um compromisso às 14:00 e uma conta próxima do vencimento. Esta resposta é uma demonstração local." : normalized.includes("mês") || normalized.includes("mes") ? "Seu saldo demonstrativo considera os lançamentos salvos neste dispositivo. Para uma análise real, conecte um backend seguro." : "Ainda não encontrei dados suficientes para responder com segurança. Tente perguntar sobre hoje ou sobre seu mês."); setQuestion(""); }
  return <><button className="back-link" onClick={onBack}>← Voltar</button><section className="chat-header"><span className="feature-icon assistant"><Icon name="assistant" /></span><div><p className="eyebrow">Assistente pessoal</p><h1>Amarildo</h1><p className="intro-copy">Simulação local. Ele não acessa dados fora desta tela.</p></div></section><div className="chat-area"><div className="chat-message assistant-message">Olá. Posso ajudar a organizar o que já está registrado. Pergunte algo como “o que tenho hoje?” ou “qual é minha prioridade?”.</div>{answer && <div className="chat-message user-message">{answer}</div>}<div className="chat-suggestions"><button onClick={() => ask("O que tenho hoje?")}>O que tenho hoje?</button><button onClick={() => ask("Como está meu mês?")}>Como está meu mês?</button></div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); ask(); }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Pergunte ao Amarildo..." /><Button type="submit">Enviar</Button></form></div></>;
}
function Rewrite({ text, setText, result, onRewrite, onBack }: { text: string; setText: (value: string) => void; result: string; onRewrite: () => void; onBack: () => void }) { return <><button className="back-link" onClick={onBack}>← Voltar</button><PageIntro eyebrow="Ferramenta de texto" title="Reformular texto" description="O original permanece intacto. O resultado abaixo é apenas uma demonstração local." /><section className="rewrite-grid"><div className="card"><label>Texto original<textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Cole ou escreva seu texto aqui..." /></label><Button onClick={onRewrite}>Gerar versão revisada</Button></div><div className="card result-card"><p className="eyebrow">Resultado</p><pre>{result || "A versão reformulada aparecerá aqui."}</pre></div></section></>; }
function Documents({ documents, onAddDocument, onBack }: { documents: DocumentNote[]; onAddDocument: (item: DocumentNote) => void; onBack: () => void }) { return <><button className="back-link" onClick={onBack}>← Voltar</button><PageIntro eyebrow="Informações pessoais" title="Documentos" description="Notas textuais organizadas, com controle explícito de acesso pelo Amarildo." action={<Button onClick={() => onAddDocument({ id: `document-${Date.now()}`, title: "Novo documento", category: "Geral", content: "Edite o conteúdo deste documento.", updatedAt: todayIso(), aiAccess: false })}><Icon name="plus" /> Novo documento</Button>} /><section className="document-grid">{documents.length ? documents.map((document) => <article className="card document-card" key={document.id}><span className="document-type">{document.category}</span><h2>{document.title}</h2><p>{document.content}</p><small>Amarildo: {document.aiAccess ? "pode consultar" : "bloqueado"}</small></article>) : <EmptyState title="Nenhum documento" description="Crie uma nota para guardar uma informação importante." />}</section></>; }
