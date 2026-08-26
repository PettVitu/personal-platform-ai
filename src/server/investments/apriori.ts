// Apriori genérico: acha itemsets frequentes e regras de associação em cima de
// "transações" (cada uma é um conjunto de itens categóricos). Não sabe nada sobre
// investimentos — quem faz a tradução de score/notícia em itens é insights.ts.
export type Transaction = string[];
export type Itemset = { items: string[]; support: number };
export type AssociationRule = { antecedent: string[]; consequent: string[]; support: number; confidence: number; lift: number };

const key = (items: string[]) => [...items].sort().join("|");

export function findFrequentItemsets(transactions: Transaction[], minSupport: number): Itemset[] {
  const total = transactions.length;
  if (total === 0) return [];
  const transactionSets = transactions.map((items) => new Set(items));
  const support = (items: string[]) => transactionSets.filter((set) => items.every((item) => set.has(item))).length / total;

  const itemCounts = new Map<string, number>();
  for (const items of transactions) for (const item of new Set(items)) itemCounts.set(item, (itemCounts.get(item) ?? 0) + 1);

  let level: string[][] = [...itemCounts.keys()].filter((item) => (itemCounts.get(item)! / total) >= minSupport).map((item) => [item]).sort();
  const frequent: Itemset[] = level.map((items) => ({ items, support: support(items) }));

  let size = 2;
  while (level.length > 1) {
    const candidates = generateCandidates(level, size);
    const nextLevel: string[][] = [];
    for (const candidate of candidates) {
      const candidateSupport = support(candidate);
      if (candidateSupport >= minSupport) {
        nextLevel.push(candidate);
        frequent.push({ items: candidate, support: candidateSupport });
      }
    }
    if (nextLevel.length === 0) break;
    level = nextLevel;
    size += 1;
  }
  return frequent;
}

function generateCandidates(previousLevel: string[][], size: number): string[][] {
  const candidates: string[][] = [];
  const seen = new Set<string>();
  const previousKeys = new Set(previousLevel.map(key));
  for (let i = 0; i < previousLevel.length; i++) {
    for (let j = i + 1; j < previousLevel.length; j++) {
      const a = previousLevel[i];
      const b = previousLevel[j];
      if (a.slice(0, size - 2).join(",") !== b.slice(0, size - 2).join(",")) continue;
      const merged = [...new Set([...a, ...b])].sort();
      if (merged.length !== size) continue;
      const candidateKey = key(merged);
      if (seen.has(candidateKey)) continue;
      if (hasInfrequentSubset(merged, previousKeys)) continue;
      seen.add(candidateKey);
      candidates.push(merged);
    }
  }
  return candidates;
}

// Propriedade do Apriori: um itemset só pode ser frequente se todo subconjunto
// de tamanho (n-1) também for. Poda candidatos que violam isso antes de contar.
function hasInfrequentSubset(candidate: string[], previousKeys: Set<string>): boolean {
  for (let i = 0; i < candidate.length; i++) {
    const subset = [...candidate.slice(0, i), ...candidate.slice(i + 1)];
    if (!previousKeys.has(key(subset))) return true;
  }
  return false;
}

function properNonEmptySubsets(items: string[]): string[][] {
  const subsets: string[][] = [];
  const total = 1 << items.length;
  for (let mask = 1; mask < total - 1; mask++) {
    subsets.push(items.filter((_, index) => mask & (1 << index)));
  }
  return subsets;
}

export function generateRules(frequentItemsets: Itemset[], minConfidence: number): AssociationRule[] {
  const supportByKey = new Map(frequentItemsets.map(({ items, support }) => [key(items), support]));
  const rules: AssociationRule[] = [];
  for (const { items, support } of frequentItemsets) {
    if (items.length < 2) continue;
    for (const antecedent of properNonEmptySubsets(items)) {
      const consequent = items.filter((item) => !antecedent.includes(item));
      const antecedentSupport = supportByKey.get(key(antecedent));
      const consequentSupport = supportByKey.get(key(consequent));
      if (antecedentSupport === undefined || consequentSupport === undefined || antecedentSupport === 0) continue;
      const confidence = support / antecedentSupport;
      if (confidence < minConfidence) continue;
      rules.push({ antecedent, consequent, support, confidence, lift: confidence / consequentSupport });
    }
  }
  return rules.sort((a, b) => b.confidence - a.confidence || b.lift - a.lift);
}
