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
