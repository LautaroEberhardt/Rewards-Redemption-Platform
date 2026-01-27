import { apiCliente } from "@/servicios/api-cliente";

type AsignarPuntosInput = { clienteId: string; puntos: number };

export async function asignarPuntos(payload: AsignarPuntosInput) {
  return apiCliente("/puntos/asignar", { method: "POST", json: payload });
}

export async function obtenerPuntosCliente(clienteId: string) {
  return apiCliente(`/puntos/${clienteId}`, { method: "GET" });
}
