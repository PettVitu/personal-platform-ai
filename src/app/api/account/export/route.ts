import { NextResponse } from "next/server";
import { getUserId } from "../../../../server/auth-helpers";
import { prisma } from "../../../../server/db";
import { rateLimit } from "../../../../server/rate-limit";

// Exportação LGPD: todo dado pessoal do usuário logado, num único arquivo que
// ele pode baixar e ler sem depender de mais nada. InvestmentHistoryEntry fica
// de fora de propósito — é dado de mercado público, não pertence a ninguém.
export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "account:export", { limit: 5, windowMs: 60_000, userId });
  if (limited) return limited;

  const [user, tasks, transactions, bills, appointments, documents, watchlist] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, createdAt: true } }),
    prisma.task.findMany({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId } }),
    prisma.recurringBill.findMany({ where: { userId } }),
    prisma.appointment.findMany({ where: { userId } }),
    prisma.documentNote.findMany({ where: { userId } }),
    prisma.watchlistItem.findMany({ where: { userId } }),
  ]);
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  const payload = { exportedAt: new Date().toISOString(), user, tasks, transactions, bills, appointments, documents, watchlist };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="meus-dados-${userId}.json"`,
    },
  });
}
