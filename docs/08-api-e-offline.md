# API, repositórios e modo offline

Tarefas, lançamentos e contas recorrentes usam a API local como primeira fonte de leitura e escrita.

## Contratos

- `GET /api/tasks`, `POST /api/tasks`, `PATCH|DELETE /api/tasks/:id`
- `GET /api/transactions`, `POST /api/transactions`, `PATCH|DELETE /api/transactions/:id`
- `GET /api/bills`, `POST /api/bills`, `PATCH|DELETE /api/bills/:id`

As respostas de leitura e mutação usam `{ data }`. Erros usam `{ error }` e status HTTP apropriado.

## Estados

- carregamento: exibido enquanto as coleções são carregadas;
- sucesso: a entidade recebida da API atualiza a interface;
- erro de rede/servidor: a operação é repetida no repositório local;
- offline: uma mensagem informa que os dados foram salvos apenas neste dispositivo;
- retry: recarrega os dados e tenta a API novamente.

O fallback não sincroniza nem sobrescreve dados automaticamente. A API ainda usa memória de processo e não oferece autenticação, isolamento por usuário ou persistência definitiva.
