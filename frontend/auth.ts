import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { EsquemaLogin } from "@/components/auth/esquemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const camposValidados = EsquemaLogin.safeParse(credentials);
        if (!camposValidados.success) return null;

        const { correo, password } = camposValidados.data;

        try {
          const respuesta = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ correo: correo, contrasena: password }),
            },
          );

          if (!respuesta.ok) return null;

          const data = await respuesta.json();

          return {
            ...data.usuario,
            rol: data.usuario?.rol,
            id: data.usuario?.id,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      
      // ==========================================================
      // 1. LÓGICA EXCLUSIVA PARA GOOGLE
      // ==========================================================
      if (account?.provider === "google") {
        try {
          const respuesta = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                correo: user?.email,
                nombreCompleto: user?.name || "Usuario de Google",
                googleId: account.providerAccountId,
                foto: user?.image || "",
              }),
            },
          );

          if (respuesta.ok) {
            const dataBackend = await respuesta.json();
            token.accessToken = dataBackend.access_token ?? dataBackend.token?.access_token;
            token.rol = dataBackend.usuario?.rol;
            token.id = dataBackend.usuario?.id;
          } else {
            // AHORA SÍ VEREMOS POR QUÉ FALLA EN LA CONSOLA
            const errorBackend = await respuesta.text();
            console.error("❌ El backend rechazó el usuario de Google:", errorBackend);
          }
        } catch (error) {
          console.error("❌ Error de red conectando con backend:", error);
        }
      }

      // ==========================================================
      // 2. LÓGICA EXCLUSIVA PARA CREDENCIALES
      // ==========================================================
      // Le agregamos la validación de que provider sea 'credentials'
      // para que NO borre los datos que acabamos de guardar en el paso de Google
      if (account?.provider === "credentials" && user) {
        token.rol = (user as any).rol;
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.rol = token.rol as string;
        session.user.id = token.id as string;
        (session.user as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});