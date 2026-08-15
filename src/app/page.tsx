"use client";

import { useEffect, useState } from "react";

type Route = "home" | "learn" | "feed" | "projects" | "profile" | "lesson";
type Lesson = { id: string; title: string; type: string; level: string; time: string; progress: number; description: string };
type Project = { title: string; creator: string; initials: string; description: string; tag: string; tone: string };

const lessons: Lesson[] = [
  { id: "canvas", title: "Primeiro canvas interativo", type: "visual", level: "iniciante", time: "8 min", progress: 72, description: "Faça uma forma reagir ao seu primeiro clique." },
  { id: "audio", title: "Som que responde ao gesto", type: "audio", level: "iniciante", time: "10 min", progress: 0, description: "Conheça a WebAudio API criando um pulso sonoro." },
  { id: "motion", title: "Movimento com JavaScript", type: "interaction", level: "iniciante", time: "12 min", progress: 0, description: "Transforme uma tecla em movimento e ritmo." },
];

const projects: Project[] = [
  { title: "Jardim de pixels", creator: "Lia Costa", initials: "LC", description: "Um experimento de cores que cresce com cada clique.", tag: "canvas", tone: "" },
  { title: "Sons de domingo", creator: "Ravi M.", initials: "RM", description: "Um pequeno instrumento para brincar com frequências.", tag: "webaudio", tone: "orange" },
  { title: "Órbita 01", creator: "Nina Vaz", initials: "NV", description: "Visual generativo feito com três regras simples.", tag: "generativo", tone: "green" },
];

const navItems: { route: Route; icon: string; label: string }[] = [
  { route: "home", icon: "⌂", label: "Início" },
  { route: "learn", icon: "◈", label: "Aprender" },
  { route: "feed", icon: "✳", label: "Feed" },
  { route: "projects", icon: "▱", label: "Projetos" },
  { route: "profile", icon: "◎", label: "Perfil" },
];

export default function HomePage() {
  const [route, setRoute] = useState<Route>("home");
  const [lessonId, setLessonId] = useState("canvas");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [interest, setInterest] = useState("visual");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setShowOnboarding(localStorage.getItem("vibe-onboarding-seen") !== "true");
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function navigate(nextRoute: Route) {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeOnboarding(start = false) {
    localStorage.setItem("vibe-onboarding-seen", "true");
    setShowOnboarding(false);
    if (start) { setLessonId("canvas"); navigate("lesson"); notify("Prática escolhida. Vamos começar."); }
  }

  const currentLesson = lessons.find((lesson) => lesson.id === lessonId) ?? lessons[0];

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <button className="brand" onClick={() => navigate("home")}><span className="brand-mark">✦</span><span>vibe<span className="brand-accent">/</span>coding</span></button>
        <p className="eyebrow sidebar-label">Seu laboratório</p>
        <nav className="nav-list">{navItems.map((item) => <NavButton key={item.route} item={item} active={route === item.route} onClick={() => navigate(item.route)} />)}</nav>
        <div className="sidebar-bottom"><div className="mini-progress"><div className="progress-ring">42%</div><div><strong>Trilha criativa</strong><small>2 de 5 passos</small></div></div><button className="ghost-button full" onClick={() => notify("Configurações serão adicionadas no próximo incremento.")}>⚙ Configurações</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => notify("Use a barra inferior para navegar.")} aria-label="Abrir menu">☰</button><div className="breadcrumb"><span className="muted">Laboratório</span><span>/</span><strong>{route === "lesson" ? "Lesson" : navItems.find((item) => item.route === route)?.label}</strong></div><div className="top-actions"><button className="icon-button" onClick={() => notify("Você tem 1 feedback novo em “Jardim de pixels”.")} aria-label="Notificações">♧<i /></button><button className="avatar avatar-small" onClick={() => navigate("profile")} aria-label="Abrir perfil">BM</button></div></header>
        <div className="view-container">{route === "home" && <HomeView lessons={lessons} projects={projects} onNavigate={navigate} onLesson={(id) => { setLessonId(id); navigate("lesson"); }} />}{route === "learn" && <LearnView lessons={lessons} onLesson={(id) => { setLessonId(id); navigate("lesson"); }} onNotify={notify} />}{route === "feed" && <FeedView projects={projects} onNotify={notify} />}{route === "projects" && <ProjectsView projects={projects} onNotify={notify} />}{route === "profile" && <ProfileView projects={projects} onNavigate={navigate} onNotify={notify} />}{route === "lesson" && <LessonView lesson={currentLesson} onNavigate={navigate} onNotify={notify} />}</div>
      </main>

      <nav className="mobile-nav" aria-label="Navegação mobile">{navItems.map((item) => <NavButton key={item.route} item={item} active={route === item.route} mobile onClick={() => navigate(item.route)} />)}</nav>
      {showOnboarding && <Onboarding interest={interest} setInterest={setInterest} onClose={() => closeOnboarding()} onStart={() => closeOnboarding(true)} />}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}

