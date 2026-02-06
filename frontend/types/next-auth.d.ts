import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // Extendemos la sesión para que los componentes conozcan el token del backend
  interface Session {
    user: {
      id: string;
      rol: string;
      accessToken: string;
      role?: string;
      roles?: string[];
    } & DefaultSession["user"];
  }

  // Usuario base que devolvemos desde authorize / backend
  interface User {
    id: string;
    rol: string;
    accessToken: string;
    role?: string;
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  // Lo que guardamos en el JWT interno de NextAuth
  interface JWT {
    id: string;
    rol: string;
    accessToken: string;
    role?: string;
    roles?: string[];
  }
}
