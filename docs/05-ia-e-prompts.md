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

Papel estritamente limitado: transformar notícia/texto bruto em sinal estruturado (sentimento, ativos citados) e, no futuro, explicar em linguagem natural por que um score mudou. Nunca calcula o score sozinho, nunca decide nada e nunca inventa dado de mercado — todo número vem do pipeline quantitativo (ver [09 — Conselheiro de investimentos](09-investimentos-e-harness.md)). Na primeira versão a explicação é gerada por template determinístico, não por chamada real de LLM — mesmo estágio do restante do projeto (nenhuma chamada real de IA ainda). As mesmas regras do Amarildo se aplicam: separar fato de interpretação, citar fonte da notícia, e nunca dar aconselhamento profissional formal.