function NavButton({ item, active, mobile = false, onClick }: { item: typeof navItems[number]; active: boolean; mobile?: boolean; onClick: () => void }) {
  return <button className={`${mobile ? "" : "nav-item "}${active ? "active" : ""}`} onClick={onClick}><span>{item.icon}</span>{item.label}</button>;
}

function LessonCard({ lesson, onOpen }: { lesson: Lesson; onOpen: () => void }) {
  return <article className={`card lesson-card ${lesson.type}`}><div><div className="tag-row"><span className="tag">{lesson.type}</span><span className="tag purple">{lesson.level}</span></div><h3 style={{ marginTop: 18 }}>{lesson.title}</h3><p className="muted lesson-description">{lesson.description}</p></div><div><div className="progress-label"><span>{lesson.progress ? `${lesson.progress}% concluído` : "Ainda não começou"}</span><span>{lesson.time}</span></div><div className="progress-track"><span style={{ width: `${lesson.progress}%` }} /></div><button className="secondary-button full lesson-action" onClick={onOpen}>{lesson.progress ? "Continuar lesson" : "Começar prática"} <span>→</span></button></div></article>;
}

function ProjectCard({ project }: { project: Project }) {
  return <article className="card project-card"><div className={`project-thumb ${project.tone}`}><strong>{project.title}</strong></div><div className="project-body"><div className="tag-row"><span className="tag">{project.tag}</span></div><p>{project.description}</p><div className="creator"><span className="avatar">{project.initials}</span><span>por <strong style={{ color: "var(--text)" }}>{project.creator}</strong></span><span style={{ marginLeft: "auto" }}>♡ 24</span></div></div></article>;
}

function HomeView({ lessons: lessonList, projects: projectList, onNavigate, onLesson }: { lessons: Lesson[]; projects: Project[]; onNavigate: (route: Route) => void; onLesson: (id: string) => void }) {
  return <><section className="hero"><div><p className="eyebrow">terça, 14 de agosto</p><h1>Oi, Bia. Vamos<br /><span style={{ color: "var(--cyan)" }}>fazer algo</span> hoje?</h1><p>Seu laboratório está pronto. Continue de onde parou ou encontre uma ideia nova para experimentar.</p></div><div className="hero-art" aria-hidden="true"><span /><span /><span /></div></section><section className="card next-step"><div className="card-header"><div><p className="eyebrow">seu próximo passo</p><h2>Primeiro canvas interativo</h2><small>Lesson 01 · Visual · 8 min</small></div><span className="tag purple">72%</span></div><div className="progress-track"><span style={{ width: "72%" }} /></div><div className="next-step-footer"><small>Você parou no checkpoint 3</small><button className="primary-button" onClick={() => onLesson("canvas")}>Continuar <span>→</span></button></div></section><SectionHeading title="Escolha uma prática" action="Ver todas →" onClick={() => onNavigate("learn")} /><div className="grid grid-3">{lessonList.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} onOpen={() => onLesson(lesson.id)} />)}</div><SectionHeading title="Da comunidade" action="Explorar feed →" onClick={() => onNavigate("feed")} /><div className="grid grid-3">{projectList.map((project) => <ProjectCard key={project.title} project={project} />)}</div></>;
}

function SectionHeading({ title, action, onClick }: { title: string; action: string; onClick: () => void }) { return <div className="section-heading"><h2>{title}</h2><button className="text-button" onClick={onClick}>{action}</button></div>; }

