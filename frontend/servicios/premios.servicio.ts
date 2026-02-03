import { Premio } from "@/tipos/premio";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Clase de error específica eliminada por no utilizarse actualmente

export async function listarPremios(token?: string): Promise<Premio[]> {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const respuesta = await fetch(`${API_URL}/premios`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!respuesta.ok) {
      throw new Error("Error al listar premios");
    }

    const datos: unknown = await respuesta.json();
    if (!Array.isArray(datos)) {
      throw new Error("Formato inválido de respuesta de premios");
    }
    // Confiamos en el contrato compartido de Premio
    return datos as Premio[];
  } catch (error) {
    console.error("Error en listarPremios:", error);
    throw error;
  }
}

export async function crearPremio(
  payload: { nombre: string; costoPuntos: number; descripcion?: string },
  token?: string,
): Promise<Premio> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const cuerpo = {
    nombre: payload.nombre,
    titulo: payload.nombre, // compatibilidad
    costoPuntos: payload.costoPuntos,
    costo: payload.costoPuntos, // compatibilidad
    descripcion: payload.descripcion,
  };

  const respuesta = await fetch(`${API_URL}/premios`, {
    method: "POST",
    headers,
    body: JSON.stringify(cuerpo),
  });
  if (!respuesta.ok) {
    const err = (await safeJson(respuesta)) as { message?: string } | null;
    throw new Error(err?.message || "Error al crear premio");
  }
  const data: Premio = await respuesta.json();
  return data;
}

export async function actualizarPremio(
  id: number,
  payload: { nombre?: string; costoPuntos?: number; descripcion?: string },
  token?: string,
): Promise<Premio> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const cuerpo = {
    ...(payload.nombre !== undefined
      ? { nombre: payload.nombre, titulo: payload.nombre }
      : {}),
    ...(payload.costoPuntos !== undefined
      ? { costoPuntos: payload.costoPuntos, costo: payload.costoPuntos }
      : {}),
    ...(payload.descripcion !== undefined
      ? { descripcion: payload.descripcion }
      : {}),
  };

  // Intento con PATCH primero (más común en APIs REST para updates)
  let respuesta = await fetch(`${API_URL}/premios/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(cuerpo),
  });
  // Si el backend no soporta PATCH, probamos con PUT
  if (!respuesta.ok && (respuesta.status === 404 || respuesta.status === 405)) {
    respuesta = await fetch(`${API_URL}/premios/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(cuerpo),
    });
  }
  if (!respuesta.ok) {
    const err = (await safeJson(respuesta)) as { message?: string } | null;
    throw new Error(
      err?.message || `Error al actualizar premio (status ${respuesta.status})`,
    );
  }
  const data: Premio = await respuesta.json();
  return data;
}

export async function eliminarPremio(
  id: number,
  token?: string,
): Promise<void> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const respuesta = await fetch(`${API_URL}/premios/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!respuesta.ok) {
    const err = (await safeJson(respuesta)) as { message?: string } | null;
    throw new Error(err?.message || "Error al eliminar premio");
  }
}

async function safeJson(res: Response): Promise<unknown | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
