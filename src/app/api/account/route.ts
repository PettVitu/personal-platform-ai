import { NextResponse } from "next/server";
import { getUserId } from "../../../server/auth-helpers";
import { prisma } from "../../../server/db";
import { rateLimit } from "../../../server/rate-limit";

// Exclusão LGPD: apaga o usuário e, por cascata (onDelete: Cascade no schema),
// todo o resto que aponta pra ele — sessões, contas OAuth e todos os dados de
// domínio. Uma linha só, sem precisar listar cada tabela na mão.
export async function DELETE(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const limited = await rateLimit(request, "account:delete", { limit: 3, windowMs: 60_000, userId });
  if (limited) return limited;
  // A sessão é JWT (ver docs/00-continuidade.md): ela continua "válida" até expirar
  // mesmo depois do usuário ser apagado, então um segundo DELETE com a mesma sessão
  // chegaria aqui de novo — trata como sucesso em vez de estourar erro do Prisma.
  await prisma.user.deleteMany({ where: { id: userId } });
  return new NextResponse(null, { status: 204 });
}
