# 06 — Segurança, privacidade e LGPD

## Finalidade e base legal

Tratar somente dados necessários para fornecer organização financeira, cálculos, alertas e recursos explicitamente escolhidos. O consentimento deve ser livre, informado, específico e revogável para integrações opcionais. A base legal final deve ser validada juridicamente para cada tratamento; execução técnica não substitui orientação especializada.

## Matriz de permissões

| Permissão | Necessária | Finalidade | Revogação |
|---|---:|---|---:|
| Dados digitados/importados | Sim para uso | Organizar e calcular | Apagar/exportar |
| Ler calendário | Não | Mostrar eventos e sugerir lembretes | Sim, invalida token |
| Ler e-mail | Não e posterior | Identificar cobranças autorizadas | Sim, remove acesso |
| Enviar e-mail | Não no MVP | Comunicação externa | Não conceder |
| Alterar calendário | Não no MVP | Ação externa | Não conceder |
| Conta bancária | Fora do MVP | Importação automática | Não conceder |

## Controles técnicos

- Criptografia em trânsito e repouso.
- Tokens externos criptografados, com rotação e nunca expostos ao frontend.
- Isolamento por usuário e autorização server-side em toda consulta.
- MFA/reautenticação para ações sensíveis, rate limiting e proteção contra abuso.
- Logs de auditoria sem conteúdo financeiro desnecessário.
- Backups criptografados, restauração testada e retenção definida.
- Dependências, segredos e pipelines revisados.
- Monitoramento de acessos anômalos e falhas de autenticação.

## Direitos do usuário

Informar finalidade, acesso, correção, portabilidade, revogação, oposição quando aplicável e exclusão. Exportar dados em formato legível. Excluir conta com confirmação reforçada, registro do processamento e indicação de retenções legais/técnicas, se houver.

## E-mail e agenda

Solicitar apenas scopes mínimos. Mostrar provedor, escopo, dados lidos, finalidade e impacto. Não enviar, responder, apagar ou alterar eventos no MVP. Ao revogar, invalidar token, parar jobs e informar destino de dados já derivados.

## Incidente

Detectar → conter → preservar evidências → avaliar impacto → corrigir → comunicar conforme obrigação aplicável → revisar controles. Definir responsáveis, contatos, janela de resposta e testes antes do lançamento.

## Aceite de segurança

Não liberar integração sem threat model, revisão de permissões, teste de revogação, logs auditáveis, política de retenção, teste de isolamento e plano de incidente.
