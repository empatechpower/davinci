import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { queryOne, execute } from "./db";
import { authConfig } from "./auth.config";
import type { User } from "./db/types";

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; name?: string | null };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await queryOne<User>(
          "SELECT id, email, password_hash, full_name FROM users WHERE email = $1",
          [credentials.email]
        );
        if (!user?.password_hash) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.full_name };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, upsert the user into our users table
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!user.email) return false;
        const existing = await queryOne<User>(
          "SELECT id FROM users WHERE email = $1",
          [user.email]
        );
        if (!existing) {
          const id = crypto.randomUUID();
          await execute(
            "INSERT INTO users (id, email, full_name) VALUES ($1, $2, $3)",
            [id, user.email, user.name ?? null]
          );
          user.id = id;
        } else {
          user.id = existing.id;
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
    authorized({ auth: session }) {
      return !!session?.user;
    },
  },
});
