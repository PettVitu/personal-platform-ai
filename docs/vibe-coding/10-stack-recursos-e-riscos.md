# 10 — Stack, recursos, custos e riscos

## 1. Stack recomendada

| Camada | Recomendação | Motivo e trade-off |
|---|---|---|
| Frontend/PWA | Next.js + TypeScript + Tailwind + design system próprio | Boa produtividade e SEO; exige disciplina para não acoplar UI ao backend |
| Estado/dados | TanStack Query e estado local | Cache claro e menos complexidade; exige invalidação correta |
| Backend | Next.js server/API ou NestJS modular | Começar simples; separar serviço quando domínio crescer |
| Banco | PostgreSQL | Relacional para usuários, progresso, projetos, pagamentos e auditoria |
| Vetor/RAG | pgvector no início; serviço dedicado depois se necessário | Menor operação; escala vetorial limitada antes de otimizar |
| Auth | Auth.js ou provedor gerenciado | Reduz risco; dependência de fornecedor e custo posterior |
| Arquivos | S3 compatível com URLs assinadas | Bom para mídia e exportação; exige políticas de retenção |
| Jobs | Redis + BullMQ ou fila gerenciada | Ingestão RAG, e-mails e thumbnails; exige idempotência |
| Pagamentos | Stripe ou provedor compatível com mercado-alvo | Checkout e webhooks; exige conciliação e suporte |
| IA | API de modelo com embeddings e geração | Velocidade no MVP; custo, latência e dependência externa |
| Analytics | PostHog ou ferramenta equivalente | Funis e experimentos; revisar privacidade e retenção |
| Observabilidade | Sentry + logs estruturados + métricas | Diagnóstico rápido; evitar registrar conteúdo sensível |
| Infra | Vercel/Cloudflare + Postgres gerenciado ou equivalente | Baixa operação; lock-in e limites de execução |
| CI/CD | GitHub Actions, preview e migrations controladas | Feedback rápido; secrets e permissões precisam ser mínimos |

## 2. Arquitetura lógica

```text
PWA
  → API autenticada
      → domínio de aprendizagem
      → domínio de projetos/comunidade
      → domínio de moderação
      → domínio de pagamento
      → serviço de IA/RAG
  → PostgreSQL + pgvector
  → object storage
  → fila de jobs
  → analytics/observabilidade
```

Separar permissões e schemas por domínio. O agente acessa views/ferramentas permitidas, não SQL amplo. Conteúdo público, privado e administrativo usam filtros e, quando necessário, índices separados.

## 3. Equipe e esforço

### MVP enxuto

- 1 product manager/founder técnico, 0,5–1 FTE.
- 1 desenvolvedor full-stack sênior.
- 1 frontend/design engineer, 0,5–1 FTE.
- 1 UX/UI designer, 0,25–0,5 FTE.
- 1 QA/automation, 0,25–0,5 FTE.
- 1 editor técnico/pedagógico, 0,5 FTE durante conteúdo.
- 1 moderador/comunidade, 0,25–0,5 FTE no piloto.
- revisão jurídica, privacidade e segurança sob demanda.

Não tentar manter equipe de engenharia, conteúdo, suporte e moderação com uma única pessoa após o piloto público.

## 4. Estimativa financeira

| Cenário | Desenvolvimento | Conteúdo/UX | Segurança/operacional | Total inicial |
|---|---:|---:|---:|---:|
| Enxuto | US$ 35–55 mil | US$ 10–15 mil | US$ 5–10 mil | US$ 50–80 mil |
| Modular recomendado | US$ 55–85 mil | US$ 15–25 mil | US$ 10–20 mil | US$ 80–130 mil |
| Completo | US$ 85–110 mil | US$ 20–35 mil | US$ 20–40 mil | US$ 125–185 mil |

O orçamento de US$ 50–150 mil é suficiente para o MVP modular se chat, marketplace e certificação profissional forem adiados. Pode ser insuficiente para conteúdo amplo, moderação 24/7, app nativo, IA em alto volume e conformidade jurídica completa ao mesmo tempo.

## 5. Custos recorrentes iniciais

Considerar hospedagem, banco, storage/CDN, e-mail, provedor de IA, embeddings, analytics, monitoramento, pagamentos, suporte, moderação e backups. Definir teto por usuário ativado e alertar quando custo de IA superar a margem planejada.

## 6. Dependências

