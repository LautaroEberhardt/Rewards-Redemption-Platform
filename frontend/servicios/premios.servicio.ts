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
    // Normalizamos campos (urlImagen -> imagenUrl)
    return (datos as any[]).map((p) => ({
      id: Number(p.id),
      nombre: p.nombre,
      descripcion: p.descripcion ?? undefined,
      costoPuntos: Number(p.costoPuntos ?? p.costoEnPuntos ?? 0),
      imagenUrl: p.imagenUrl ?? p.urlImagen ?? undefined,
      activo: p.activo ?? undefined,
    }));
  } catch (error) {
    console.error("Error en listarPremios:", error);
    throw error;
  }
}

export async function crearPremio(
  payload: {
    nombre: string;
    costoPuntos: number;
    descripcion?: string;
    imagen?: File; // opcional: si se provee, se enviará como multipart/form-data
  },
  token?: string,
): Promise<Premio> {
  // Si hay imagen, usamos FormData (multipart). Si no, JSON.
  const usaMultipart = !!payload.imagen;
  const headers: HeadersInit = {};
  if (!usaMultipart) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit;
  if (usaMultipart) {
    const formData = new FormData();
    formData.append("nombre", payload.nombre);
    // compatibilidad con controladores que aceptan `costoPuntos` o `costo`
    formData.append("costoPuntos", String(payload.costoPuntos));
    formData.append("costo", String(payload.costoPuntos));
    if (payload.descripcion)
      formData.append("descripcion", payload.descripcion);
    if (payload.imagen) formData.append("imagen", payload.imagen);
    body = formData;
  } else {
    body = JSON.stringify({
      nombre: payload.nombre,
      titulo: payload.nombre, // compatibilidad
      costoPuntos: payload.costoPuntos,
      costo: payload.costoPuntos, // compatibilidad
      descripcion: payload.descripcion,
    });
  }

  const respuesta = await fetch(`${API_URL}/premios`, {
    method: "POST",
    headers,
    body,
  });
  if (!respuesta.ok) {
    const err = (await safeJson(respuesta)) as { message?: string } | null;
    throw new Error(err?.message || "Error al crear premio");
  }
  const p: any = await respuesta.json();
  return {
    id: Number(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion ?? undefined,
    costoPuntos: Number(p.costoPuntos ?? p.costoEnPuntos ?? 0),
    imagenUrl: p.imagenUrl ?? p.urlImagen ?? undefined,
    activo: p.activo ?? undefined,
  };
}

export async function actualizarPremio(
  id: number,
  payload: {
    nombre?: string;
    costoPuntos?: number;
    descripcion?: string;
    imagen?: File;
  },
  token?: string,
): Promise<Premio> {
  const usaMultipart = !!payload.imagen;
  const headers: HeadersInit = {};
  if (!usaMultipart) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit;
  if (usaMultipart) {
    const formData = new FormData();
    if (payload.nombre !== undefined) {
      formData.append("nombre", payload.nombre);
      formData.append("titulo", payload.nombre);
    }
    if (payload.costoPuntos !== undefined) {
      formData.append("costoPuntos", String(payload.costoPuntos));
      formData.append("costo", String(payload.costoPuntos));
    }
    if (payload.descripcion !== undefined) {
      formData.append("descripcion", payload.descripcion ?? "");
    }
    if (payload.imagen) {
      formData.append("imagen", payload.imagen);
    }
    body = formData;
  } else {
    body = JSON.stringify({
      ...(payload.nombre !== undefined
        ? { nombre: payload.nombre, titulo: payload.nombre }
        : {}),
      ...(payload.costoPuntos !== undefined
        ? { costoPuntos: payload.costoPuntos, costo: payload.costoPuntos }
        : {}),
      ...(payload.descripcion !== undefined
        ? { descripcion: payload.descripcion }
        : {}),
    });
  }

  // Intento con PATCH primero
  let respuesta = await fetch(`${API_URL}/premios/${id}`, {
    method: "PATCH",
    headers,
    body,
  });
  // Fallback a PUT si PATCH no está permitido
  if (!respuesta.ok && (respuesta.status === 404 || respuesta.status === 405)) {
    respuesta = await fetch(`${API_URL}/premios/${id}`, {
      method: "PUT",
      headers,
      body,
    });
  }
  if (!respuesta.ok) {
    const err = (await safeJson(respuesta)) as { message?: string } | null;
    throw new Error(
      err?.message || `Error al actualizar premio (status ${respuesta.status})`,
    );
  }
  const p: any = await respuesta.json();
  return {
    id: Number(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion ?? undefined,
    costoPuntos: Number(p.costoPuntos ?? p.costoEnPuntos ?? 0),
    imagenUrl: p.imagenUrl ?? p.urlImagen ?? undefined,
    activo: p.activo ?? undefined,
  };
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
