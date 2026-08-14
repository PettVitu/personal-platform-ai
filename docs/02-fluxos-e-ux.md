# 02 — Fluxos, jornadas e UX

## Jornada principal

Cadastro → consentimento → onboarding → configuração financeira → importação/cadastro → dashboard → meta → simulação → alertas → agenda opcional → e-mail opcional → resumo → revisão semanal → evolução do plano.

## Fluxo por etapa

| Etapa | Ação/dados | Sistema | Erro/cancelamento | Sucesso |
|---|---|---|---|---|
| Cadastro | E-mail, senha e termos | Cria conta vazia | Confirmação, recuperação e saída sem dados | Conta confirmada |
| Consentimento | Aceites separados e versão | Ativa só o necessário | Recusa não bloqueia núcleo; revogação posterior | Permissões compreendidas |
| Onboarding | Objetivo, renda, moeda e preferências | Sugere configuração, sem presumir renda | Salva rascunho, permite pular | Até 5 minutos |
| Configuração | Contas, cartões e categorias | Cria estrutura mínima | Duplicata/valor inválido editável | Conta e categoria criadas |
| Importação/cadastro | Transação ou CSV | Valida e sugere categoria antes de salvar | Arquivo inválido não persiste | 5 transações ou CSV confirmado |
| Dashboard | Período e dados confirmados | Calcula totais, categorias e recorrências | Estado vazio e retry | Usuário escolhe próxima ação |
| Meta | Valor, prazo e aporte | Calcula progresso, sem recomendar ativo | Editar, pausar ou excluir confirmado | Meta criada |
| Simulação | Aporte, prazo e taxa | Calcula cenários e premissas | Valida campos; permite refazer | Resultado compreendido |
| Alertas | Regra, canal, horário | Agenda internamente respeitando limites | Editar, desligar ou silenciar | Alerta configurado |
| Integrações | Consentimento e OAuth opcional | Lê somente escopo permitido | Cancelar, token expirado ou revogar | Sincronização autorizada |
| Resumo/revisão | Período e feedback | Resume fatos e pendências | Sem dados: explica o que falta | Revisão concluída |

## Jornadas alternativas

- **Sem dados:** mostrar “Você ainda não cadastrou nenhuma despesa” e oferecer adicionar, importar ou criar meta.
- **Renda variável:** separar prevista, recebida e atrasada; nunca assumir salário fixo; explicitar incerteza do saldo projetado.
- **Sem e-mail/agenda:** continuar com cadastro manual e não insistir na permissão.
- **Planilha inválida:** pré-validar, apontar linha/coluna, permitir corrigir e confirmar somente linhas revisadas.
- **Onboarding interrompido:** salvar rascunho; oferecer continuar ou recomeçar sem apagar dados.
- **Integração removida:** invalidar token, interromper leituras e separar revogação de apagar dados derivados.

## Wireframes e conteúdo

### Acesso e consentimento

Login/cadastro: logo, proposta curta, e-mail, senha, entrar, criar conta e recuperação. Consentimento: finalidades, permissões separadas, termos e “Continuar sem conectar”. Onboarding: progresso, objetivo, contexto, primeiro passo, preferências e integrações.

### Finanças

Dashboard: período, ocultar valores, receitas, despesas, saldo, orçamento, metas, vencimentos e CTA de transação. Transações: busca, filtros, lista por data, totais, importar e editar. Formulários de receita/despesa: valor, data, descrição, conta, categoria, recorrência e revisão. Orçamento: limite, realizado, disponível e histórico. Importação: arquivo, mapeamento, prévia, erros e confirmação.

### Planejamento

Metas: cards com progresso, valor, prazo e aporte. Investimentos: ativos manuais, classes, aportes e data de atualização. Simulador: aporte inicial/mensal, prazo, taxa, cenários, valor aportado e juros estimados.

### Rotina e integrações

Agenda: lista/calendário, eventos, vencimentos e conexão. Alertas: ativos, histórico, origem, regra, canal e frequência. E-mail/calendário: escopo, consentimento, itens candidatos, confirmação e revogação.

### IA e administração

Assistente: pergunta, resposta, fontes, período, fatos/hipóteses e feedback. Relatórios: período, tabelas, gráficos alternativos e exportação. Configurações: perfil, categorias, alertas, integrações, privacidade e conta.

## Regras de UX

- Mobile-first; navegação inferior com Início, Transações, Metas, Agenda e Mais.
- Desktop com navegação lateral e conteúdo máximo de 1.200 px.
- Foco visível, teclado, labels persistentes, contraste adequado e toque mínimo de 44 px.
- Gráficos sempre têm tabela ou resumo textual; cor nunca é o único sinal.
- Carregamento preserva contexto; erro mostra impacto e próxima ação.
- Linguagem clara, calma, não alarmista e não paternalista.
- Valores podem ser ocultados globalmente.
