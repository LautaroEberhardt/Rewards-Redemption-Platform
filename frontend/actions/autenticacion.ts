'use server';

import { signIn } from "@/src/auth";
import { AuthError } from "next-auth";
import { FormularioRegistroDatos } from "@/components/auth/esquemas";

/**
 * Función auxiliar para detectar si un error es en realidad una redirección exitosa de Next.js
 */
function isRedirectError(error: unknown) {
  if (typeof error === 'object' && error !== null) {
    const msg = (error as { message?: string }).message;
    const digest = (error as { digest?: string }).digest;
    
    // Verificamos las distintas formas en que Next.js lanza la redirección
    return (
      msg === 'NEXT_REDIRECT' || 
      msg?.includes('NEXT_REDIRECT') ||
      digest?.startsWith('NEXT_REDIRECT')
    );
  }
  return false;
}

export async function iniciarSesionConGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function registrarUsuario(datos: FormularioRegistroDatos) {
  const { confirmarContrasena, ...datosParaBackend } = datos;

  // ---------------------------------------------------------
  // PASO 1: REGISTRO EN NESTJS (Backend)
  // ---------------------------------------------------------
  try {
    const respuestaBackend = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosParaBackend),
    });

    if (!respuestaBackend.ok) {
      const errorData = await respuestaBackend.json();
      return { error: errorData.message || "Error al crear el usuario en el sistema." };
    }
  } catch (error) {
    console.error("Error backend:", error);
    return { error: "No hay conexión con el servidor de registro." };
  }

  // ---------------------------------------------------------
  // PASO 2: INICIO DE SESIÓN AUTOMÁTICO (NextAuth)
  // ---------------------------------------------------------
  try {
    // Si llegamos aquí, el usuario YA SE CREÓ. Intentamos loguearlo.
    await signIn("credentials", {
      email: datos.email,
      password: datos.contrasena, // Mapeamos 'contrasena' a 'password' para NextAuth
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // CRÍTICO: Si detectamos que es una redirección, LA LANZAMOS para que Next.js cambie de página
    if (isRedirectError(error)) {
      throw error;
    }

    // Si es un error real de autenticación (ej: fallo de hash raro), lo manejamos
    if (error instanceof AuthError) {
      return { error: "Cuenta creada exitosamente, pero falló el inicio de sesión automático. Por favor ingresa manualmente." };
    }

    // Cualquier otro error desconocido
    return { error: "Ocurrió un error inesperado al iniciar sesión." };
  }
}