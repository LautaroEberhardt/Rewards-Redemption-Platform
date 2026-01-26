'use server';

import { signIn } from '@/src/auth';

/**
 * Inicia el flujo de autenticación con Google.
 * Patrón: Facade / Server Action para ocultar la complejidad de NextAuth al cliente.
 */
export async function iniciarSesionConGoogle() {
  // 'redirectTo' define a dónde ir después de un login exitoso
  await signIn("google", { redirectTo: "/dashboard" });
}