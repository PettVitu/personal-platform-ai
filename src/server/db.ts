import { PrismaClient } from "@prisma/client";

// Guardado em globalThis pelo mesmo motivo do histórico de investimentos
// (server/investments/history.ts): o Next.js empacota rotas separadamente em
// desenvolvimento, e um novo PrismaClient por módulo duplicado esgotaria
// conexões com o banco rapidamente.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;
