# 05 — Amarildo e IA

## Estado atual

O Amarildo é uma simulação local. Não envia dados a um provedor e não executa alterações.

## Regras futuras

- consultar somente dados autorizados;
- informar quando não houver evidência;
- separar fato, cálculo, interpretação e sugestão;
- apresentar fonte documental;
- pedir confirmação antes de criar, alterar ou excluir;
- nunca dar aconselhamento profissional;
- nunca inventar valores, datas ou obrigações.

## RAG futuro

Documento autorizado → processamento → chunks versionados → busca filtrada por usuário e permissão → resposta com fonte. Documentos bloqueados não podem gerar contexto.

## IA no conselheiro de investimentos

**Decisão (2026-08-26): sem LLM por agora.** Cogitou-se um "agente conselheiro" com explicação via LLM real. Adiado porque chamar uma API de LLM em produção custa por chamada, e nenhuma assinatura (Claude.ai Pro/Max, por exemplo) cobre isso — é gasto à parte que ainda não faz sentido pra esse estágio do projeto. Em vez disso, o conselheiro ganhou um componente **estatístico determinístico**: mineração de regras de associação (Apriori) sobre o histórico real de sugestões e o retorno observado depois, sem depender de nenhuma API paga. Ver [09 — Conselheiro de investimentos](09-investimentos-e-harness.md) para a implementação. A regra de fundo continua a mesma de sempre — nenhum componente de IA/estatística decide ou executa nada, só descreve padrão observado — só que por ora nada aqui é LLM: o score é fórmula fixa, a explicação é template, e os insights são regras de associação com suporte/confiança calculados, não texto gerado.

Se algum dia a explicação via LLM voltar à mesa, o papel dela continua estritamente limitado: nunca calcula o score sozinho, nunca decide nada e nunca inventa dado de mercado — todo número vem do pipeline quantitativo. As mesmas regras do Amarildo se aplicariam: separar fato de interpretação, citar fonte da notícia, e nunca dar aconselhamento profissional formal.
