const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface RespuestaCanje {
  mensaje: string;
  canje: {
    id: string;
    codigoVerificacion: string;
    estado: string;
    puntosGastados: number;
    fechaSolicitud: string;
  };
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
