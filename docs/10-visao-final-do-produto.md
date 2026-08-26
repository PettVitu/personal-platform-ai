# 10 — Visão do produto final

Este documento existe para responder uma pergunta só: **o que falta para cada parte do projeto estar pronta, e em que ordem fazer**. Os outros documentos (`01` a `09`) registram decisões e o porquê delas; este aqui é o checklist prático que amarra todos eles. Comece por aqui quando for decidir o que fazer a seguir.

## O produto quando estiver completo

Um app pessoal privado, mobile-first, que organiza tarefas, agenda, finanças básicas e documentos — e, à parte disso, um conselheiro de investimentos público que sugere ações e FIIs com base em dados reais e nunca executa nada sozinho. Funciona útil mesmo sem IA. Roda com conta própria, dados isolados por usuário, banco persistente e nada de dado sensível em `localStorage` ou em memória de processo.

O que **não** faz parte deste produto: banco/crédito, integração bancária, e-mail, colaboração multiusuário, marketplace, e qualquer execução automática de ordem de mercado — isso é [outro projeto, separado e privado](09-investimentos-e-harness.md#sobre-o-futuro-projeto-de-trading).

## Como navegar a documentação

| Pergunta | Documento |
|---|---|
| Por que essa decisão de escopo foi tomada? | [01 — Escopo e decisões](01-escopo-e-decisoes.md) |
| Como a navegação e as telas devem se comportar? | [02 — Fluxos e UX](02-fluxos-e-ux.md) |
| O que cada módulo precisa fazer, em detalhe? | [03 — Requisitos funcionais](03-requisitos-funcionais.md) |
| O que já foi entregue e o que vem a seguir? | [04 — Backlog do MVP](04-backlog-mvp.md) |
| Como a IA (Amarildo e o conselheiro) deve se comportar? | [05 — IA e prompts](05-ia-e-prompts.md) |
| O que precisa existir antes de produção, em segurança? | [06 — Segurança e LGPD](06-seguranca-e-lgpd.md) |
| Em que fase estamos e como medir sucesso? | [07 — Roadmap e métricas](07-roadmap-e-metricas.md) |
| Como a API e o modo offline funcionam hoje? | [08 — API e offline](08-api-e-offline.md) |
| Como funciona o conselheiro de investimentos? | [09 — Investimentos e harness](09-investimentos-e-harness.md) |

## Checklist por módulo

Cada linha é uma coisa concreta que falta. Quando todas as linhas de um módulo estiverem marcadas, o módulo está pronto para produção.

### Plataforma (transversal a todos os módulos)

- [ ] banco de dados persistente substituindo `localStorage` e a API em memória ([06](06-seguranca-e-lgpd.md))
- [ ] autenticação e autorização server-side, com isolamento de dados por usuário
- [ ] criptografia em trânsito (HTTPS) e em repouso
- [ ] sincronização real entre dispositivos (hoje cada dispositivo tem seus próprios dados locais)
- [ ] exportação e exclusão de dados verificáveis pelo usuário (LGPD)
- [ ] rate limiting e logs sem dado sensível
- [ ] testes automatizados de domínio, além dos E2E já existentes
- [ ] acessibilidade auditada (foco visível, contraste, navegação por teclado, `prefers-reduced-motion`) — [02](02-fluxos-e-ux.md)

### Tarefas, Finanças, Agenda, Documentos

- [x] CRUD completo com confirmação antes de excluir
- [x] estados de carregamento, vazio, erro e offline
- [ ] edição de documentos (hoje só criação)
- [ ] importação de arquivos para Documentos
- [ ] persistência real (depende do item de banco acima)

### Amarildo (assistente de IA)

- [x] simulação local transparente, sem enviar dado a provedor nenhum
- [ ] chamada real a um provedor de IA, com schema de resposta e limite de custo
- [ ] RAG sobre documentos autorizados, com fonte citada e filtro por permissão — [05](05-ia-e-prompts.md)
- [ ] confirmação antes de qualquer criação/alteração/exclusão feita via IA

### Conselheiro de investimentos

- [x] scoring auditável (fundamentos + notícia) com explicação em texto
- [x] integração real com Brapi (preço, nome, P/L) e Marketaux (notícias)
- [x] fallback demonstrativo claro na interface quando falta chave de API
- [x] histórico de sugestões (hoje em memória de processo)
- [ ] dividend yield real (bloqueado pelo plano gratuito da Brapi — módulo `defaultKeyStatistics` é pago)
- [ ] histórico persistido em banco, não só em memória
- [ ] comparação automática entre score passado e retorno real observado depois
- [ ] watchlist configurável pelo usuário (hoje são 6 tickers fixos no código)
- [ ] explicação via LLM real, mantendo a regra de que a IA nunca calcula o número — [05](05-ia-e-prompts.md#ia-no-conselheiro-de-investimentos)

## Ordem recomendada

1. **Banco + autenticação** — todo o resto depende disso; sem isso, "produção" não é uma opção real.
2. **Sincronização e testes de domínio** — consolidar o que já existe sobre a nova base persistente.
3. **Conselheiro**: watchlist configurável e histórico persistido — já tem tração, vale terminar antes de abrir frente nova.
4. **IA real** (Amarildo e explicação do conselheiro) — só depois da base de dados e do RAG terem onde se apoiar.
5. **Harness de trading (Binance)** — projeto novo e separado, só depois de tudo acima.

## Fora de escopo definitivo

Banco/crédito tradicional, integração bancária, e-mail, colaboração multiusuário, recursos sociais, marketplace, publicação pública, e qualquer execução automática de ordem de mercado dentro deste repositório.
