import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "./server/db";

// Versão completa (com adapter/Prisma) — usada nas rotas de API e Server
// Components, que rodam em Node.js runtime. O middleware usa auth.config.ts
// diretamente, sem essa versão, para não puxar o Prisma para o bundle de Edge.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
});
