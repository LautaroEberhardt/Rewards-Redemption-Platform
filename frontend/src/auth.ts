import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    // Patrón: Synchronization. Sincronizamos el usuario de Google con nuestro Backend NestJS
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const respuestaBackend = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              nombreCompleto: user.name,
              googleId: user.id,
              foto: user.image
            }),
          });
          
          if (!respuestaBackend.ok) return false; // Si falla el backend, rechazamos el login
          
          return true;
        } catch (error) {
          console.error("Error sincronizando con Backend:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
    async session({ session, token }) {
        if(token && session.user) {
            session.user.id = token.id as string;
        }
        return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", 
  }
});