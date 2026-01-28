import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // v5 authorize
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              contrasena: credentials?.password,
            }),
          });

          if (!res.ok) return null;
          const data = await res.json();
          // data: { access_token, usuario }
          return {
            id: String(data.usuario?.id ?? ""),
            name: data.usuario?.nombre ?? data.usuario?.nombreCompleto ?? "",
            email: data.usuario?.email ?? "",
            rol: data.usuario?.rol ?? "cliente",
            token: data.access_token,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist token and role on JWT
      if (user && (user as any).token) {
        token.backendToken = (user as any).token;
      }
      const rol = (user as any)?.rol ?? token.rol;
      if (rol) token.rol = rol;
      // For Google, you could exchange profile for backend token here if needed
      return token;
    },
    async session({ session, token }) {
      // Expose backend token and role to the client
      (session.user as any).token = (token as any).backendToken;
      (session.user as any).rol = (token as any).rol;
      return session;
    },
  },
});
