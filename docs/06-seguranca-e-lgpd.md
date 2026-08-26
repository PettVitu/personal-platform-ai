# 06 — Segurança e privacidade

## Estado da primeira entrega

Os dados ficam no navegador via `localStorage`. Isso não oferece backup, criptografia de aplicação, isolamento entre contas ou sincronização.

## Requisitos antes de produção

- autenticação e autorização server-side;
- banco com isolamento por usuário;
- criptografia em trânsito e repouso;
- validação de entrada;
- rate limiting;
- logs sem dados sensíveis;
- exportação e exclusão verificáveis;
- política de retenção;
- testes de acesso indevido;
- controle de documentos consultáveis pela IA.

A API atual expõe explicitamente `persistence: memory` e `authentication: pending` no endpoint de saúde.

## Requisitos específicos do conselheiro de investimentos

- chaves de API (Brapi, Marketaux) nunca ficam no cliente/browser, só em variável de ambiente do servidor;
- sem a chave configurada, o módulo cai em dados demonstrativos e sinaliza isso claramente na interface — nunca finge que o dado é real;
- nenhuma escrita, nenhuma execução de ordem: é um módulo só de leitura.

Requisitos de trading automatizado (custódia de chave de exchange, kill switch, limites de risco por trade, auditoria de ordem) pertencem ao futuro projeto privado de trading e serão documentados lá quando ele começar.
