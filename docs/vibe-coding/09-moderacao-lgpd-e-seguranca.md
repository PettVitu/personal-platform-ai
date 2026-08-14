# 09 — Moderação, LGPD e segurança

## 1. Princípios

- Segurança e convivência são requisitos do produto, não apenas suporte.
- Menor privilégio para usuários, moderadores, agentes e integrações.
- Explicabilidade e proporcionalidade nas ações de moderação.
- Privacidade por padrão para perfis, projetos e mensagens.
- IA auxilia triagem; decisões graves exigem revisão humana.

## 2. Código de conduta

Permitido: dúvidas, discordância técnica respeitosa, crítica de projeto, remix com crédito e experimentação segura.  
Não permitido: assédio, ameaça, discriminação, doxxing, spam, fraude, plágio sem crédito, malware, instrução para dano, sexualização de menores, exposição de segredo ou tentativa de explorar a plataforma.

O código deve aparecer no onboarding comunitário, na criação de comentário, no envio de denúncia e na página de suporte.

## 3. Moderação de conteúdo

### Camadas

1. **Prevenção:** limites de upload, sanitização, anti-spam, aviso de conduta e confirmação de publicação.
2. **Detecção:** denúncias, heurísticas, análise de links e classificação assistida por IA.
3. **Triagem:** fila por severidade, alcance, reincidência e risco.
4. **Revisão humana:** decisão, evidência, ação e possibilidade de recurso.
5. **Aprendizado:** revisão de falsos positivos e atualização de regras.

### Severidade e SLA

| Nível | Exemplo | Ação inicial | SLA alvo |
|---|---|---|---:|
| S0 crítico | ameaça imediata, exploração infantil, exposição grave | restringir visibilidade, preservar evidência e escalar | imediato |
| S1 alto | assédio persistente, doxxing, malware | ocultar preventivamente e revisão humana | 4h |
| S2 médio | spam, insulto, plágio alegado | limitar alcance e avaliar | 24h |
| S3 baixo | off-topic, feedback pouco útil | orientar, editar ou não agir | 72h |

SLA é meta operacional, não promessa legal. Casos que exigem autoridade externa devem ser encaminhados conforme orientação jurídica.

### Ações

Avisar, pedir correção, despublicar, limitar alcance, silenciar, suspender temporariamente, encerrar conta e encaminhar. A ação deve registrar motivo, regra, moderador/sistema, data e possibilidade de recurso.

## 4. Denúncias e escalonamento

O denunciante escolhe categoria, descreve contexto e envia. Recebe protocolo, status e decisão resumida. Não recebe dados pessoais ou punição de outra pessoa.

Escalonar para liderança de confiança e segurança quando houver ameaça, risco de menor, dados pessoais, fraude, vulnerabilidade técnica ou reincidência. Manter canal de segurança separado do suporte comum.

## 5. LGPD

### Finalidades

Conta e autenticação, progresso educacional, publicação escolhida, moderação, suporte, analytics consentido, comunicação consentida e pagamento por provedor. Cada finalidade deve ser explicada e ter retenção definida.

### Dados minimizados

Necessários: identificador, e-mail, progresso, projetos e logs operacionais. Opcionais: nome público, bio, avatar, interesses e preferências. Não pedir dados sensíveis para a experiência básica.

### Direitos

Informação, acesso, correção, portabilidade, oposição quando aplicável, revogação de consentimento e eliminação, respeitando retenções legais. Exportar projetos, comentários próprios, badges, progresso e dados de conta em formato legível.

### Consentimento

Separar termos essenciais, analytics, e-mail marketing, gravação de eventos e perfil público. Registrar versão, finalidade, timestamp, origem e revogação. Recusar marketing não bloqueia aprendizagem.

## 6. Privacidade por recurso

| Recurso | Padrão | Controle |
|---|---|---|
| Perfil | não listado até configurar | público, membros, privado |
| Projeto | privado/rascunho | privado, não listado, público |
| Comentário | visível no projeto publicado | editar, apagar, denunciar |
| Chat futuro | apenas sala autorizada | silenciar, sair, denunciar |
| Analytics | consentimento quando necessário | desligar e excluir quando aplicável |
| IA | dados da sessão e fontes autorizadas | não usar conteúdo privado globalmente |

## 7. Segurança técnica

- TLS, criptografia em repouso e gestão de segredos.
- Hash de senha com algoritmo moderno e MFA opcional/posterior.
- Autorização server-side por usuário, cohort, projeto e papel.
- Rate limiting para login, comentários, denúncias, uploads e IA.
- Sanitização de Markdown/HTML e sandbox para código executável.
- Isolamento de arquivos, URLs assinadas e verificação de tipo/tamanho.
- Tokens de provedores fora do frontend, rotação e revogação.
- Logs de auditoria sem texto privado desnecessário.
- Backups criptografados e restauração testada.
- Dependências e imagens de container verificadas no CI.

## 8. IA e conteúdo não confiável

Conteúdo de usuários, comentários e código são dados não confiáveis. Não podem instruir o agente a ignorar políticas, revelar contexto privado ou executar ferramentas perigosas. Ferramentas devem usar allowlist, schemas, timeouts e confirmação humana para ações externas.

## 9. Resposta a incidentes

Detectar → conter → preservar evidência → classificar impacto → corrigir → comunicar conforme obrigação aplicável → revisar. Definir responsável, canal de plantão, modelo de comunicação e teste anual. Incidentes de exposição de dados devem gerar revisão de tokens, sessões, logs e permissões.

## 10. Critérios de aceite

- Código de conduta visível e vinculante.
- Denúncia tem categorias, protocolo, SLA e escalonamento.
- Moderação mantém trilha de auditoria e recurso.
- Perfil/projeto são privados por padrão até escolha clara.
- Exportação, correção, revogação e exclusão têm fluxos testados.
- Upload e execução de código são isolados.
- IA não acessa conteúdo fora da autorização.
- Plano de incidente e contatos estão documentados.

## Checkpoint de moderação e segurança

**Entrega:** conduta, camadas de moderação, denúncias, SLA, LGPD, privacidade, segurança técnica e incidentes.  
**Pendências:** validação jurídica local, testes de threat model e definição de equipe de plantão.  
**Status:** **ACEITO COM RESSALVAS.**  
**Comentário:** o produto não deve lançar feed público sem operação mínima de moderação. A validação jurídica é obrigatória antes de cobrança e comunicação de marketing.
