// frontend/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { EsquemaLogin } from "./components/auth/esquemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google, // Configuración automática gracias a AUTH_GOOGLE_ID
    Credentials({
      async authorize(credentials) {
        // 1. Validar los campos con el esquema que ya creamos
        const camposValidados = EsquemaLogin.safeParse(credentials);

        if (!camposValidados.success) return null;

        const { email, password } = camposValidados.data;

        // 2. Llamada a tu backend de NestJS para validar existencia y contraseña
        const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!respuesta.ok) return null;

        const usuario = await respuesta.ok ? await respuesta.json() : null;

        // El objeto usuario debe incluir: id, nombre, email y ROL
        return usuario;
      },
    }),
  ],
  callbacks: {
    // 3. PERSISTENCIA DE ROLES: Inyectamos el rol en el Token y la Sesión
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error ( user viene del backend con el campo 'rol' )
        token.rol = user.rol;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.rol) {
        session.user.rol = token.rol as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirigir a la home donde está tu sidebar
  },
});