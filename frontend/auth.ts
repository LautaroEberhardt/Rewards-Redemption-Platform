import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { EsquemaLogin } from "@/components/auth/esquemas";

declare module "next-auth" {
  interface Session {
    user: {
      rol?: string | null;
      id?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    rol?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google, // Se configura auto con process.env.AUTH_GOOGLE_ID
    Credentials({
      async authorize(credentials) {
        const camposValidados = EsquemaLogin.safeParse(credentials);
        if (!camposValidados.success) return null;

        const { email, password } = camposValidados.data;

        // Login normal con credenciales
        const respuesta = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasena: password }),
          },
        );

        if (!respuesta.ok) return null;

        const data = await respuesta.json();

        // El objeto usuario debe incluir: id, nombre, email y ROL
        // Ahora devolvemos el objeto 'usuario' anidado en la respuesta
        return data.usuario || null;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          const respuesta = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: profile?.email,
                nombreCompleto: profile?.name,
                googleId: profile?.sub,
                foto: profile?.picture,
              }),
            },
          );

          if (!respuesta.ok) {
            console.error("Error al registrar usuario de Google en Backend");
            return false;
          }

          const usuarioBackend = await respuesta.json();

          return true;
        } catch (error) {
          console.error("Error de conexión con Backend:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.rol = user.rol || "cliente";
        token.id = user.id;
      }

      if (account?.provider === "google" && !token.rol) {
        token.rol = "cliente";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.rol = token.rol as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
