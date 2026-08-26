import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "./server/db";

// Provider só pros testes E2E logarem sem depender da conta Google de verdade.
// Dupla trava: nunca entra na lista de providers em produção (nem existe o
// import condicional seria suficiente sozinho — isso aqui é defesa em profundidade)
// e exige um segredo que só existe em .env.local/CI, nunca configurado na Vercel.
const testCredentialsProvider =
  process.env.NODE_ENV !== "production" && process.env.E2E_TEST_AUTH_SECRET
    ? [
        Credentials({
          id: "test-credentials",
          name: "Test Credentials",
          credentials: { secret: { label: "Secret", type: "password" }, email: { label: "Email", type: "text" } },
          async authorize(credentials) {
            if (process.env.NODE_ENV === "production") return null;
            if (credentials?.secret !== process.env.E2E_TEST_AUTH_SECRET) return null;
            const requested = typeof credentials?.email === "string" ? credentials.email : "";
            // preso a @local.test mesmo fora de produção — não é pra logar como ninguém real
            const email = requested.endsWith("@local.test") ? requested : "e2e-test@local.test";
            const user = await prisma.user.upsert({
              where: { email },
              update: {},
              create: { email, name: `Test user (${email})` },
            });
            return { id: user.id, email: user.email, name: user.name };
          },
        }),
      ]
    : [];

// Versão completa (com adapter/Prisma) — usada nas rotas de API e Server
// Components, que rodam em Node.js runtime. O middleware usa auth.config.ts
// diretamente, sem essa versão, para não puxar o Prisma para o bundle de Edge.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [...authConfig.providers, ...testCredentialsProvider],
});
