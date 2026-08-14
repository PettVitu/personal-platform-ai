# 04 — Arquitetura de conteúdo educacional

**Objetivo:** transformar o posicionamento do Vibe Coding em uma unidade de conteúdo que possa ser criada, revisada, publicada, medida e reutilizada.

## 1. Princípios pedagógicos

- Cada conteúdo deve produzir uma ação observável.
- Explicação curta vem antes da abstração completa.
- Código é apresentado em pequenas mudanças, não como bloco pronto.
- O erro faz parte do exercício e deve ter orientação de diagnóstico.
- O usuário pode remixar e publicar, respeitando licença e autoria.
- Conteúdo visual não substitui fundamentos; ele cria motivação para aprendê-los.
- IA pode apoiar explicação e feedback, mas não substitui tentativa do aluno.

## 2. Formatos

| Formato | Duração | Objetivo | Critério de qualidade |
|---|---:|---|---|
| Micro-lesson | 5–12 min | Ensinar uma ideia e gerar um resultado curto | Objetivo, prática, exercício e quiz |
| Projeto guiado | 30–120 min | Integrar várias ideias em um artefato | Brief, starter, checkpoints, rubrica e publicação |
| Desafio remix | 15–45 min | Modificar um projeto existente | Restrição clara e espaço para autoria |
| Glossário visual | 2–5 min | Explicar termo ou erro | Exemplo antes da definição |
| Code reading | 5–10 min | Ensinar leitura e depuração | Perguntas sobre comportamento, não memorização |
| Evento ao vivo | 45–90 min | Demonstrar processo e responder perguntas | Gravação, resumo e atividade posterior |
| Feedback de projeto | 5–15 min | Melhorar resultado com pares | Rubrica, respeito e sugestão acionável |

## 3. Níveis

### Iniciante

Pré-requisitos: navegador, arquivos e noções básicas de HTML. O conteúdo explica termos, oferece setup guiado e limita decisões simultâneas.

### Intermediário

Pré-requisitos: JavaScript básico, Git e publicação simples. O conteúdo assume leitura de código e inclui trade-offs, APIs e depuração.

### Avançado — posterior

Explora performance, arquitetura, acessibilidade avançada, Web APIs complexas e integração entre sistemas. Não é necessário para validar o MVP.

## 4. Template obrigatório de micro-lesson

Cada lesson deve conter:

1. Título concreto e resultado visível.
2. Nível, duração e pré-requisitos.
3. Objetivo em linguagem de ação.
4. Contexto curto: por que isso existe.
5. Setup e arquivos iniciais.
6. Passos numerados, cada um com teste observável.
7. Erros comuns e como investigar.
8. Exercício sem solução imediata.
9. Quiz de 5 perguntas com explicações.
10. Próximo projeto ou lesson recomendada.
11. Licença e créditos de assets.
12. Versão, autor e data de revisão.

## 5. Pacote inicial do MVP

### 10 micro-lessons

| # | Lesson | Nível | Resultado |
|---:|---|---|---|
| 1 | Primeiro canvas interativo | Iniciante | Forma que reage ao clique |
| 2 | Cores e composição com CSS | Iniciante | Poster visual responsivo |
| 3 | JavaScript para movimento | Iniciante | Animação controlada por teclado |
| 4 | Estado e interação | Iniciante | Interface com controles e feedback |
| 5 | Introdução à WebAudio API | Iniciante | Oscilador ativado com segurança |
| 6 | Visualizador de áudio | Intermediário | Canvas reage a frequência sonora |
| 7 | Dados viram visual | Intermediário | Gráfico generativo com dados locais |
| 8 | API externa com fallback | Intermediário | Busca de dados sem quebrar offline |
| 9 | Publicar e documentar projeto | Iniciante | README, preview e link compartilhável |
| 10 | Feedback e iteração | Iniciante/intermediário | Checklist de revisão e nova versão |

### 3 projetos hands-on

#### Projeto 1 — Poster sonoro

Criar uma página visual que reage a uma interação sonora.  
Checkpoints: estrutura, composição, evento, áudio, acessibilidade e publicação.  
Rubrica: funcionamento 30%, clareza do código 20%, interação 20%, acessibilidade 15%, documentação 15%.

