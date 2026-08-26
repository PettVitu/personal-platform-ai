# 04 — Backlog do MVP

## Entregue

- shell responsivo;
- dashboard Hoje;
- tarefas com persistência local;
- receitas e despesas;
- contas recorrentes;
- agenda manual;
- documentos textuais;
- Amarildo simulado;
- reformulação demonstrativa;
- API local de saúde, tarefas e lançamentos;
- manifest, ícone e service worker.

## Próximas fatias

1. editar tarefas e documentos;
2. testes automatizados de domínio;
3. ~~API com banco persistente~~ — feito (Postgres via Prisma), falta só instância real configurada;
4. ~~autenticação e autorização~~ — feito (Google via Auth.js), falta só client OAuth real configurado;
5. sincronização com o frontend — consequência do banco compartilhado, falta validar com credenciais reais;
6. IA real com fontes e permissões;
7. importação/exportação segura.

## Critérios de aceite

Build passa, nenhuma tela menciona o produto anterior, mutações destrutivas exigem confirmação, dados demonstrativos são identificáveis e a ausência de backend é informada ao usuário.
