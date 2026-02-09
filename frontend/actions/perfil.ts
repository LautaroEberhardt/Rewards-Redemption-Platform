"use server";

import { auth } from "@/auth";
import type { Usuario } from "@/tipos/usuario";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** Normaliza la respuesta cruda del backend a nuestro tipo Usuario */
function normalizar(u: Record<string, unknown>): Usuario {
  return {
    id: String(u.id),
    email: String(u.email ?? ""),
    nombre: String(u.nombre ?? u.nombreCompleto ?? ""),
    rol: String(u.rol ?? "cliente").toLowerCase() as Usuario["rol"],
    puntos:
      typeof u.puntos === "number"
        ? u.puntos
        : typeof u.saldoPuntosActual === "number"
          ? u.saldoPuntosActual
          : undefined,
    telefono: u.telefono ? String(u.telefono) : undefined,
    foto: u.foto ? String(u.foto) : undefined,
    fechaCreacion: u.fechaCreacion ? String(u.fechaCreacion) : undefined,
    fechaActualizacion: u.fechaActualizacion
      ? String(u.fechaActualizacion)
      : undefined,
  };
}

/**
 * Obtiene el perfil del usuario autenticado.
 * Ejecuta server-side → accede al token via auth() sin depender de la sesión del cliente.
 */
export async function obtenerPerfilAction(): Promise<
  { ok: true; usuario: Usuario } | { ok: false; error: string }
> {
  const sesion = await auth();

  if (!sesion?.user) {
    return { ok: false, error: "No hay sesión activa." };
  }

  const token = sesion.user.accessToken;
  if (!token) {
    // Fallback: retornar los datos básicos que ya tenemos de la sesión
    return {
      ok: true,
      usuario: {
        id: sesion.user.id ?? "",
        nombre: sesion.user.name ?? "",
        email: sesion.user.email ?? "",
        rol: (sesion.user.rol?.toLowerCase() as Usuario["rol"]) ?? "cliente",
        foto: sesion.user.image ?? undefined,
      },
    };
  }

  try {
    const res = await fetch(`${API_URL}/usuarios/perfil`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const d = await res.json().catch(() => null);
      const msg =
        (d as Record<string, unknown>)?.message ??
        `Error del servidor (${res.status})`;
      return { ok: false, error: String(msg) };
    }

    const data = (await res.json()) as Record<string, unknown>;
    return { ok: true, usuario: normalizar(data) };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Error de conexión con el servidor.",
    };
  }
}

/**
 * Actualiza el perfil (nombre, teléfono) del usuario autenticado.
 */
export async function actualizarPerfilAction(datos: {
  nombre?: string;
  telefono?: string;
}): Promise<{ ok: true; usuario: Usuario } | { ok: false; error: string }> {
  const sesion = await auth();

  if (!sesion?.user) {
    return { ok: false, error: "No hay sesión activa." };
  }

  const token = sesion.user.accessToken;
  if (!token) {
    return {
      ok: false,
      error:
        "No se encontró un token de sesión. Cerrá sesión e ingresá de nuevo.",
    };
  }

  const { nombre, ...resto } = datos;
  const payload: Record<string, unknown> = { ...resto };
  if (nombre !== undefined) payload.nombreCompleto = nombre;

  try {
    const res = await fetch(`${API_URL}/usuarios/perfil`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const d = await res.json().catch(() => null);
      const msg =
        (d as Record<string, unknown>)?.message ??
        `Error al actualizar (${res.status})`;
      return { ok: false, error: String(msg) };
    }

    const data = (await res.json()) as Record<string, unknown>;
    return { ok: true, usuario: normalizar(data) };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Error de conexión con el servidor.",
    };
  }
}