function LearnView({ lessons: lessonList, onLesson, onNotify }: { lessons: Lesson[]; onLesson: (id: string) => void; onNotify: (message: string) => void }) { return <><section className="hero"><div><p className="eyebrow">biblioteca de práticas</p><h1>Aprender fazendo.</h1><p>Trilhas curtas, resultados visíveis e espaço para descobrir seu próprio caminho.</p></div></section><div className="tag-row filter-row">{["todas", "iniciante", "visual", "áudio"].map((filter) => <button key={filter} className={`tag ${filter === "iniciante" ? "purple" : ""}`} onClick={() => onNotify(`Filtro “${filter}” selecionado.`)}>{filter}</button>)}</div><div className="grid grid-3">{lessonList.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} onOpen={() => onLesson(lesson.id)} />)}</div><SectionHeading title="Trilha criativa" action="2 de 5 passos" onClick={() => undefined} /><div className="card"><div className="progress-label"><strong style={{ color: "var(--text)" }}>Do primeiro pixel ao projeto</strong><span>42%</span></div><div className="progress-track"><span style={{ width: "42%" }} /></div><p className="muted trail-copy">Aprenda o essencial para criar experiências visuais interativas.</p></div></>; }

function FeedView({ projects: projectList, onNotify }: { projects: Project[]; onNotify: (message: string) => void }) { return <><section className="hero"><div><p className="eyebrow">feito por pessoas como você</p><h1>Feed de experimentos.</h1><p>Projetos em andamento também têm lugar aqui. Observe, pergunte e compartilhe feedback útil.</p></div><button className="primary-button" onClick={() => onNotify("Os briefs de projeto estarão disponíveis no próximo checkpoint.")}>+ Publicar projeto</button></section><div className="card filter-bar"><span className="muted">Explorar por:</span>{["todos", "novos", "áudio", "iniciante"].map((filter) => <button key={filter} className={`tag ${filter === "novos" ? "purple" : ""}`} onClick={() => onNotify(`Filtro “${filter}” selecionado.`)}>{filter}</button>)}</div><div className="grid feed-list">{projectList.map((project, index) => <article className="card feed-card" key={project.title}><div className={`project-thumb ${project.tone}`}><strong>{project.title}</strong></div><div><div className="tag-row"><span className="tag">{project.tag}</span><span className="muted feed-time">há {index + 1}h</span></div><h3 className="feed-title">{project.title}</h3><p className="muted feed-description">{project.description} Estou testando como pequenas mudanças alteram a sensação do movimento.</p><div className="creator"><span className="avatar">{project.initials}</span><span>por <strong style={{ color: "var(--text)" }}>{project.creator}</strong></span></div><div className="feed-actions"><button onClick={(event) => { event.currentTarget.textContent = "♥ 25 reações"; }}>♡ 24 reações</button><button onClick={() => onNotify("Comentários serão abertos no fluxo de projeto.")}>◌ 6 comentários</button><button onClick={() => onNotify("Denúncia registrada. Obrigado por cuidar da comunidade.")}>⚑ denunciar</button></div></div></article>)}</div></>; }

function ProjectsView({ projects: projectList, onNotify }: { projects: Project[]; onNotify: (message: string) => void }) { return <><section className="hero"><div><p className="eyebrow">seu espaço de construção</p><h1>Projetos que<br /><span style={{ color: "var(--purple)" }}>ganham vida.</span></h1><p>Comece pequeno, publique uma versão e deixe o feedback ajudar na próxima.</p></div><button className="primary-button" onClick={() => onNotify("Os briefs de projeto estarão disponíveis no próximo checkpoint.")}>+ Novo projeto</button></section><div className="grid grid-3">{projectList.slice(0, 2).map((project) => <ProjectCard key={project.title} project={project} />)}<article className="card empty-state project-empty"><strong>Comece um novo experimento</strong><span>Escolha um brief e abra seu primeiro checkpoint.</span><button className="secondary-button" onClick={() => onNotify("Os briefs de projeto estarão disponíveis no próximo checkpoint.")}>Ver briefs</button></article></div></>; }