#### Projeto 2 — Instrumento visual

Construir uma interface com pads, teclado ou controles que produza feedback visual e sonoro.  
Checkpoints: estado, eventos, WebAudio, feedback de erro e responsividade.  
Rubrica: comportamento 30%, experiência 20%, organização 20%, acessibilidade 15%, explicação 15%.

#### Projeto 3 — Experimento generativo

Criar uma composição visual ou sonora baseada em regras, dados locais ou parâmetros do usuário.  
Checkpoints: algoritmo, controles, seed/reprodutibilidade, performance e publicação.  
Rubrica: conceito 20%, técnica 25%, exploração 20%, performance 15%, documentação 20%.

## 6. Avaliação

### Quiz

Cinco perguntas por micro-lesson. Misturar previsão de comportamento, leitura de código, depuração e aplicação. Permitir nova tentativa após explicação. O quiz mede compreensão local; não deve bloquear indefinidamente o projeto.

### Checkpoints de projeto

Cada checkpoint exige um resultado verificável. O usuário pode pedir ajuda informando o que tentou, o que esperava e o erro encontrado.

### Rubrica

Usar quatro níveis: **ainda não**, **funciona com ajuda**, **funciona de forma independente**, **explica e adapta**. O feedback deve citar evidência e próximo passo.

### Avaliação comunitária

Comentários podem seguir três prompts: “O que funcionou?”, “O que fiquei curioso para entender?” e “Qual experimento pequeno você tentaria?”. Não usar voto como nota pedagógica.

## 7. Badges

Badges devem representar comportamento real, não volume vazio.

| Badge | Condição |
|---|---|
| Primeiro experimento | Concluir uma micro-lesson e salvar resultado |
| Construtor | Publicar primeiro projeto |
| Iterador | Publicar uma segunda versão com base em feedback |
| Explorador de áudio | Concluir lessons de WebAudio e visualizador |
| Bom feedback | Receber avaliação positiva de utilidade em 3 comentários |
| Guia da comunidade | Ajudar 5 pessoas sem denúncia procedente |
| Trilha concluída | Finalizar todas as lessons e projeto de uma trilha |

Não haverá ranking global obrigatório. O usuário pode ocultar badges do perfil.

## 8. Certificação opcional

Certificado só deve existir após validação de aprendizagem e publicação de projeto. Deve informar trilha, conteúdos, data, critérios e identificador verificável. Não prometer empregabilidade. No MVP, pode ser apenas um comprovante visual de conclusão; certificado com verificação pública fica para etapa posterior.

## 9. Curadoria e revisão

Todo conteúdo tem autor, revisor, versão, status e data de revisão. Estados: rascunho → revisão pedagógica → revisão técnica → publicado → descontinuado. Conteúdo com dependência quebrada deve exibir aviso e receber fallback.

## 10. Métricas de conteúdo

- Início e conclusão por lesson.
- Tempo até primeiro resultado.
- Tentativas e erros mais comuns.
- Desempenho no quiz.
- Início, conclusão e publicação por projeto.
- Feedback recebido e respondido.
- Lessons abandonadas por checkpoint.
- Retorno por trilha e nível.

## 11. Arquitetura RAG vetorial para conteúdo educacional

### 11.1 Objetivo

O RAG (Retrieval-Augmented Generation) será usado para recuperar conteúdo educacional aprovado e fornecer contexto ao agente de IA. Ele poderá explicar uma lesson, sugerir o próximo conteúdo, responder dúvidas sobre um projeto e gerar feedback alinhado à rubrica.

O RAG não substitui a fonte editorial. A resposta deve apontar a lesson, o projeto ou a regra usada. Se não houver contexto suficiente, o agente deve declarar a limitação em vez de inventar.

### 11.2 Fontes indexáveis

Podem ser indexados:

- micro-lessons publicadas;
- glossário revisado;
- documentação de projetos e checkpoints;
- rubricas de avaliação;
- FAQs técnicas aprovadas;
- código de conduta e orientações de comunidade;
- resumos de eventos publicados.

Não indexar por padrão:

