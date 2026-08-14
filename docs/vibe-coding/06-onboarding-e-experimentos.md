# 06 — Onboarding e experimentos

**Objetivo:** levar uma pessoa nova do cadastro à primeira prática sem pedir informações desnecessárias.

## 1. Regras do onboarding

- Máximo de três telas principais; o restante pode ocorrer depois.
- Tempo-alvo: até três minutos até iniciar a primeira lesson.
- Toda pergunta tem opção de pular.
- Não pedir cartão, telefone, documento ou integração externa.
- Explicar por que cada resposta é usada.
- O usuário pode alterar nível, interesses e objetivo no perfil.
- O primeiro resultado deve ser alcançável em até 8–12 minutos.

## 2. Fluxo base

### Tela 0 — boas-vindas

**Título:** “Aprenda programando coisas que você quer mostrar.”  
**Descrição:** “Micro-lessons, projetos visuais e uma comunidade para experimentar sem medo de errar.”  
**Ações:** Criar conta; entrar; explorar exemplos sem cadastro.  
**Métrica:** início do cadastro e clique em exemplo.

### Tela 1 — intenção

**Título:** “O que você quer criar primeiro?”  
**Opções:** visual, música/áudio, jogo/interação, ferramenta útil, ainda não sei.  
**Microcopy:** “Isso só organiza suas sugestões. Você pode mudar depois.”  
**Dados:** interesse principal e, opcionalmente, interesse secundário.

### Tela 2 — nível e ritmo

**Título:** “Qual ponto de partida parece mais honesto?”  
**Opções:** começando agora, já fiz alguns projetos, programo com frequência.  
**Pergunta opcional:** tempo disponível por semana.  
**Microcopy:** “Não é um teste. Queremos evitar recomendar algo fácil demais ou frustrante demais.”

### Tela 3 — primeiro passo

**Título:** “Seu primeiro experimento está pronto.”  
**Conteúdo:** nome da lesson, duração, resultado visual, nível e pré-requisito.  
**CTA:** Começar prática de 8 minutos.  
**Secundário:** Ver outras trilhas; fazer isso depois.  
**Métrica:** início da lesson.

## 3. Checkpoints

| Checkpoint | Evento | Critério |
|---|---|---|
| C0 | Cadastro concluído | Conta criada sem erro |
| C1 | Intenção escolhida | Opção salva ou pulada |
| C2 | Nível escolhido | Nível salvo ou pulado |
| C3 | Primeiro conteúdo aberto | Lesson carregada |
| C4 | Primeira prática concluída | Resultado testado e progresso salvo |
| C5 | Projeto iniciado | Brief aberto ou starter clonado |

O produto deve medir abandono entre checkpoints, não somente conclusão final.

## 4. Variação A — foco em projeto

### Hipótese

Mostrar um resultado concreto antes de explicar a estrutura aumenta o início e a conclusão da primeira prática.

### Ordem

1. Escolha de interesse.
2. Galeria de três projetos possíveis.
3. Nível e tempo.
4. Lesson que desbloqueia o projeto escolhido.

### Microcopy

- “Escolha algo que você teria vontade de mostrar.”
- “Você não precisa saber tudo para começar este projeto.”
- “Em 8 minutos, você verá a primeira interação funcionando.”
- “O projeto completo vem depois. Agora, faça o primeiro movimento.”

### Métricas e metas iniciais

- Conclusão do onboarding: ≥75%.
- Primeira lesson iniciada: ≥65%.
- Primeira prática concluída em 24 horas: ≥45%.
- Projeto iniciado em 7 dias: ≥40%.
- Publicação em 14 dias: ≥22%.

### Riscos

O usuário pode escolher pelo visual sem compreender o nível. Mitigar mostrando duração, pré-requisitos e um exemplo de código pequeno. Projetos muito atraentes podem gerar frustração; oferecer versão mínima e checkpoint inicial.

## 5. Variação B — foco em comunidade

### Hipótese

Mostrar pessoas, feedback e pertencimento antes da lesson aumenta o retorno e a disposição para publicar.

### Ordem

1. Escolha de interesse.
2. Apresentação de três projetos da comunidade.
3. Escolha de nível e objetivo social: publicar, pedir feedback ou observar.
4. Lesson curta e convite para comentar um projeto.

### Microcopy

- “Aqui, projetos em andamento também têm lugar.”
- “Você pode publicar quando quiser. Comece observando.”
- “Feedback bom descreve o que viu e faz uma pergunta útil.”
- “Encontre uma pessoa fazendo algo parecido com você.”

### Métricas e metas iniciais

- Conclusão do onboarding: ≥70%.
- Feed visitado em 24 horas: ≥60%.
- Primeira lesson iniciada: ≥60%.
- Primeiro comentário ou reação útil em 7 dias: ≥30%.
- Retorno D7: ≥35%.
- Projeto publicado em 14 dias: ≥18%.

### Riscos

O usuário pode consumir o feed sem praticar. Mitigar colocando a lesson como ação principal e medindo prática concluída, não apenas tempo no feed. Não usar pressão social ou contadores de popularidade no onboarding.

## 6. Desenho do experimento A/B

- Dividir usuários elegíveis aleatoriamente e manter a versão fixa durante a experiência.
- Não misturar variações dentro da mesma sessão.
- Registrar versão, origem, dispositivo, nível autodeclarado e interesse.
- Comparar por coortes de entrada, não somente acumulado.
- Definir métrica primária antes do lançamento: prática concluída em 24 horas.
- Métricas secundárias: projeto iniciado, publicação, feedback recebido, D7 e denúncias.
- Não declarar vencedor por diferença pequena ou por conclusão do onboarding isolada.
- Interromper uma variação se houver aumento relevante de frustração, denúncias ou erro técnico.

## 7. Eventos de analytics

```text
onboarding_started
onboarding_intent_selected
onboarding_level_selected
onboarding_skipped
onboarding_completed
recommended_lesson_opened
lesson_started
lesson_checkpoint_completed
lesson_quiz_submitted
lesson_completed
project_started
project_published
community_feedback_created
community_report_submitted
```

Não enviar código privado, texto de mensagens ou dados pessoais desnecessários para analytics. IDs devem ser pseudonimizados.

## 8. Critérios de aceite

- O onboarding pode ser concluído em três telas.
- Toda pergunta pode ser pulada.
- Uma lesson recomendada abre sem depender de integração externa.
- A e B têm ordem, microcopy, hipótese e métrica diferentes.
- O usuário pode editar suas respostas depois.
- Eventos de funil permitem localizar abandono.
- A decisão do experimento usa prática concluída e retenção, não vaidade.

## Checkpoint de onboarding — aprovação simulada

**Entrega:** roteiro, scripts, checkpoints, duas variações A/B, métricas e plano de experimento.  
**Pendências:** user stories, prompts, roadmap, KPIs gerais, moderação, LGPD, stack e recursos.  
**Status:** **ACEITO.**  
**Comentário:** as duas variações testam hipóteses distintas. A prática concluída deve ser a métrica primária para evitar otimizar apenas cadastro ou consumo de feed.
