# API, repositórios e modo offline

Tarefas, lançamentos e contas recorrentes usam a API como primeira fonte de leitura e escrita. A API é protegida por sessão (Auth.js/Google) e cada registro pertence ao usuário autenticado — ver [06](06-seguranca-e-lgpd.md).

## Contratos

- `GET /api/tasks`, `POST /api/tasks`, `PATCH|DELETE /api/tasks/:id`
- `GET /api/transactions`, `POST /api/transactions`, `PATCH|DELETE /api/transactions/:id`
- `GET /api/bills`, `POST /api/bills`, `PATCH|DELETE /api/bills/:id`

Todas exigem sessão válida — sem ela, respondem `401`. As respostas de leitura e mutação usam `{ data }`. Erros usam `{ error }` e status HTTP apropriado.

## Estados

- carregamento: exibido enquanto as coleções são carregadas;
- sucesso: a entidade recebida da API atualiza a interface;
- erro de rede/servidor: a operação é repetida no repositório local (`localStorage`), como fallback só de indisponibilidade — não substitui login;
- offline: uma mensagem informa que os dados foram salvos apenas neste dispositivo;
- retry: recarrega os dados e tenta a API novamente;
- sem sessão: o middleware redireciona páginas para a tela de login do Google e devolve `401` em chamadas de API.

O fallback local não sincroniza nem sobrescreve dados automaticamente — ele existe para quando a API está fora do ar com o usuário já logado, não para contornar autenticação. Persistência real (Postgres via Prisma) e isolamento por usuário já estão implementados; falta plugar uma instância real de banco e um client OAuth do Google (ver `.env.example`).