function ProfileView({ projects: projectList, onNavigate, onNotify }: { projects: Project[]; onNavigate: (route: Route) => void; onNotify: (message: string) => void }) { return <><section className="card"><div className="profile-head"><span className="avatar profile-avatar">BM</span><div><p className="eyebrow">criadora iniciante</p><h2>Bia Martins</h2><small>São Paulo · interessada em visual e áudio</small></div><button className="ghost-button profile-edit" onClick={() => onNotify("Edição de perfil será adicionada no próximo incremento.")}>Editar perfil</button></div><div className="stat-row"><div className="stat"><strong>2</strong><small>lessons concluídas</small></div><div className="stat"><strong>1</strong><small>projeto em andamento</small></div><div className="stat"><strong>1</strong><small>badge conquistada</small></div></div></section><SectionHeading title="Badges" action="" onClick={() => undefined} /><div className="grid grid-3"><div className="card"><span className="badge-icon">✦</span><h3>Primeiro experimento</h3><small>Concluiu sua primeira prática.</small></div><div className="card locked-badge"><span className="badge-icon">◎</span><h3>Construtor</h3><small>Publique seu primeiro projeto.</small></div></div><SectionHeading title="Seus projetos" action="Ver todos →" onClick={() => onNavigate("projects")} /><div className="grid grid-2">{projectList.slice(0, 2).map((project) => <ProjectCard key={project.title} project={project} />)}</div></>; }

function LessonView({ lesson, onNavigate, onNotify }: { lesson: Lesson; onNavigate: (route: Route) => void; onNotify: (message: string) => void }) { return <section className="lesson-detail"><button className="text-button" onClick={() => onNavigate("learn")}>← Voltar para aprender</button><div className="lesson-intro"><div className="tag-row"><span className="tag">{lesson.type}</span><span className="tag purple">{lesson.level}</span><span className="muted feed-time">{lesson.time}</span></div><h1>{lesson.title}</h1><p className="muted lesson-lead">{lesson.description} Nesta prática, você vai alterar uma pequena parte e observar como o navegador responde.</p></div><div className="card"><div className="card-header"><h3>Checkpoint 3 de 4</h3><span className="muted feed-time">72% concluído</span></div><div className="progress-track"><span style={{ width: "72%" }} /></div><div className="lesson-step"><p className="eyebrow">agora, experimente</p><h2>Faça a forma seguir o seu clique</h2><p className="muted lesson-lead">O evento de clique já existe. Seu trabalho é usar a posição do cursor para atualizar a variável <code>position</code>.</p><pre className="code-block">{`const shape = document.querySelector('.shape');\n\ncanvas.addEventListener('click', (event) => {\n  // sua mudança começa aqui\n  shape.style.transform = \`translate(\${event.offsetX}px)\`;\n});`}</pre><button className="primary-button" onClick={(event) => { event.currentTarget.textContent = "✓ Experiência executada"; event.currentTarget.style.background = "var(--green)"; onNotify("Funcionou! Observe o que mudou antes de seguir."); }}>▶ Executar experiência</button></div><div className="card quiz-card"><p className="eyebrow">uma pergunta rápida</p><h3>O que acontece quando o evento de clique é disparado?</h3><button className="quiz-option" onClick={(event) => { event.currentTarget.textContent = "✓ Boa. O evento dispara a mudança."; onNotify("Resposta correta."); }}>A forma recebe uma nova posição.</button><button className="quiz-option" onClick={() => onNotify("Tente observar qual linha usa a posição do clique.")}>O navegador fecha o canvas.</button></div></div></section>; }

function Onboarding({ interest, setInterest, onClose, onStart }: { interest: string; setInterest: (value: string) => void; onClose: () => void; onStart: () => void }) { return <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><div className="modal onboarding-modal"><button className="modal-close" onClick={onClose} aria-label="Fechar onboarding">×</button><div className="onboarding-orb">✦</div><p className="eyebrow">bem-vindo ao laboratório</p><h2 id="onboarding-title">Aprenda criando coisas que você quer mostrar.</h2><p className="modal-copy">Escolha um ponto de partida. Você pode mudar tudo depois.</p><div className="onboarding-options">{[{ id: "visual", icon: "◌", title: "Visual", detail: "Canvas, CSS e movimento" }, { id: "audio", icon: "◒", title: "Música & áudio", detail: "Som, ritmo e WebAudio" }, { id: "interaction", icon: "⌘", title: "Interação", detail: "Jogos e experiências" }].map((option) => <button key={option.id} className={`option-card ${interest === option.id ? "selected" : ""}`} onClick={() => setInterest(option.id)}><span>{option.icon}</span><strong>{option.title}</strong><small>{option.detail}</small></button>)}</div><button className="primary-button full" onClick={onStart}>Começar uma prática de 8 minutos <span>→</span></button><button className="text-button full" onClick={onClose}>Explorar primeiro</button><small className="privacy-note">Sem cartão. Sem integração externa. Seu perfil começa privado.</small></div></div>; }
