# 03 — Requisitos funcionais e arquitetura

## Princípios

Domínios financeiros, eventos e notificações são separados. Telas e IA não escrevem diretamente no banco: usam serviços de domínio. Toda mutação relevante tem confirmação, origem e auditoria.

## Módulos

### Finanças

Receitas, despesas, categorias personalizadas, contas, cartões, parcelamentos, assinaturas, transferências, fluxo de caixa, orçamento mensal e histórico. Transferência não é receita/despesa por padrão. Saldo inicial não é receita.

### Investimentos

Ativos manuais, tipos, classes, quantidade/valor informado, aportes, rentabilidade manual, distribuição e simulação de juros compostos. O simulador mostra aporte, juros estimados e total. Não há garantia, recomendação ou execução de ordem.

### Planejamento

Metas de reserva, viagem, compra, dívida e aposentadoria com valor-alvo, prazo, saldo atual, aporte e status. Aportes recorrentes são lembretes, não transações automáticas.

### Agenda e e-mail

Vencimentos, recorrências, compromissos, reuniões, eventos, lembretes e revisões. E-mail é posterior: pode identificar cobrança, comprovante, data e valor somente após autorização, sempre aguardando confirmação.

### Assistente de IA

Resumo financeiro, explicação de variações, classificação sugerida, gasto incomum, resumo de agenda, perguntas sobre dados e cenários. Recebe somente dados autorizados e estruturados.

## Entidades

| Entidade | Campos mínimos |
|---|---|
| User | id, e-mail, timezone, moeda, preferências |
| Consent | usuário, finalidade, escopo, versão, data, status, revogado_em |
| Account | nome, tipo, saldo inicial, moeda, status |
| Category | nome, tipo, cor, ativa |
| Transaction | tipo, valor, data, descrição, conta, categoria, origem, status, import_id |
| Budget | período, categoria, limite, realizado |
| Goal | nome, tipo, alvo, prazo, saldo, aporte, status |
| Asset | nome, classe, tipo, valor, rentabilidade, atualizado_em |
| Event | título, data, origem, recorrência, lembrete, status |
| Notification | regra, origem, canal, horário, entrega, leitura |
| AIArtifact | tarefa, dados_usados, resposta, fontes, prompt_version, feedback |

## Regras de domínio

- Valores monetários usam precisão decimal, nunca float para persistência.
- Cada transação importada tem chave de origem para deduplicação.
- Datas são armazenadas com timezone do usuário e exibidas localmente.
- Exclusões destrutivas exigem confirmação e ficam registradas.
- IA não pode criar categoria, transação, evento ou alerta sem confirmação.
- Projeções exibem premissas, período e data de cálculo.

## Requisitos não funcionais

- PWA responsiva, mobile-first e instalável.
- Operações de importação idempotentes e canceláveis.
- Logs técnicos sem conteúdo financeiro desnecessário.
- API versionada para possível app nativo.
- Testes de unidade para cálculos e testes de integração para importação/permissões.
- Observabilidade para erros, latência, filas e custos de IA.
