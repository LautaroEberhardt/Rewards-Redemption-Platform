import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { EsquemaLogin } from "@/components/auth/esquemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google, // Se configura auto con process.env.AUTH_GOOGLE_ID
    Credentials({
      async authorize(credentials) {
        const camposValidados = EsquemaLogin.safeParse(credentials);
        if (!camposValidados.success) return null;

        const { email, password } = camposValidados.data;

        // Login normal con credenciales
        const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasena: password }),
        });

        if (!respuesta.ok) return null;
        return await respuesta.json();
      },
    }),
  ],
  callbacks: {
    // 1. AQUÍ ESTÁ LA SOLUCIÓN: Interceptamos el login de Google
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          // Enviamos los datos de Google a TU Backend NestJS
          const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              nombreCompleto: profile?.name,
              googleId: profile?.sub, // 'sub' es el ID único de Google
              foto: profile?.picture,
            }),
          });

          if (!respuesta.ok) {
            console.error("Error al registrar usuario de Google en Backend");
            return false; // Esto deniega el login si el backend falla
          }

          const usuarioBackend = await respuesta.json();
          
          // Opcional: Si necesitas pasar el ROL del backend al token inmediatamente,
          // podrías guardarlo en una variable global o usar una estrategia más avanzada,
          // pero por ahora esto asegura que el usuario SE GUARDE en la BD.
          return true; 
        } catch (error) {
          console.error("Error de conexión con Backend:", error);
          return false;
        }
      }
      return true; // Para credenciales normales, dejamos pasar
    },

    // 2. Persistencia de Roles (Igual que antes)
    async jwt({ token, user, account }) {
      // Si es el primer login (cuando user está definido)
      if (user) {
        // @ts-expect-error (user viene con rol si es credentials, pero si es google viene del profile)
        token.rol = user.rol || "cliente"; 
        token.id = user.id;
      }
      
      // OPTIMIZACIÓN: Si venimos de Google, intentamos recuperar el rol si no está
      if (account?.provider === "google" && !token.rol) {
          // En una implementación real robusta, aquí podrías llamar al backend 
          // para pedir el rol actualizado del usuario recién creado.
          // Por simplicidad, asignamos 'cliente' o esperamos al próximo refresh.
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