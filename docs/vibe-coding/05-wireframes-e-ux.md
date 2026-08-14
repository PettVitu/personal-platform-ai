# 05 — Wireframes e guidelines de UI/UX

**Objetivo:** definir a estrutura e a linguagem visual das telas sem prender a implementação a um layout rígido.

## 1. Direção visual

### Personalidade

Criativa, experimental, acolhedora e técnica. A interface pode ter energia visual, mas nunca deve parecer caótica. O conteúdo e a ação principal precisam vencer o ornamento.

### Paleta inicial

| Uso | Cor | Contraste/observação |
|---|---|---|
| Fundo principal | `#0F1117` | Tema escuro padrão opcional |
| Superfície | `#181C25` | Cards e painéis |
| Fundo claro | `#F7F7F2` | Alternativa clara |
| Texto principal escuro | `#F4F6FB` | Contraste alto |
| Texto principal claro | `#191B22` | Contraste alto |
| Primária | `#8B5CF6` | Ação, links e foco |
| Secundária | `#22D3EE` | Destaques e visualização |
| Sucesso | `#34D399` | Conclusão, nunca único sinal |
| Atenção | `#FBBF24` | Avisos não críticos |
| Erro | `#FB7185` | Erros e denúncias |

Não usar gradientes ou neon em textos longos. Validar contraste AA. Estados devem combinar cor, ícone, texto e posição.

### Tipografia

- Interface: **Inter** ou fonte sans-serif equivalente.
- Código: **JetBrains Mono** ou equivalente monoespaçada.
- Títulos: peso 600–700; corpo 16 px mínimo no mobile.
- Altura de linha entre 1,4 e 1,6 para texto educativo.
- Evitar texto todo em caixa alta.

### Espaçamento e componentes

Usar escala de 4/8 px. Raio de 12 px para cards e 8 px para controles. Área mínima de toque de 44 × 44 px. Componentes: Button, Input, Select, Tabs, Card, Badge, Progress, CodeBlock, Quiz, ProjectCard, Comment, Toast, Dialog e EmptyState.

## 2. Navegação

### Mobile

Barra inferior: **Início**, **Aprender**, **Feed**, **Projetos**, **Perfil**. Ações secundárias ficam em menu “Mais”. Não usar menu hambúrguer para o caminho principal.

### Desktop

Navegação lateral recolhível. Conteúdo central com largura máxima de 1.200 px. Feed e conteúdo podem usar duas colunas; a coluna de ação não deve desaparecer em zoom.

## 3. Wireframes textuais

### 3.1 Home

**Objetivo:** orientar o próximo passo.  
**Hierarquia:** saudação contextual → progresso da trilha → “continuar aprendendo” → projeto atual → descoberta curta → evento.  
**Ações:** continuar lesson, ver projeto, explorar trilhas, ajustar objetivo.  
**Vazio:** “Você ainda não escolheu uma trilha. Encontre uma ideia e comece pequeno.”  
**Carregamento:** skeleton dos cards sem mover o layout.  
**Erro:** “Não conseguimos carregar seu progresso. Tentar novamente.”  
**Microcopy:** “Seu próximo passo leva cerca de 8 minutos.”  
**Acessibilidade:** headings hierárquicos, leitura linear e progresso em texto além da barra.

### 3.2 Feed

**Objetivo:** descobrir projetos e participar com feedback.  
**Elementos:** filtros por tema, nível e tempo; ProjectCard com preview, título, autor, stack, versão, reação e comentário; opção de denunciar.  
**Ações:** abrir, reagir, comentar, seguir, salvar e denunciar.  
**Vazio:** “Ainda não há projetos nesse filtro. Tente outro tema ou publique o primeiro.”  
**Erro:** preservar filtros e permitir retry.  
**Microcopy:** “Feedback útil começa com algo que você observou.”  
**Acessibilidade:** alt text obrigatório para mídia; player com controles de teclado; não auto-reproduzir áudio.

### 3.3 Catálogo/trilha

**Objetivo:** escolher uma sequência adequada.  
**Elementos:** trilhas por resultado, nível, duração, progresso, pré-requisitos e projetos associados.  
**Ações:** iniciar, salvar, comparar e alterar nível.  
**Vazio:** “Não encontramos uma trilha com esses filtros.”  
**Acessibilidade:** filtros com labels, chips removíveis e resultado anunciado ao leitor de tela.

### 3.4 Lesson

**Objetivo:** aprender e praticar uma ideia.  
**Layout:** título, duração, nível, objetivo; conteúdo em passos; CodeBlock; botão executar/copiar; checkpoint; exercício; quiz; próximo passo.  
**Ações:** testar, resetar, pedir ajuda, marcar checkpoint, concluir.  
**Estados:** não iniciada, em andamento, erro de execução, concluída.  
**Microcopy:** “Tente antes de ver uma dica.” e “O erro faz parte do processo. Veja o que mudou.”  
**Acessibilidade:** código com nome de linguagem, contraste, copiar sem perder foco, quiz navegável por teclado.

