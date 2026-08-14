# 04 — Backlog executável do MVP

## Fatias

| ID | Entrega | Critério de aceite principal | Prioridade |
|---|---|---|---|
| F1 | Autenticação e perfil | Usuário cria conta, confirma e recupera acesso | P0 |
| F2 | Consentimento | Finalidades opcionais são separadas, registradas e revogáveis | P0 |
| F3 | Contas e categorias | Usuário cria, edita e arquiva sem apagar histórico | P0 |
| F4 | Receita/despesa | Transação é validada, editável e aparece no período correto | P0 |
| F5 | CSV | Prévia, erros por linha, confirmação e zero persistência parcial | P0 |
| F6 | Dashboard | Totais batem com transações confirmadas e indicam período | P0 |
| F7 | Orçamento | Limite, realizado e percentual são calculados corretamente | P0 |
| F8 | Metas | Meta mostra progresso e permite editar/pausar | P0 |
| F9 | Simulador | Aportes, juros e total conferem com cálculo de referência | P0 |
| F10 | Vencimentos | Lembrete manual pode ser criado, editado e desligado | P1 |
| F11 | Alertas | Respeita horário, limite diário, origem e preferência | P1 |
| F12 | Exportação/exclusão | Usuário exporta e solicita exclusão com confirmação | P0 |
| F13 | IA factual | Resumo cita período/fontes e não altera dados | P1 |
| F14 | Agenda conectada | Somente leitura, OAuth, token expirado e revogação | P2 |
| F15 | E-mail conectado | Somente após revisão de segurança e piloto | P2 |

## Ordem de implementação

F1 → F2 → F3 → F4 → F5 → F6 → F7 → F8 → F9 → F12 → F10 → F11 → F13 → F14 → F15.

## User stories e aceite

1. **Como usuário, quero criar uma conta para acessar meus dados.** Aceite: confirmação, recuperação e erro claro.
2. **Como usuário, quero revogar consentimento para controlar acessos.** Aceite: token invalidado e novas leituras interrompidas.
3. **Como usuário, quero importar planilha para evitar digitação.** Aceite: prévia, mapeamento, erros e confirmação sem registros parciais.
4. **Como usuário, quero cadastrar despesa para acompanhar meu consumo.** Aceite: valor, data, conta e categoria obrigatórios; edição disponível.
5. **Como usuário, quero cadastrar receita para ver meu fluxo.** Aceite: tipo, valor e data; receita prevista pode ficar pendente.
6. **Como usuário, quero criar orçamento para comparar limite e realizado.** Aceite: percentual e período corretos.
7. **Como usuário, quero criar meta para acompanhar um objetivo.** Aceite: alvo, prazo e progresso editáveis.
8. **Como usuário, quero simular investimento para comparar cenários.** Aceite: premissas visíveis e aviso de não garantia.
9. **Como usuário, quero consultar gastos por período/categoria.** Aceite: filtros reproduzíveis e totais consistentes.
10. **Como usuário, quero fazer revisão semanal.** Aceite: lista de pendências, adiamento e conclusão.
11. **Como usuário, quero conectar agenda para ver compromissos.** Aceite: leitura autorizada, sem alteração externa.
12. **Como usuário, quero analisar e-mail autorizado.** Aceite: candidatos com campos incertos e confirmação humana.
13. **Como usuário, quero configurar alerta.** Aceite: frequência, canal, horário e desligamento.
14. **Como usuário, quero exportar dados.** Aceite: arquivo legível, escopo escolhido e status da solicitação.
15. **Como usuário, quero excluir minha conta.** Aceite: confirmação reforçada, prazo/efeito explícitos e remoção verificável.
16. **Como usuário, quero perguntar à IA sobre meus dados.** Aceite: resposta com período/origem, sem invenção e sem ação automática.

## Definição de pronto

Mobile responsivo, loading/vazio/erro/sucesso, testes do caminho principal, logs sem dados sensíveis, permissão revisada, critérios demonstrados e documentação atualizada.
