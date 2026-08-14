# Clareza — documentação operacional

Esta pasta substitui um PRD monolítico. Cada arquivo é autossuficiente para uma etapa de produto ou implementação e deve ser lido antes de alterar código relacionado.

## Documentos

1. [01 — Escopo e decisões](./01-escopo-e-decisoes.md): visão, personas, MVP, hipóteses e limites.
2. [02 — Fluxos e UX](./02-fluxos-e-ux.md): jornadas, estados, wireframes e acessibilidade.
3. [03 — Requisitos funcionais](./03-requisitos-funcionais.md): módulos, entidades, regras e requisitos não funcionais.
4. [04 — Backlog do MVP](./04-backlog-mvp.md): fatias, user stories e critérios de aceite.
5. [05 — IA e prompts](./05-ia-e-prompts.md): contratos, prompts, guardrails e avaliação.
6. [06 — Segurança e LGPD](./06-seguranca-e-lgpd.md): permissões, direitos e controles.
7. [07 — Roadmap e métricas](./07-roadmap-e-metricas.md): execução, KPIs, custos, riscos e checklist.

## Ordem para implementar

Leia 01 e 04 para definir a tarefa. Leia 02 e 03 para construir a experiência e o domínio. Leia 05 se houver IA e 06 se houver dados, autenticação ou integrações. Use 07 para priorização e validação.

## Regras de decisão

- Se uma funcionalidade não estiver no backlog P0/P1, não é necessária para o núcleo do MVP.
- Se houver conflito, pare e registre a decisão antes de codificar.
- Toda entrega deve informar objetivo, dados, permissões, estados de erro, critérios de aceite e testes.
- Toda mudança de escopo deve atualizar o documento focado correspondente.

## Estado

Documentação consolidada e modular. O antigo `PRD.md` foi removido para evitar fontes duplicadas.
