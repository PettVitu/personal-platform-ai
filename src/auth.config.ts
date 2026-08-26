import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Config leve, sem adapter/Prisma — usada pelo middleware (Edge runtime).
// Importar o Prisma Client aqui estouraria o limite de tamanho de Edge Function
// da Vercel mesmo sem nunca chamar o banco, só pelo peso do bundle.
export const authConfig: NextAuthConfig = {
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
};