### 3.5 Projeto

**Objetivo:** construir, acompanhar checkpoints e publicar.  
**Elementos:** brief, resultado esperado, starter, checklist, progresso, rubrica, botão pedir ajuda, preview e versões.  
**Ações:** iniciar, salvar rascunho, submeter checkpoint, publicar, alterar visibilidade e remixar.  
**Vazio:** “Seu projeto começa com uma pergunta. Escolha um brief para abrir o primeiro checkpoint.”  
**Erro:** link, arquivo, build ou mídia inválida com instrução específica.  
**Microcopy:** “Publique uma versão inacabada se quiser receber feedback cedo.”  
**Acessibilidade:** preview com descrição alternativa, rubrica em tabela e foco preservado após salvar.

### 3.6 Perfil

**Objetivo:** mostrar aprendizagem e controlar identidade/privacidade.  
**Elementos:** nome, bio curta, interesses, badges, trilhas, projetos públicos e preferências de visibilidade.  
**Ações:** editar, ocultar badges, alterar projeto público/privado, exportar e excluir.  
**Vazio:** “Seu perfil pode começar com uma pequena experiência.”  
**Acessibilidade:** não exigir avatar; badges têm texto e descrição; privacidade com rótulos explícitos.

### 3.7 Chat — recurso posterior e controlado

**Objetivo:** conversa contextual em cohort ou evento, não canal irrestrito do MVP.  
**Elementos:** contexto da sala, participantes, mensagem, anexar, denunciar, silenciar e regras visíveis.  
**Estados:** indisponível no MVP, sala aberta, moderada, encerrada e usuário silenciado.  
**Microcopy:** “Esta conversa tem moderação. Compartilhe contexto, não dados pessoais.”  
**Acessibilidade:** mensagens anunciadas sem roubar foco, navegação por teclado, indicador de novas mensagens controlável.

### 3.8 Criação/publicação

**Objetivo:** publicar lesson, projeto, evento ou comentário conforme a permissão.  
**Elementos:** tipo, título, descrição, mídia/código, tags, nível, licença, visibilidade, prévia e salvar rascunho.  
**Ações:** salvar, pré-visualizar, enviar para revisão ou publicar.  
**Erros:** campo obrigatório, licença ausente, URL inválida, arquivo excedente e conteúdo sinalizado.  
**Microcopy:** “Revise o que ficará público antes de publicar.”  
**Acessibilidade:** validação junto ao campo, upload com teclado, prévia textual e confirmação de visibilidade.

### 3.9 Notificações e configurações

**Objetivo:** controlar lembretes, e-mails, privacidade e integrações.  
**Elementos:** preferências por tipo, horário silencioso, frequência, consentimentos, bloqueios e exportação.  
**Microcopy:** “Notificações devem ajudar, não ocupar seu dia.”  
**Acessibilidade:** toggles com estado “ativado/desativado” anunciado e ações destrutivas separadas.

## 4. Microcopy e tom de voz

### Tom

Claro, curioso, direto e encorajador. Nunca infantilizar, culpar ou usar urgência artificial. Explicar termos técnicos na primeira aparição.

### Exemplos

- “Comece por uma prática pequena.”
- “Você concluiu o conceito. Agora teste uma variação sua.”
- “Ainda não funcionou. Compare o resultado esperado com o que aconteceu.”
- “Nenhum projeto publicado ainda. Seu primeiro experimento pode ser curto.”
- “Esse comentário foi encaminhado para moderação.”
- “A resposta da IA pode estar incompleta. Confira as fontes da lesson.”
- “Você pode continuar gratuitamente.”
- “Esta oferta não é necessária para concluir a trilha.”

## 5. Acessibilidade mínima

- WCAG 2.2 AA como referência.
- Contraste de texto e foco visível.
- Navegação completa por teclado.
- Labels e mensagens para leitor de tela.
- Legendas/transcrição em eventos e vídeos.
- Redução de movimento respeitada.
- Não depender de áudio, cor ou hover.
- Código, gráficos e previews com alternativa textual.
- Uploads com limites, formatos aceitos e mensagem compreensível.

## 6. Critérios de aceite

- As oito telas principais têm objetivo, hierarquia, ações, vazio, erro e microcopy.
- O fluxo principal é utilizável em largura mobile.
- Lesson e projeto têm estados de progresso claros.
- Feed oferece denúncia e não auto-reproduz mídia.
- Chat é claramente marcado como futuro/controlado.
- Contraste, teclado, labels e alternativas textuais são testados.
- O tom não usa culpa, medo ou promessa profissional.

## Checkpoint de wireframes — aprovação simulada

**Entrega:** direção visual, navegação, wireframes, microcopy e acessibilidade.  
**Pendências:** onboarding A/B, user stories, prompts, roadmap, KPIs, moderação, LGPD e stack.  
**Status:** **ACEITO.**  
**Comentário:** a interface prioriza o próximo passo de aprendizagem. A estética criativa deve ser validada em protótipo para evitar excesso visual e problemas de contraste.
