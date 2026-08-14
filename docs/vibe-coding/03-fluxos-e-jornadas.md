# 03 — Fluxos e jornadas do usuário

**Escopo:** onboarding, consumo de conteúdo, participação comunitária, projetos e monetização.  
**Dependência:** [01 — Escopo](./01-escopo.md) e [02 — MVP](./02-mvp.md).

## 1. Princípios de fluxo

- O usuário deve chegar ao primeiro exercício em menos de cinco minutos.
- O sistema sempre mostra o próximo passo recomendado.
- Nenhuma ação comunitária é irreversível sem confirmação.
- Comentários podem ser editados ou apagados pelo autor, respeitando a auditoria de moderação.
- Monetização nunca deve interromper uma lesson em andamento.
- A comunidade é assíncrona no MVP. Chat em tempo real não é requisito.
- O usuário pode abandonar uma trilha e retornar sem perder progresso.

## 2. Fluxo principal

| Etapa | Objetivo e ação do usuário | Dados coletados | Decisão do sistema | Erros e saída | Métrica |
|---|---|---|---|---|---|
| **1. Descoberta** | Acessar landing page e entender a proposta | Origem, campanha, dispositivo e consentimento de analytics | Exibe exemplos reais de projetos e trilhas | Conteúdo não carrega: mostrar versão leve e tentar novamente | Conversão da landing page |
| **2. Cadastro** | Criar conta com e-mail e senha ou provedor compatível | E-mail, senha, idade mínima/termos | Cria perfil vazio e envia confirmação | E-mail duplicado, senha inválida, cancelamento sem perfil público | Cadastro concluído |
| **3. Consentimento** | Escolher termos, analytics e comunicação | Versão, finalidade, timestamp e preferências | Permite uso essencial sem marketing | Recusa não bloqueia conteúdo; revogação em configurações | Consentimento compreendido |
| **4. Onboarding** | Informar nível, interesse, objetivo e tempo disponível | Nível autodeclarado, temas, meta, disponibilidade | Recomenda uma trilha inicial | Pode pular e retomar; respostas editáveis | Conclusão em até 3 telas |
| **5. Primeiro contato** | Abrir catálogo, trilha ou lesson recomendada | Lesson visualizada e origem do clique | Prioriza uma prática curta, não uma lista infinita | Sem interesse: explorar temas e alterar perfil | Primeira lesson iniciada |
| **6. Consumo** | Ler/ver, executar passos e responder quiz | Progresso, respostas, tempo e tentativas | Libera próximo checkpoint; salva automaticamente | Falha de sandbox: oferecer execução local e starter | Lesson concluída |
| **7. Aplicação** | Escolher projeto guiado relacionado à lesson | Projeto, nível e preferência de stack | Mostra brief e primeiro checkpoint | Projeto avançado demais: trocar nível sem perder histórico | Projeto iniciado |
| **8. Comunidade** | Ver feed e interagir com projeto | Visualização, reação, comentário e denúncia | Ordena por relevância e descoberta de criadores | Comentário removido ou denúncia encaminhada | Feedback útil publicado |
| **9. Publicação** | Submeter projeto e escolher visibilidade | Título, descrição, stack, mídia, link, licença e visibilidade | Valida campos, aplica filtros e publica após confirmação | Link inválido, conteúdo sinalizado ou rascunho salvo | Projeto publicado |
| **10. Retorno** | Responder feedback, revisar projeto e iniciar próxima lesson | Respostas, versão, progresso e preferências | Sugere próxima ação com base no objetivo | Usuário silencia notificações ou pausa a trilha | Retenção D7 |
| **11. Oferta** | Conhecer cohort, trilha premium ou mentoria | Oferta vista e origem, sem dados sensíveis | Mostra oferta somente após sinal de valor | Pode fechar sem perda de acesso gratuito | Conversão qualificada |
| **12. Compra** | Confirmar oferta, preço e política | Pedido, pagamento via provedor e recibo | Libera acesso após confirmação do provedor | Pagamento recusado não altera progresso | Compra concluída |

## 3. Fluxo de onboarding

### Tela 1 — intenção

**Título:** “O que você quer criar?”  
**Opções:** visual, música/áudio, jogo/interação, ferramenta útil, ainda não sei.  
**Microcopy:** “Sua escolha só ajuda a encontrar um bom primeiro projeto.”

### Tela 2 — nível e ritmo

**Perguntas:** nível percebido, tecnologias conhecidas, tempo por semana.  
**Microcopy:** “Não existe resposta certa. Você pode ajustar isso depois.”

### Tela 3 — primeiro passo

Mostrar uma trilha recomendada, duração da primeira lesson e resultado esperado.  
**CTA:** “Começar uma prática de 8 minutos.”  
**Secundário:** “Explorar outras trilhas.”

O usuário pode pular cada pergunta. O progresso do onboarding é salvo em rascunho. Não pedir cartão, telefone ou integração externa.

## 4. Fluxo de consumo de conteúdo

