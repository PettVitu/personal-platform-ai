# 03 — Requisitos funcionais

## Tarefas

Criar, editar, concluir, reabrir e excluir com confirmação. Cada tarefa pode ter data, horário, prioridade, observação e recorrência futura.

## Finanças pessoais

O módulo financeiro registra fatos informados pelo usuário. Ele não é banco, contador ou consultor.

### Lançamentos

- receita ou despesa;
- descrição;
- valor positivo em BRL;
- data local;
- categoria;
- conta ou carteira;
- edição e exclusão confirmada.

### Contas recorrentes

- nome;
- valor;
- vencimento;
- status pago/pendente;
- histórico futuro, sem automação bancária.

### Cálculos

Saldo = receitas confirmadas − despesas confirmadas. Todo resumo deve indicar período e origem. Valores são exibidos em `pt-BR` e armazenados sem depender de operações imprecisas de ponto flutuante em uma implementação de produção.

### Categorias de gasto diário e controle de orçamento

Além dos lançamentos individuais, o usuário pode pré-cadastrar categorias de gasto do dia a dia que normalmente não geram lançamento (transporte, lazer, futilidades), cada uma com um valor mensal estimado. Isso alimenta um cálculo de "quanto dá pra gastar hoje" (`src/domain/daily-budget.ts`, função pura e testada), recalculado por mês calendário:

```
orçamento diário = (saldo atual + receitas previstas até o fim do mês
                     − contas não pagas com vencimento até o fim do mês
                     − categorias de gasto (proporcional aos dias restantes))
                    / dias restantes no mês
```

O orçamento de cada dia **zera à meia-noite** — não acumula sobra do dia anterior. É um freio de referência, não uma poupança. Mostrado como card compacto em "Hoje" e detalhado em "Finanças" (`src/components/DailyBudgetCard.tsx`).

**Fora de escopo desta versão** (registrado para depois, não esquecido): visualização em formato de planilha/"farol" colorido para os próximos dias; projeção de longo prazo (até 2 anos); modelagem de parcelamento/recorrência dentro de "Contas recorrentes" (cartão parcelado × único × recorrente indefinido, com contagem de parcelas).

### Proibições

Não incluir crédito, empréstimos, produtos bancários, integração bancária, recomendações ou promessa de resultado. Investimentos são tratados em módulo separado (ver abaixo) e nunca se misturam ao saldo/lançamentos deste módulo.

## Conselheiro de investimentos

Módulo separado da organização financeira básica, público e somente informativo — nunca executa ordens. Detalhes de arquitetura e fontes de dados em [09 — Conselheiro de investimentos](09-investimentos-e-harness.md).

Resumo funcional:

- foco em ações e FIIs brasileiros, com watchlist configurável por usuário logado (padrão de 6 tickers para quem não personalizou ou não está logado);
- ingestão de cotação/fundamentos (Brapi) e notícias (Marketaux), com fonte e horário sempre visíveis; quando as chaves de API não estão configuradas, usa dados demonstrativos e sinaliza isso na interface;
- scoring quantitativo auditável por ativo, combinando fundamentos (dividend yield, P/L) e sentimento de notícia;
- explicação em texto de por que cada ativo pontuou daquele jeito;
- sem persistência de histórico ainda, sem execução de ordens, sem promessa de retorno.

Execução automática de ordens (ex.: trading de cripto via Binance) não faz parte deste projeto — fica reservada a um repositório separado e privado, a ser criado depois do conselheiro estar finalizado.

## Agenda

Compromissos manuais com título, data, hora, local e observações. Integrações externas não fazem parte desta etapa.

## Documentos

Notas textuais com título, categoria, conteúdo, data e permissão explícita para consulta do Amarildo. Importação de arquivos fica para etapa posterior.
