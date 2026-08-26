import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./server/db";

// Sessão em JWT (não "database"): o middleware roda no Edge runtime, que não
// suporta o Prisma Client padrão (precisa de conexão TCP direta ao Postgres).
// Com JWT, o middleware só decodifica um cookie assinado — sem tocar no banco.
// O adapter continua criando/atualizando User e Account normalmente no login.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id;
      return session;
    },
  },
});