- rascunhos;
- conteúdo removido ou em revisão;
- mensagens privadas;
- denúncias e dados de moderação;
- projetos privados ou não listados sem autorização explícita;
- tokens, dados pessoais desnecessários e informações de pagamento.

### 11.3 Pipeline de ingestão

```text
conteúdo aprovado
  → normalização
  → remoção de dados sensíveis
  → divisão em chunks
  → enriquecimento de metadados
  → geração de embeddings
  → armazenamento vetorial
  → índice lexical/híbrido
  → validação e publicação
```

O pipeline deve ser assíncrono e idempotente. Uma nova versão não deve duplicar a versão anterior como conteúdo ativo. A publicação de uma lesson dispara reindexação; a despublicação remove ou desativa seus chunks na busca.

### 11.4 Estratégia de chunking

Não dividir apenas por número fixo de caracteres. Usar estrutura semântica e preservar contexto.

| Tipo de conteúdo | Chunk recomendado | Sobreposição | Regra adicional |
|---|---:|---:|---|
| Texto explicativo | 300–600 tokens | 10–15% | Não separar definição de exemplo |
| Passo de exercício | 150–350 tokens | 10% | Um passo deve ser recuperável sozinho |
| Erro e solução | 200–400 tokens | 10–15% | Manter mensagem de erro, causa e correção |
| Quiz | 1 questão por chunk | 0–10% | Separar resposta até o agente precisar dela |
| Rubrica | 1 critério por chunk | 0% | Incluir nível e evidência esperada |
| Código | Por função/bloco lógico | 0–10% | Preservar linguagem, arquivo e dependências |
| FAQ | 1 pergunta e resposta | 0–10% | Indexar pergunta e variações linguísticas |

Cada chunk deve receber um cabeçalho contextual interno com título, trilha, nível, lesson, seção e versão. Esse cabeçalho reduz resultados ambíguos sem aparecer necessariamente ao usuário.

### 11.5 Metadados obrigatórios

```json
{
  "document_id": "lesson-webaudio-001",
  "chunk_id": "lesson-webaudio-001-step-03",
  "content_type": "lesson_step",
  "title": "Criando um oscilador",
  "track": "audio",
  "level": "beginner",
  "lesson_id": "lesson-005",
  "project_id": null,
  "language": "pt-BR",
  "status": "published",
  "version": 3,
  "author_id": "editorial-12",
  "license": "CC-BY-NC",
  "published_at": "2026-08-14T12:00:00Z",
  "visibility": "public",
  "prerequisites": ["lesson-001"],
  "tags": ["webaudio", "javascript", "sound"],
  "source_url": "/lessons/lesson-005#step-3"
}
```

Campos de autorização, visibilidade e versão são obrigatórios para impedir que uma busca pública recupere conteúdo privado ou obsoleto.

### 11.6 Recuperação

Usar busca híbrida:

1. busca semântica por embedding para intenção e conceitos;
2. busca lexical para nomes exatos de APIs, erros, funções e termos técnicos;
3. filtros por idioma, nível, trilha, versão, status e visibilidade;
4. re-ranking por relevância, pré-requisitos e contexto da lesson atual;
5. limite de contexto para evitar respostas longas e redundantes.

Fluxo recomendado:

```text
pergunta do usuário
  → classificação de intenção
  → filtros de autorização e contexto
  → busca vetorial + lexical
  → deduplicação por documento
  → re-ranking
  → seleção dos melhores chunks
  → geração com citações
  → validação de resposta
```

Para dúvidas de uma lesson, priorizar a própria lesson e seus pré-requisitos. Para dúvidas de projeto, priorizar checkpoint, rubrica e erros relacionados. Não misturar conteúdo iniciante e avançado sem informar a diferença.

### 11.7 Resposta do agente

Toda resposta baseada em RAG deve conter, quando aplicável:

- resposta curta e direta;
- referência ao conteúdo usado;
- nível e pré-requisito relevante;
- distinção entre regra do curso e sugestão do agente;
- aviso quando não houver evidência suficiente;
- próximo passo prático.

O agente não deve revelar o texto integral de lessons pagas, respostas de quizzes ou conteúdo restrito. Deve responder por síntese dentro dos direitos de acesso do usuário.

