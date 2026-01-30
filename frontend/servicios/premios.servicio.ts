// import { apiCliente } from "./api-cliente";
// import { TransaccionPuntosInterfaz } from "@/tipos/puntos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Premio = { id: number; nombre: string; costoPuntos: number };
type PremioBackend = {
  id: number | string;
  nombre?: string;
  titulo?: string;
  costoPuntos?: number;
  costo?: number;
};

export const PuntosServicio = {
  asignar: async (
    usuarioId: string,
    cantidad: number,
    concepto: string,
    token: string,
  ) => {
    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/puntos/asignar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            usuarioId,
            cantidad,
            concepto,
          }),
        },
      );

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || "Error al asignar puntos");
      }

      return await respuesta.json();
    } catch (error) {
      console.error("Error en PuntosServicio:", error);
      throw error;
    }
  },
};

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
    // Normalización defensiva por si el backend usa otro nombre de campo
    const premios: Premio[] = (datos as PremioBackend[]).map((p) => ({
      id: Number(p.id),
      nombre: p.nombre ?? p.titulo ?? "",
      costoPuntos:
        typeof p.costoPuntos === "number"
          ? p.costoPuntos
          : typeof p.costo === "number"
            ? p.costo
            : 0,
    }));

    return premios;
  } catch (error) {
    console.error("Error en listarPremios:", error);
    throw error;
  }
}
