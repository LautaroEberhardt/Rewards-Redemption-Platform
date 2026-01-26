// frontend/src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { EsquemaLogin } from "../components/auth/esquemas"; // Asegúrate que la ruta relativa sea correcta, si src está dentro de frontend, quizás sea "../components..."

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google, 
    Credentials({
      async authorize(credentials) {
        // 1. Validar los campos con el esquema Zod
        const camposValidados = EsquemaLogin.safeParse(credentials);

        if (!camposValidados.success) return null;

        const { email, password } = camposValidados.data;

        // 2. Llamada a tu backend de NestJS
        try {
          const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!respuesta.ok) {
             console.error("Error backend:", await respuesta.text());
             return null;
          }

          const usuario = await respuesta.json();
          // El usuario debe tener { id, email, rol, ... }
          return usuario;
        } catch (error) {
          console.error("Error de conexión auth:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error El tipo user viene extendido del backend
        token.rol = user.rol;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error Extendiendo tipos de sesión
        session.user.rol = token.rol as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", 
    error: "/",  // Redirigir al home en caso de error para mostrar el toast/alerta
  },
});