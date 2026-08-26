// Compara o score dado no momento da sugestão com o retorno real observado depois.
// O score só "aposta" numa direção quando está fora da faixa neutra — dentro dela
// (40 a 60) não há chamada forte o suficiente pra julgar como acerto ou erro.
const BUY_THRESHOLD = 60;
const AVOID_THRESHOLD = 40;

export type ScoreCall = "acertou" | "errou" | null;

export function evaluateScoreCall(score: number, realizedReturnPct: number): ScoreCall {
  if (score >= BUY_THRESHOLD) return realizedReturnPct > 0 ? "acertou" : "errou";
  if (score <= AVOID_THRESHOLD) return realizedReturnPct <= 0 ? "acertou" : "errou";
  return null;
}
