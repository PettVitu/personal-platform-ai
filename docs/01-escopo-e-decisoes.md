# 01 — Escopo e decisões

## Produto

O personal platform AI é um aplicativo pessoal privado para organizar tarefas, lembretes, compromissos, receitas, despesas, contas recorrentes, documentos textuais, textos que precisam ser reformulados e — como novo módulo, à parte da organização financeira básica — um conselheiro de investimentos público e informativo.

## Princípios

- simplicidade antes de quantidade de recursos;
- mobile-first;
- privacidade por padrão;
- fatos separados de sugestões;
- nenhuma ação destrutiva sem confirmação;
- o módulo financeiro pessoal (lançamentos, contas, orçamento) nunca dá recomendação financeira, médica ou jurídica;
- o módulo de investimentos é uma exceção deliberada e isolada a essa regra: ele existe justamente para sugerir, com fundamentos e notícias auditáveis. Essa exceção é sempre visível para o usuário, nunca implícita;
- o conselheiro de investimentos nunca executa ordens — é só sugestão informativa. Qualquer execução automática de trades fica fora deste projeto, num repositório privado à parte, ainda não iniciado;
- funcionamento útil sem IA.

## Fora do MVP

Integração bancária tradicional, e-mail, colaboração, recursos sociais, marketplace, publicação pública e qualquer execução automática de ordens de mercado (isso pertence ao futuro projeto de trading, separado e privado).

## Decisões atuais

- Nome: `personal platform AI`.
- Persistência: Postgres (Supabase) via Prisma, com dados isolados por usuário. `localStorage` no cliente continua só como fallback de rede (ver [08](08-api-e-offline.md)).
- Autenticação: login com Google via Auth.js (`next-auth` v5), sessão em JWT (não "database" — o middleware roda em Edge runtime, onde o Prisma padrão não funciona; JWT deixa o middleware decodificar o cookie sem tocar no banco). Todas as rotas de dados pessoais exigem sessão; `/api/health` e `/api/investments/*` ficam abertas por não exporem dado de usuário.
- API: endpoints Next.js App Router, protegidos por sessão, com dados no Postgres — código pronto, falta só a instância real (Supabase) e o client OAuth (Google Cloud) para rodar de ponta a ponta.
- Amarildo: simulado e transparente.
- Importação de documentos: posterior.
- Investimentos: módulo público e somente informativo (ações e FIIs brasileiros), com scoring quantitativo auditável (fundamentos + notícias) e explicação em texto — sem execução de ordens. Detalhes em [09 — Conselheiro de investimentos](09-investimentos-e-harness.md).
- Trading automatizado (ex.: integração com Binance) foi deliberadamente adiado para um projeto separado e privado, criado quando o conselheiro estiver finalizado.
