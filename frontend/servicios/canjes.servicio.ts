const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface RespuestaCanje {
  mensaje: string;
  canje: {
    id: string;
    estado: string;
    puntosGastados: number;
    fechaSolicitud: string;
  };
}

export interface CanjeCliente {
  id: string;
  estado: string;
  puntosGastados: number;
  fechaSolicitud: string;
  fechaEntrega: string | null;
  premio: {
    id: number;
    nombre: string;
    imagenUrl: string | null;
  } | null;
}

export interface CanjeAdmin {
  id: string;
  estado: string;
  puntosGastados: number;
  fechaSolicitud: string;
  fechaEntrega: string | null;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  } | null;
  premio: {
    id: number;
    nombre: string;
    imagenUrl: string | null;
  } | null;
}

export async function canjearPremio(
  premioId: number,
  token: string,
): Promise<RespuestaCanje> {
  const respuesta = await fetch(`${API_URL}/canjes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ premioId }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => null);
    const mensaje =
      (datos as { message?: string } | null)?.message ||
      "Error al procesar el canje.";
    throw new Error(mensaje);
  }

  return respuesta.json();
}

export async function obtenerMisCanjes(
  token: string,
): Promise<CanjeCliente[]> {
  const respuesta = await fetch(`${API_URL}/canjes/mis-canjes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!respuesta.ok) {
    throw new Error("Error al obtener los canjes.");
  }

  return respuesta.json();
}

/**
 * Lista todos los canjes para el administrador, con filtro opcional por estado.
 */
export async function listarCanjesAdmin(
  token: string,
  estado?: string,
): Promise<CanjeAdmin[]> {
  const params = estado ? `?estado=${estado}` : "";
  const respuesta = await fetch(`${API_URL}/canjes/admin${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!respuesta.ok) {
    throw new Error("Error al listar canjes.");
  }

  return respuesta.json();
}

/**
 * Cambia el estado de un canje (admin).
 */
export async function cambiarEstadoCanje(
  canjeId: string,
  estado: string,
  token: string,
): Promise<{ mensaje: string }> {
  const respuesta = await fetch(`${API_URL}/canjes/${canjeId}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => null);
    const mensaje =
      (datos as { message?: string } | null)?.message ||
      "Error al cambiar el estado del canje.";
    throw new Error(mensaje);
  }

  return respuesta.json();
}