### 11.8 Versionamento e consistência

- Embeddings devem registrar modelo e data de geração.
- Alteração substancial cria nova versão do documento.
- Chunks antigos ficam inativos após a publicação da nova versão.
- Respostas armazenadas devem registrar versão dos chunks recuperados.
- Reindexação deve ser reproduzível e ter relatório de falhas.
- Conteúdo removido deve deixar de ser recuperado dentro do SLA definido pela operação.

### 11.9 Privacidade e segurança

- Filtrar autorização antes da busca e novamente antes da geração.
- Separar índices públicos, privados e administrativos.
- Não colocar dados pessoais desnecessários nos embeddings.
- Não indexar mensagens privadas para treinamento ou recuperação global.
- Registrar documento e chunk recuperados, mas não armazenar a pergunta além da política definida.
- Permitir exclusão de embeddings derivados quando o usuário excluir projeto ou conta.
- Tratar conteúdo enviado pela comunidade como não confiável; ele não pode sobrescrever instruções do sistema.

### 11.10 Avaliação do RAG

Medir separadamente:

- **Recall@k:** se o chunk correto aparece entre os recuperados;
- **MRR/NDCG:** posição e qualidade do resultado;
- **groundedness:** quanto da resposta está sustentado pelos chunks;
- **citation accuracy:** se a referência realmente suporta a frase;
- **answer usefulness:** avaliação do usuário;
- **leakage rate:** ocorrências de conteúdo fora da permissão;
- **latência e custo** por consulta.

Criar conjunto de avaliação com perguntas de iniciante, dúvidas ambíguas, erros exatos, conteúdo desatualizado, tentativas de acessar conteúdo privado e prompt injection em projetos comunitários.

### 11.11 Critérios de aceite do RAG

- Somente conteúdo publicado e autorizado é recuperado.
- Cada resposta educacional apresenta fonte ou declara ausência de evidência.
- Conteúdo privado, removido e rascunho não aparece em busca pública.
- Nova versão invalida chunks antigos.
- Busca encontra termos semânticos e nomes exatos de APIs/erros.
- O sistema resiste a instruções maliciosas inseridas em conteúdo comunitário.
- Existe fallback para resposta determinística ou “não encontrei contexto suficiente”.

### 11.12 Configuração do agente: tokens, `top_k`, `top_p` e temperatura

Quando um agente interno acessar uma base de dados ou o índice RAG, a configuração deve ser explícita por requisição. Esses parâmetros não devem ficar escondidos em código ou variar silenciosamente entre ambientes.

É importante separar as funções:

- **`top_k`**: quantidade de chunks candidatos recuperados pelo índice. Afeta cobertura e custo de reranking.
- **`max_input_tokens`**: limite de tokens enviados como contexto ao modelo após filtros e reranking.
- **`max_output_tokens`**: limite de tokens gerados na resposta.
- **`top_p`**: amostragem por massa de probabilidade durante a geração. Afeta diversidade.
- **`temperature`**: aleatoriedade da geração. Valores menores favorecem consistência; maiores favorecem variação.

`top_k` não é um parâmetro do modelo generativo. Ele pertence à recuperação. `top_p` e temperatura não melhoram um chunk errado; apenas alteram como o modelo responde ao contexto recuperado.

#### Configuração padrão por tarefa

| Tarefa | `top_k` | `max_input_tokens` | `max_output_tokens` | `top_p` | `temperature` | Motivo |
|---|---:|---:|---:|---:|---:|---|
| Resposta técnica com fonte | 6 | 4.000 | 700 | 0,80 | 0,20 | Precisão e consistência |
| Explicação para iniciante | 5 | 3.000 | 500 | 0,85 | 0,30 | Clareza sem excesso de variação |
| Feedback de projeto | 8 | 5.000 | 800 | 0,90 | 0,45 | Considerar rubrica e contexto |
| Sugestão de próximo conteúdo | 10 | 4.000 | 400 | 0,85 | 0,35 | Comparar opções relacionadas |
| Geração de micro-lesson | 8 | 6.000 | 1.200 | 0,92 | 0,65 | Criatividade com estrutura validada |
| Classificação/extração | 4 | 2.000 | 300 | 0,70 | 0,00 | Saída determinística |

