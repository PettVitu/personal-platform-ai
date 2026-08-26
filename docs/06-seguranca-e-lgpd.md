# 06 — Segurança e privacidade

## Estado atual

Tarefas, lançamentos, contas, agenda e documentos são persistidos em Postgres (Supabase) via Prisma, com cada registro pertencendo a um `userId` e todas as consultas filtradas por sessão. Login é feito via Google (Auth.js, `next-auth` v5), sessão guardada em banco (tabela `Session`, estratégia `database` — não é JWT). `localStorage` no cliente virou só um fallback de rede (ver [08](08-api-e-offline.md)), não a fonte de verdade.

Isso ainda depende de uma instância real de Postgres e de um client OAuth do Google configurados via variável de ambiente (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — ver `.env.example`). Sem isso, nenhuma rota de dados pessoais responde.

## Requisitos antes de produção

- [x] autenticação e autorização server-side (Auth.js + middleware, todas as rotas de dados pessoais exigem sessão);
- [x] banco com isolamento por usuário (Postgres/Prisma, toda query filtrada por `userId`);
- [ ] criptografia em trânsito (depende do domínio de deploy usar HTTPS — garantido automaticamente na Vercel);
- [ ] criptografia em repouso (depende de configuração do provedor de banco escolhido);
- [x] validação de entrada nas rotas de mutação;
- [ ] rate limiting;
- [ ] logs sem dados sensíveis;
- [ ] exportação e exclusão verificáveis pelo usuário;
- [ ] política de retenção;
- [ ] testes de acesso indevido (ex.: usuário A não conseguir ler/editar dado do usuário B);
- [ ] controle de documentos consultáveis pela IA.

O endpoint `/api/health` expõe `persistence` e `authentication` de forma honesta: `"not-configured"` enquanto as variáveis de ambiente acima não existirem, refletindo o estado real da instância.

## Requisitos específicos do conselheiro de investimentos

- chaves de API (Brapi, Marketaux) nunca ficam no cliente/browser, só em variável de ambiente do servidor;
- sem a chave configurada, o módulo cai em dados demonstrativos e sinaliza isso claramente na interface — nunca finge que o dado é real;
- nenhuma escrita, nenhuma execução de ordem: é um módulo só de leitura.

Requisitos de trading automatizado (custódia de chave de exchange, kill switch, limites de risco por trade, auditoria de ordem) pertencem ao futuro projeto privado de trading e serão documentados lá quando ele começar.