- Conteúdo revisado antes da implementação final.
- Provedor de autenticação e armazenamento escolhido antes do sprint 1.
- Política de privacidade e conduta antes do feed público.
- Provedor de pagamento e termos antes de vender.
- Conjunto de avaliação RAG antes de liberar tutor.
- Moderador responsável antes de abrir comentários.

## 7. Matriz de riscos

| Risco | Prob./impacto | Sinal | Mitigação | Contingência | Dono |
|---|---|---|---|---|---|
| Escopo excessivo | Alta/alto | Backlog cresce por integração | P0 rígido e gates | Lançar somente aprendizagem/projeto | Produto |
| Conteúdo insuficiente | Média/alto | Lessons abandonadas | Editor, revisão e testes | Reduzir trilhas, aumentar qualidade | Conteúdo |
| Baixa conclusão | Alta/alto | Prática D1 baixa | Micro-lessons e onboarding A/B | Entrevistas e reescrever first mile | Produto/UX |
| Comunidade tóxica | Média/muito alto | Denúncias e reincidência | Conduta, triagem e limites | Fechar publicação temporariamente | Moderação |
| Vulnerabilidade em código | Média/muito alto | Execução fora do sandbox | Não executar no servidor sem isolamento | Desligar execução e usar link externo | Engenharia |
| RAG alucina | Média/alto | Citação incorreta | Avaliação, filtros e fallback | Desligar tutor e usar FAQ | IA |
| Custo de IA | Média/alto | Custo/usuário cresce | Presets, cache, limites e modelos menores | Reduzir geração e priorizar busca | Infra |
| API/infra indisponível | Média/médio | Timeout e filas | Monitoramento e retry idempotente | Modo leitura e manutenção comunicada | Engenharia |
| Pagamento incorreto | Baixa/muito alto | Webhook divergente | Idempotência e reconciliação | Suspender oferta e suporte manual | Financeiro |
| Privacidade/LGPD | Média/muito alto | Pedido não atendido | Minimização, logs e processo de direitos | Incidente e revisão jurídica | Privacidade |
| Dependência de criadores | Média/médio | Uma pessoa concentra conteúdo | Versionar e documentar | Reduzir catálogo ativo | Conteúdo |
| Burnout de moderador | Média/alto | SLA piora | Turnos, limites e escalonamento | Fechar comentários temporariamente | Comunidade |

## 8. Plano de mitigação por fase

### Antes do código

Validar problema, personas, fluxo, conteúdo piloto, threat model, modelo de dados e eventos de analytics.

### Antes do piloto

Testar autorização, exclusão, upload, denúncia, recuperação de conta, acessibilidade, custo de IA e restauração de backup.

### Antes do público

Validar SLA de moderação, política de privacidade, termos, suporte de pagamento, limites de custo e plano de incidente.

## 9. Checklist final de aceitação

- [ ] Visão e proposta de valor definidas.
- [ ] Três personas e jornadas documentadas.
- [ ] Três opções de MVP comparadas.
- [ ] MVP de três meses priorizado.
- [ ] Fluxo completo documentado.
- [ ] Arquitetura de conteúdo com 10 lessons e 3 projetos.
- [ ] RAG com chunks, metadados, filtros, top_k, top_p e temperatura.
- [ ] Wireframes e microcopy das telas principais.
- [ ] Onboarding A/B com métricas.
- [ ] User stories e critérios de aceite.
- [ ] Prompts internos com guardrails.
- [ ] Roadmap de 12 meses e milestones.
- [ ] KPIs SMART de aquisição, ativação, retenção, receita e referência.
- [ ] Estratégias de cohorts, eventos, mentorias e notificações.
- [ ] Moderação, LGPD, segurança e incidentes.
- [ ] Stack, equipe, custos e dependências.
- [ ] Riscos e contingências.
- [ ] Nenhum recurso fora do MVP bloqueia o lançamento.

## 10. Estado de conclusão

O pacote documental está completo para iniciar descoberta técnica e prototipação. Antes de produção, ainda são necessárias validação jurídica, revisão humana das lessons, threat model executado, testes com usuários e confirmação do orçamento.

## Checkpoint final — aprovação simulada

**Entrega:** roadmap, KPIs, retenção, moderação, LGPD, segurança, stack, recursos, custos, riscos e checklist.  
**Status:** **ACEITO COM PENDÊNCIAS DE VALIDAÇÃO.**  
**Comentário:** a documentação está suficientemente detalhada para iniciar o MVP. Não autoriza lançamento público sem revisão jurídica, conteúdo revisado, operação de moderação e testes de segurança.
