import { apiCliente } from "@/servicios/api-cliente";

type AsignarPuntosInput = { clienteId: string; puntos: number };

export async function asignarPuntos(payload: AsignarPuntosInput) {
  return apiCliente("/puntos/asignar", { method: "POST", json: payload });
}

export async function obtenerPuntosCliente(clienteId: string) {
  return apiCliente(`/puntos/${clienteId}`, { method: "GET" });
}

// Objeto de servicio usado por formularios que manejan token manualmente
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const PuntosServicio = {
  asignar: async (
    usuarioId: string,
    cantidad: number,
    concepto: string,
    token: string,
  ) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(`${API_URL}/puntos/asignar`, {
      method: "POST",
      headers,
      body: JSON.stringify({ usuarioId, cantidad, concepto }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Error ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  },
};
