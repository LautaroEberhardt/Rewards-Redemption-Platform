import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { EsquemaLogin } from "@/components/auth/esquemas";

// La extensión de tipos de NextAuth se declara globalmente en types/next-auth.d.ts

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const camposValidados = EsquemaLogin.safeParse(credentials);
        if (!camposValidados.success) return null;

        const { email, password } = camposValidados.data;

        try {
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

          // Backend /auth/login devuelve: { access_token, usuario }
          // Retornamos un objeto que NextAuth usará como "user" inicial
          return {
            ...data.usuario,
            rol: data.usuario?.rol,
            id: data.usuario?.id,
            accessToken: data.access_token, // Guardamos el token JWT del backend
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 1. Lógica para Login con Google (Solo ocurre la primera vez tras loguearse)
      if (account?.provider === "google" && profile) {
        try {
          const respuesta = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: profile.email,
                nombreCompleto: profile.name,
                googleId: profile.sub,
                foto: profile.picture,
              }),
            },
          );

          if (respuesta.ok) {
            const dataBackend = await respuesta.json();
            // dataBackend puede ser { token: { access_token, usuario }, usuario } o { access_token, usuario }
            const maybeTokenObj = (dataBackend as any)?.token;
            const access =
              maybeTokenObj?.access_token ?? (dataBackend as any)?.access_token;
            token.accessToken = access;
            token.rol = (dataBackend as any)?.usuario?.rol ?? token.rol;
            token.id = (dataBackend as any)?.usuario?.id ?? token.id;
          } else {
            console.error("Fallo al autenticar Google con Backend");
            // Aquí podrías forzar un error o invalidar, pero por ahora logueamos
          }
        } catch (error) {
          console.error("Error conectando con backend (Google Login):", error);
        }
      }

      // 2. Lógica para Credenciales (user viene del return de authorize)
      if (user) {
        token.rol = user.rol;
        token.id = user.id;
        token.accessToken = user.accessToken; // Persistimos el token del backend en el JWT
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.rol = token.rol as string;
        session.user.id = token.id as string;
        // Exponer el token del backend a los componentes cliente/servidor de forma tipada
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
  },
});
