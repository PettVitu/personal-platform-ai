# 01 — Escopo, visão e decisões de produto

**Produto:** Clareza  
**Versão:** 1.0  
**Status:** fonte operacional do produto

## Visão

O Clareza é uma PWA pessoal que organiza receitas, despesas, metas, simulações e compromissos em uma visão simples da vida financeira. O usuário mantém o controle: o produto calcula, organiza, alerta e explica, mas não movimenta dinheiro nem toma decisões por ele.

## Problema e proposta de valor

Informações ficam espalhadas entre bancos, planilhas, e-mail, calendário e memória. Isso dificulta entender para onde o dinheiro vai, acompanhar metas e lembrar vencimentos.

**Proposta:** em poucos minutos por semana, transformar transações, metas e compromissos em uma visão clara, com cálculos transparentes, alertas controláveis e IA explicável.

## Público inicial

Adultos no Brasil que desejam organizar finanças sem entregar ao produto o controle do dinheiro. O primeiro lançamento atende pessoas dispostas a cadastrar ou importar dados manualmente e preocupadas com privacidade.

## Diferenciais

- Núcleo útil sem integração bancária.
- Finanças, metas e compromissos em um mesmo contexto.
- Separação explícita entre fato, cálculo, simulação, sugestão e decisão.
- Linguagem calma e sem julgamento.
- Exportação, exclusão e revogação como funcionalidades de primeira classe.

## Limites do produto

No MVP, o Clareza não movimenta dinheiro, executa investimentos, recomenda produtos, altera eventos, envia/responde/apaga e-mails ou apresenta projeções como garantias. Não substitui contador, consultor financeiro ou instituição financeira.

## Personas

### Lucas Almeida — jovem profissional

27 anos, analista de marketing CLT, renda líquida aproximada de R$ 5.500. Tem baixa organização, conhecimento iniciante de investimentos e usa banco, notas do celular e uma planilha abandonada. Perde o controle com cartão, pequenas despesas e assinaturas. Quer fechar o mês no positivo e criar reserva. Teme uma ferramenta trabalhosa e julgadora. Prioriza cadastro rápido, CSV, categorias, orçamento e resumo semanal.

### Marina Costa — autônoma com renda variável

35 anos, designer freelancer, renda entre R$ 4.000 e R$ 10.000. Tem organização média, mas mistura meses bons e ruins; conhece o básico de investimentos. Usa planilha, banco, agenda e notas. Sofre com previsibilidade de caixa, clientes atrasados e despesas recorrentes. Quer reserva, férias e cenários de renda. Teme que o sistema assuma salário fixo. Prioriza fluxo de caixa, receitas previstas/recebidas, contas recorrentes e metas.

### Eduardo Nascimento — investidor organizado

43 anos, gerente de operações, renda líquida aproximada de R$ 18.000. É organizado, investe em renda fixa, fundos e ETFs, mas mantém várias planilhas. Quer acompanhar patrimônio, aportes, vencimentos e aposentadoria. Teme números incorretos e recomendações inadequadas. Prioriza ativos manuais, metas patrimoniais, simulador, distribuição, exportação e histórico auditável.

## Hipóteses de validação

1. Cadastro manual e CSV bastam para gerar primeiro valor.
2. Uma rotina semanal pode ser mantida em menos de dez minutos.
3. Metas aumentam retorno mais que um dashboard isolado.
4. Resumos explicativos são mais úteis que recomendações automáticas.
5. Usuários aceitam não conectar banco quando a privacidade e a importação são claras.
6. Agenda reduz esquecimentos sem gerar ansiedade ou excesso de alertas.

## Opções de MVP

| Opção | Prazo/custo | Escopo | Risco | Evolução |
|---|---|---|---|---|
| A — rápida | 10–12 semanas; US$ 50–75 mil | Manual, CSV, dashboard, simulador básico, alertas internos e PWA | Retrabalho arquitetural e pouca validação de integrações | Boa validação inicial, menor flexibilidade |
| B — completa | 16–24 semanas; US$ 120–150 mil+ | Banco, e-mail, agenda, classificação automática, relatórios e multicanal | Não cabe com segurança em três meses; grande superfície de ataque | Alta, porém complexa e cara |
| C — modular | 12–14 semanas; US$ 80–120 mil | Núcleo manual, contratos de API e domínios desacoplados | Exige disciplina; conectores ficam posteriores | Melhor equilíbrio para crescer |

## Decisão recomendada

Adotar a **Opção C com escopo funcional da Opção A**. O caminho crítico é: registrar/importar → entender → planejar → revisar. Agenda conectada é desejável, não bloqueadora. E-mail conectado fica fora do caminho crítico.

## Critérios de adiamento

Adiar o item se ele exigir credencial sensível ou escopo amplo, não tiver fallback manual, não puder ser auditado, aumentar o prazo além de 12 semanas, não for necessário ao primeiro ciclo ou não tiver métrica e critério de desligamento.

## Riscos iniciais

| Risco | Probabilidade/impacto | Mitigação |
|---|---|---|
| Excesso de escopo | Alta/alto | Congelar caminho crítico e revisar semanalmente |
| CSV inconsistente | Alta/alto | Template, prévia, validação e importação reversível |
| Vazamento financeiro | Média/muito alto | Menor privilégio, criptografia, segregação e auditoria |
| IA inventar explicações | Média/alto | Dados estruturados, fontes, testes e sem ações |
| Simulação virar promessa | Média/alto | Premissas visíveis e aviso persistente |
| Alertas excessivos | Média/médio | Agrupamento, limite e controles individuais |
| Baixa retenção | Média/alto | Validar metas e revisão semanal antes de integrações |

## Critérios de sucesso do escopo

O MVP deve permitir primeiro valor sem integrações, importar sem registros parciais, explicar todos os cálculos, exportar/excluir dados e operar em mobile. Nenhuma funcionalidade financeira ou externa pode ser executada sem confirmação.
