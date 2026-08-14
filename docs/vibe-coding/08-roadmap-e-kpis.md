# 08 — Roadmap, KPIs e retenção

**Horizonte:** 12 meses  
**MVP:** 3 meses  
**Princípio:** validar aprendizagem e publicação antes de ampliar comunidade e monetização.

## 1. Roadmap mensal

| Mês | Milestone | Entregáveis | Dependências | Critério de conclusão |
|---:|---|---|---|---|
| 1 | Descoberta e fundação | Entrevistas, protótipo, modelo de conteúdo, código de conduta, arquitetura | Acesso a usuários e especialistas | 8 entrevistas, protótipo testado e backlog priorizado |
| 2 | Núcleo de aprendizagem | Catálogo, lesson, progresso, quiz, projeto e perfil | Design system e modelo de dados | 3 lessons funcionais e progresso persistido |
| 3 | MVP piloto | 10 lessons, 3 projetos, feed, comentários, denúncias, analytics | Conteúdo revisado e moderação operacional | 20–30 usuários piloto completam primeiro ciclo |
| 4 | Correção e ativação | Testes A/B de onboarding, melhorias de setup e acessibilidade | Dados do piloto | Erros críticos resolvidos e prática D1 medida |
| 5 | Cohort experimental | Cohort manual, calendário, sessão ao vivo e feedback guiado | Conteúdo e moderador | Uma cohort concluída com satisfação medida |
| 6 | Conteúdo e badges | Remix, badges, rubricas e revisão editorial | Eventos de domínio e curadoria | Badges não podem ser obtidos por spam |
| 7 | Comunidade segura | Filtros de feed, ranking inicial, bloqueio, moderação e notificações | Política de conduta e analytics | Denúncias têm SLA e ranking auditável |
| 8 | RAG educacional | Ingestão, chunks, embeddings, busca híbrida e citações | Conteúdo publicado e segurança | Avaliação offline supera baseline lexical |
| 9 | Oferta inicial | Uma oferta de cohort/trilha premium, checkout e suporte | Termos, provedor de pagamento e suporte | Compra teste, reembolso teste e acesso revogável |
| 10 | IA assistida | Tutor contextual, feedback e explicação de erros | RAG avaliado e guardrails | Respostas citam fontes e passam casos de segurança |
| 11 | Retenção | E-mail flows, notificações, relatório de progresso e experimentos | Consentimento e eventos confiáveis | Usuário controla frequência e opt-out funciona |
| 12 | Escala e decisão nativa | Performance, custos, revisão de arquitetura e decisão sobre app nativo | KPIs de 90 dias | Decisão baseada em uso; nenhum app nativo por presunção |

## 2. Fases e gates

### Gate A — valor educacional

Não avançar para monetização se usuários não concluírem uma prática e não entenderem o resultado.

### Gate B — segurança comunitária

Não ampliar feed ou chat se denúncias não tiverem triagem, responsável e tempo de resposta.

### Gate C — qualidade de IA

Não liberar tutor público se respostas não tiverem fontes, fallback e avaliação de prompt injection.

### Gate D — sustentabilidade

Não ampliar notificações ou modelos caros se custo por usuário e taxa de opt-out estiverem acima do limite.

## 3. KPIs e metas SMART

### Aquisição

| Métrica | Meta inicial | Prazo |
|---|---:|---|
| Visitantes qualificados da landing page | 1.000/mês | mês 6 |
| Conversão visitante → cadastro | ≥12% | mês 4 |
| CAC de usuário ativado | ≤ US$ 20 | mês 6 |
| Convites ou compartilhamentos por ativado | ≥0,3 | mês 6 |

### Ativação

| Métrica | Meta inicial | Prazo |
|---|---:|---|
| Onboarding concluído | ≥70% | piloto |
| Primeira lesson iniciada | ≥60% | piloto |
| Prática concluída em 24h | ≥40% | mês 4 |
| Projeto iniciado em 7 dias | ≥35% | mês 4 |
| Projeto publicado em 14 dias | ≥20% | mês 4 |

### Retenção e comunidade

| Métrica | Meta inicial | Prazo |
|---|---:|---|
| Retenção D7 | ≥30% | mês 4 |
| Retenção D30 | ≥20% | mês 6 |
| Usuários ativos semanais / cadastrados | ≥25% | mês 6 |
| Projeto publicado que recebe feedback | ≥50% | mês 4 |
| Feedback classificado como útil | ≥70% | mês 6 |
| Denúncias procedentes por 1.000 interações | <15 | contínuo |

### Receita

| Métrica | Meta inicial | Prazo |
|---|---:|---|
| Usuários ativados que veem oferta | 30–50% | mês 9 |
| Conversão da oferta | 3–8% | mês 10 |
| Reembolso | <8% | mês 10 |
| Churn de oferta recorrente | medir antes de definir meta | mês 12 |
| Receita líquida por comprador | cobrir custo variável em 3 meses | mês 12 |

### Qualidade e segurança

- ≥90% das lessons têm conclusão sem erro bloqueador.
- ≥95% das respostas de IA avaliadas têm fonte correta.
- 0 incidentes conhecidos de exposição de dados privados.
- 100% das denúncias recebem protocolo de status.
- 100% dos consentimentos têm finalidade e versão registradas.

## 4. Retenção responsável

### Cohorts

Usar cohorts com início, objetivo, calendário e encerramento. Cada cohort deve ter uma prática semanal e uma sessão opcional. Não transformar participação em competição por presença.

### Mentoria

Começar com office hours ou revisão coletiva. Mentoria individual exige disponibilidade, regras, preço, conduta e mecanismo de denúncia. Não vender acesso a uma pessoa sem garantir capacidade de atendimento.

### Eventos ao vivo

Uma sessão experimental por mês, gravada com consentimento. Fornecer transcrição, resumo e atividade assíncrona. Eventos não devem ser requisito para concluir uma trilha.

### Notificações e e-mail flows

- Boas-vindas: uma mensagem após cadastro.
- Retomar lesson: no máximo uma lembrança após 48–72h.
- Feedback recebido: agrupado diariamente.
- Cohort: calendário configurável.
- Progresso: resumo semanal opcional.
- Reengajamento: no máximo duas tentativas; depois reduzir frequência.

Toda mensagem tem opt-out, origem clara e não usa culpa. O usuário escolhe canal, frequência e horário silencioso.

### Gamificação

Usar badges por conclusão, iteração e ajuda útil. Evitar streaks punitivas, ranking global e pontos por volume de comentários. Recompensar comportamento que melhora aprendizagem e comunidade.

## 5. Instrumentação mínima

Registrar eventos pseudonimizados: cadastro, onboarding, lesson iniciada/concluída, quiz, projeto iniciado/publicado, feedback, denúncia, badge, oferta vista, checkout, compra, cancelamento e exclusão.

Cada evento precisa de nome, versão, timestamp, cohort, dispositivo e ID pseudônimo. Não enviar código privado, mensagem completa ou dado pessoal desnecessário.

## 6. Checkpoint de roadmap e KPIs

**Entrega:** roadmap mensal, gates, KPIs SMART, retenção, cohorts, eventos e monetização responsável.  
**Pendências:** segurança detalhada, stack, recursos, estimativa final e checklist integrado.  
**Status:** **ACEITO COM RESSALVAS.**  
**Comentário:** as metas devem ser tratadas como hipóteses iniciais e recalibradas após o piloto; não usar DAU como único indicador de aprendizagem.
