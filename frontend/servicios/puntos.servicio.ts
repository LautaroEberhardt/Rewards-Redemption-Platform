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
      // Intentar obtener un mensaje amigable desde la respuesta
      let mensaje = "No se pudo completar la operación. Intenta nuevamente.";
      try {
        const data = await res.json();
        const original = (data?.message ?? "").toString().toLowerCase();
        if (original.includes("saldo negativo")) {
          mensaje =
            "Saldo insuficiente: no puedes retirar más puntos de los disponibles.";
        } else if (original.includes("no autorizado") || res.status === 401) {
          mensaje = "Sesión no válida. Vuelve a iniciar sesión.";
        } else if (original) {
          // Usa el mensaje del backend si existe, pero sin detalles técnicos
          mensaje = data.message;
        }
      } catch {
        // si la respuesta no es JSON, usar un texto genérico
      }
      throw new Error(mensaje);
    }
    return res.json();
  },
};
