# 05 — IA, prompts e avaliação

## Contrato comum

Use apenas dados autorizados e estruturados. Cite período, fonte e limitações. Separe fatos observados, cálculos, hipóteses e sugestões. Não invente dados, não faça julgamento, não recomende produto financeiro e não execute qualquer ação externa. Toda sugestão de alteração exige confirmação.

## Prompt: resumo financeiro

“Analise somente as transações confirmadas do período informado. Resuma receitas, despesas, categorias de maior impacto e variações relevantes. Mostre primeiro fatos observados com valores e período. Separe hipóteses em seção própria e não invente causas. Não faça julgamento moral nem recomendação financeira personalizada. Termine com até três perguntas práticas. Se os dados forem insuficientes, diga exatamente o que falta.”

## Prompt: classificação de despesa

“Classifique a transação em uma categoria existente usando descrição, valor, data e contexto autorizado. Se houver ambiguidade, apresente até três opções com confiança e peça confirmação. Não crie categoria, altere transação ou salve resultado sem confirmação. Não trate transferência como despesa sem evidência.”

## Prompt: simulação

“Calcule uma simulação usando apenas aporte inicial, aporte mensal, prazo, periodicidade e taxas fornecidos. Mostre valor aportado, juros estimados e valor final. Não invente taxas. Compare cenários somente quando taxas forem explicitamente fornecidas. Informe que é estimativa matemática, não garantia, recomendação ou decisão financeira.”

## Prompt: alerta financeiro

“Analise o orçamento e eventos confirmados. Identifique somente categorias que ultrapassaram ou se aproximam do limite segundo a regra informada. Explique o desvio com dados observados. Não sugira cortes essenciais sem perguntar. Informe origem, regra e ação possível. Não envie notificações nem altere dados.”

## Prompt: agenda

“Organize os compromissos autorizados das próximas 24 horas. Destaque horários, conflitos e eventos com preparação necessária. Não altere, crie ou exclua compromissos. Se houver incerteza, marque-a.”

## Prompt: e-mail

“Analise somente a mensagem explicitamente autorizada. Extraia remetente, assunto, data, valor, vencimento e tipo de cobrança quando existirem. Marque campos incertos e cite a origem de cada campo. Não envie respostas, não exclua mensagens e não tome ações externas. Retorne uma sugestão para confirmação humana.”

## Prompt: onboarding A/B

“Escreva duas variações de onboarding com até cinco telas. A enfatiza controle de gastos; B enfatiza metas. Inclua título, descrição, botão, permissão solicitada, opção de pular, hipótese e métrica. Não solicite integração como requisito.”

## Guardrails de implementação

- Dados enviados à IA devem ser minimizados e separados por usuário.
- Resposta deve retornar fontes/IDs internos, sem expor segredo.
- Saída precisa passar por validação de schema antes de chegar à UI.
- Falha de IA deve degradar para números e tabelas determinísticos.
- Prompts têm versão e são testados com casos normais, ambíguos e adversariais.

## Avaliação

Medir factualidade, ausência de invenção, precisão de categoria, incerteza, respeito a permissões, latência e custo. Falha crítica: recomendação não solicitada, ação externa, dado inventado ou vazamento de outro usuário.