1. Usuário abre uma micro-lesson.
2. Sistema mostra objetivo, pré-requisitos, duração e resultado visual esperado.
3. Usuário executa passos curtos.
4. Cada checkpoint permite testar o resultado.
5. Usuário responde quiz de até cinco perguntas.
6. Sistema mostra explicação, não apenas acerto/erro.
7. Usuário salva progresso e recebe sugestão de projeto relacionado.

### Estados

- **Não iniciado:** objetivo e botão de começo.
- **Em andamento:** checkpoint atual e progresso salvo.
- **Bloqueado:** explicar pré-requisito e oferecer revisão.
- **Concluído:** resultado, quiz e próximo passo.
- **Offline:** manter conteúdo já carregado e sincronizar depois quando seguro.
- **Erro do exercício:** oferecer reset, solução parcial e execução local.

## 5. Fluxo de participação comunitária

1. Feed exibe projeto, contexto, stack, nível e versão.
2. Usuário reage ou usa um modelo de feedback.
3. Comentário exige conteúdo mínimo útil: “o que funcionou”, “pergunta” ou “sugestão”.
4. Autor recebe notificação agrupada.
5. Qualquer pessoa pode denunciar conteúdo ou usuário.
6. Moderador classifica, age e registra a decisão.

Não usar contagem de curtidas como único sinal de qualidade. Projetos novos devem ter possibilidade real de descoberta.

## 6. Fluxo de projeto

### Criar

Usuário escolhe projeto, visualiza dificuldade e clona starter ou abre brief. O sistema cria rascunho com checkpoints.

### Pedir ajuda

Usuário seleciona checkpoint, descreve o que tentou e anexa erro opcional. A plataforma sugere conteúdo relacionado antes de publicar a pergunta.

### Submeter

Usuário preenche título, descrição, stack, link/demo, imagem ou áudio, licença e visibilidade. O sistema valida URL, tamanho, tipo de arquivo e conteúdo básico.

### Publicar e iterar

Projeto publicado pode receber feedback, nova versão e marcação de conclusão. A versão anterior permanece referenciável, mas o usuário controla a visibilidade.

## 7. Fluxo de monetização

O MVP deve testar no máximo uma oferta principal, preferencialmente um cohort curto ou trilha premium com feedback.

1. Usuário conclui uma prática ou publica projeto.
2. Oferta contextual aparece em área própria, nunca no meio do exercício.
3. Página mostra benefício, duração, preço, o que não está incluído, política de cancelamento e responsável.
4. Usuário confirma checkout externo.
5. Provedor retorna sucesso, pendência ou falha.
6. Acesso é liberado apenas após confirmação válida.
7. Recibo e suporte ficam disponíveis.

Não vender certificado como promessa de emprego. Não bloquear conteúdo gratuito essencial para pressionar compra.

## 8. Fluxos alternativos

### Usuário sem experiência

Oferecer trilha visual, glossário curto, setup guiado e primeiro resultado rápido. Evitar jargão e não apresentar projeto intermediário como primeiro passo.

### Usuário intermediário

Permitir diagnóstico opcional, pular fundamentos conhecidos e escolher projeto. Ainda exigir checkpoints para evitar copiar solução sem compreensão.

### Usuário que não quer perfil público

Permitir consumo privado e projeto não listado. Comentários e publicação pública são opcionais.

### Usuário que recebe comentário abusivo

Ocultar comentário localmente, bloquear usuário, denunciar e receber confirmação do encaminhamento. Não exigir confronto público.

### Projeto com conteúdo inadequado

Suspender visibilidade pública quando necessário, preservar evidências mínimas, informar o autor e encaminhar para moderação. Casos graves seguem escalonamento legal e de segurança.

### Pagamento recusado

Manter todo progresso gratuito, não criar cobrança duplicada e oferecer suporte ou nova tentativa pelo provedor.

### Usuário abandona a trilha

Salvar o último checkpoint e enviar no máximo uma lembrança configurável. Depois de duas ignoradas, reduzir frequência automaticamente.

## 9. Critérios de aceite do fluxo

- Usuário chega à primeira prática sem pagar.
- Onboarding pode ser concluído em três telas e pulado.
- Progresso é salvo e retomável.
- Toda lesson tem prática e quiz.
- Projeto pode ser rascunho, privado, não listado ou público.
- Feedback possui denúncia e moderação.
- Monetização não bloqueia conteúdo gratuito nem altera progresso em caso de falha.
- O usuário pode exportar seus projetos e excluir a conta.

## Checkpoint 2 — aprovação simulada

**Entrega:** fluxo completo de onboarding, conteúdo, comunidade, projetos e monetização, incluindo alternativas e estados.  
**Pendências:** arquitetura de conteúdo, wireframes detalhados, onboarding A/B, user stories, prompts, roadmap, KPIs, segurança e stack.  
**Status:** **ACEITO.**  
**Comentário:** o fluxo está coerente com um MVP de três meses porque mantém comunidade assíncrona e monetização simples. Chat em tempo real permanece fora do caminho crítico.
