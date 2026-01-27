import { apiCliente } from "@/servicios/api-cliente";

type Premio = { id: number; nombre: string; costoPuntos: number };

export async function listarPremios(): Promise<Premio[]> {
  return apiCliente("/premios", { method: "GET" });
}

export async function crearPremio(data: Omit<Premio, "id">) {
  return apiCliente("/premios", { method: "POST", json: data });
}
