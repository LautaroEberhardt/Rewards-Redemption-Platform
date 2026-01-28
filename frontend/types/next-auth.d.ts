import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extendemos la interfaz Session para incluir el token y el rol
   */
  interface Session {
    user: {
      id: string;
      rol: string;
      accessToken: string; // <--- AQUÍ declaramos que esto existirá
    } & DefaultSession["user"];
  }

  /**
   * Extendemos la interfaz User para recibir lo que venga del backend
   */
  interface User {
    id: string;
    rol: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extendemos el JWT para poder guardar el token dentro de él
   */
  interface JWT {
    id: string;
    rol: string;
    accessToken: string;
  }
}