Os valores são pontos de partida. Devem ser calibrados com o conjunto de avaliação do RAG e registrados junto da versão do prompt e do modelo.

#### Contrato de configuração

```json
{
  "retrieval": {
    "top_k": 6,
    "filters": {
      "status": "published",
      "visibility": "public",
      "language": "pt-BR",
      "level": "beginner"
    },
    "rerank_limit": 4
  },
  "generation": {
    "max_input_tokens": 4000,
    "max_output_tokens": 700,
    "top_p": 0.8,
    "temperature": 0.2
  },
  "agent": {
    "task": "technical_answer",
    "prompt_version": "v1.0",
    "model": "configured-by-server"
  }
}
```

#### Limites e permissões

- O frontend não pode enviar valores arbitrários diretamente ao provedor do modelo.
- O servidor valida tipo, faixa e combinação dos parâmetros.
- `top_k` recomendado: 1–20; acima disso exige avaliação e justificativa.
- `top_p`: 0,1–1,0; padrão definido pelo tipo de tarefa.
- `temperature`: 0–1,0 no MVP; tarefas de extração usam 0–0,2.
- `max_input_tokens` respeita a janela do modelo e o orçamento por requisição.
- `max_output_tokens` impede respostas longas e custo inesperado.
- Usuários finais não alteram parâmetros de segurança, filtros, permissões ou modelo.
- Administradores podem ajustar presets versionados, com auditoria e rollback.
- Conteúdo comunitário nunca pode sobrescrever esses parâmetros por prompt injection.

#### Regra para acesso a banco de dados

Antes de consultar qualquer base, o agente deve:

1. identificar a tarefa e selecionar um preset;
2. validar a identidade e as permissões do usuário;
3. aplicar filtros de tenant, visibilidade, status e versão;
4. executar recuperação com `top_k` controlado;
5. limitar o contexto por `max_input_tokens`;
6. gerar com `top_p`, temperatura e saída limitados;
7. validar schema, fontes e autorização antes de responder;
8. registrar parâmetros, versão do prompt, IDs recuperados, latência e custo.

O agente não deve receber acesso SQL amplo no MVP. Consultas devem passar por ferramentas ou views permitidas, com parâmetros validados, limite de linhas, timeout e logs de auditoria. Para conteúdo educacional, a resposta deve usar o RAG; para métricas do usuário, deve usar consultas determinísticas e apresentar a origem dos dados.

#### Critérios de aceite da configuração

- `top_k`, `top_p`, temperatura e limites de tokens são configuráveis por preset de tarefa.
- A configuração efetiva aparece nos logs técnicos da requisição.
- Valores fora da faixa são rejeitados ou normalizados pelo servidor.
- Filtros de autorização são aplicados antes da recuperação e da geração.
- Aumentar `top_k` não permite acessar conteúdo privado.
- Temperatura alta não é usada em extração, classificação ou cálculo.
- Uma alteração de preset pode ser revertida sem alterar o conteúdo publicado.
- Existe teste comparando qualidade, latência, custo e groundedness por preset.

## Critérios de aceite

- Existem 10 micro-lessons com o template completo.
- Existem 3 projetos com brief, starter, checkpoints e rubrica.
- Cada conteúdo identifica nível, duração e pré-requisitos.
- Quiz oferece explicação após erro.
- Badges têm condição objetiva e podem ser ocultados.
- Certificação não faz promessa profissional.
- Conteúdo tem autoria, licença, versão e revisão.

## Checkpoint de conteúdo — aprovação simulada

**Entrega:** formatos, níveis, templates, 10 micro-lessons, 3 projetos, avaliações, badges, certificação e métricas.  
**Pendências:** transformar as lessons em conteúdo final, criar wireframes, detalhar onboarding A/B, prompts, roadmap, segurança e stack.  
**Status:** **ACEITO COM RESSALVAS.**  
**Comentário:** a arquitetura é adequada ao MVP, mas as 10 lessons precisam ser revisadas por alguém com experiência pedagógica e técnica antes da publicação.
