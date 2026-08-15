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

### Proibições

Não incluir investimentos, crédito, empréstimos, produtos bancários, integração bancária, recomendações ou promessa de resultado.

## Agenda

Compromissos manuais com título, data, hora, local e observações. Integrações externas não fazem parte desta etapa.

## Documentos

Notas textuais com título, categoria, conteúdo, data e permissão explícita para consulta do Amarildo. Importação de arquivos fica para etapa posterior.
