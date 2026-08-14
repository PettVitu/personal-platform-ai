# 07 — Roadmap, recursos, custos, riscos e aceite

## Roadmap de 12 meses

| Período | Entregáveis | Conclusão |
|---|---|---|
| Meses 1–2 | Pesquisa, arquitetura, UX e protótipo | 5–8 entrevistas, protótipo testado e modelo de dados revisado |
| Mês 3 | MVP financeiro e piloto | F1–F9/F12 funcionando com segurança básica |
| Mês 4 | Testes e correções | Principais erros de importação e onboarding tratados |
| Meses 5–6 | Metas, orçamento e simulador | Uso e cálculos validados |
| Meses 7–8 | Alertas e agenda | Alertas com baixo falso positivo; agenda opcional |
| Meses 9–10 | Avaliação de e-mail | Só avançar com demanda, segurança e consentimento aprovados |
| Mês 11 | IA e relatórios | Avaliação factual e custo monitorados |
| Mês 12 | Escala e decisão nativa | Métricas justificam ou não apps nativos |

## KPIs SMART iniciais

- Em 90 dias, onboarding concluído por ≥70% dos novos usuários.
- Em 90 dias, ≥60% registram ou importam a primeira transação.
- Em 90 dias, ≥35% criam meta em sete dias.
- No piloto, retenção D7 ≥30%, D30 ≥20% e revisão semanal em 30 dias ≥25% dos ativados.
- Importações sem erro bloqueador ≥90%.
- Falsos positivos de alertas <10% no piloto.
- Incidentes de privacidade: 0.
- Exportações válidas concluídas em ≥99% dos casos.

## Retenção responsável

Revisão semanal, progresso de metas, resumos opcionais, relatórios mensais e personalização progressiva. Evitar contagem infantilizada, urgência artificial, comparação social e alertas que gerem culpa. O usuário controla frequência, canal, horário e silêncio.

## Recursos e orçamento

Equipe mínima: PM/produto parcial, UX/UI parcial, 1 desenvolvedor full-stack sênior, frontend/QA compartilhado, revisão de segurança/privacidade e apoio de IA/dados sob demanda. Para US$ 50–75 mil, priorizar núcleo e reduzir integrações. US$ 80–120 mil viabiliza modularidade e piloto mais completo. US$ 120–150 mil ainda pode ser insuficiente para banco, e-mail, agenda, auditoria jurídica e operação multicanal simultaneamente.

Custos recorrentes incluem infraestrutura, banco, armazenamento/backups, observabilidade, e-mail transacional, provedor de IA, domínio, suporte e revisão de segurança. Definir orçamento mensal por usuário e limite de processamento antes de liberar IA.

## Matriz de riscos

| Risco | Prob./impacto | Sinal | Mitigação/contingência | Responsável |
|---|---|---|---|---|
| Escopo excessivo | Alta/alto | Integrações bloqueiam sprints | Congelar P0; lançar núcleo | Produto |
| CSV ruim | Alta/alto | Erros >10% | Template e correção; manter cadastro manual | Backend |
| Vazamento | Média/muito alto | Log sensível/acesso anômalo | Isolar, revogar tokens, responder incidente | Segurança |
| IA incorreta | Média/alto | Feedback negativo/fonte ausente | Desligar função e usar cálculo determinístico | IA/produto |
| Simulação mal interpretada | Média/alto | Usuário cita valor como promessa | Avisos e revisão de copy | Produto/jurídico |
| API externa instável | Média/médio | Timeout/token expirado | Feature flag e fallback manual | Backend |
| Custos de IA crescentes | Média/alto | Custo por usuário acima do teto | Limites, cache, modelos menores | Infra |
| Baixa retenção | Média/alto | D7/D30 abaixo da meta | Entrevistas e revisar onboarding | Produto |
| Excesso de alertas | Média/médio | Desativações em massa | Agrupar, limitar e silenciar | UX |

## Checklist de lançamento

- [ ] Visão, personas e escopo aprovados.
- [ ] Fluxos e wireframes implementáveis.
- [ ] P0 do backlog testado em mobile.
- [ ] Importação sem persistência parcial.
- [ ] Simulações com premissas e aviso.
- [ ] IA com fontes, schema e fallback.
- [ ] Exportação, exclusão e revogação funcionais.
- [ ] Matriz de permissões e retenção revisadas.
- [ ] Logs e plano de incidente prontos.
- [ ] KPIs e eventos de analytics definidos.
- [ ] Nenhuma ação financeira/externa automática.
