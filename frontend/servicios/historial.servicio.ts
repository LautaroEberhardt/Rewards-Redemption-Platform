const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type TipoTransaccion = "INGRESO" | "EGRESO";

export interface TransaccionPuntos {
  id: string;
  cantidad: number;
  tipo: TipoTransaccion;
  concepto: string;
  saldoAnterior: number;
  saldoNuevo: number;
  fecha: string;
}

export interface RespuestaHistorial {
  datos: TransaccionPuntos[];
  total: number;
  pagina: number;
}

export async function obtenerHistorialPuntos(
  token: string,
  pagina: number = 1,
  limite: number = 20,
): Promise<RespuestaHistorial> {
  const respuesta = await fetch(
    `${API_URL}/puntos/historial?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => null);
    const mensaje =
      (datos as { message?: string } | null)?.message ||
      "Error al obtener el historial de puntos.";
    throw new Error(mensaje);
  }

  return respuesta.json() as Promise<RespuestaHistorial>;
}
