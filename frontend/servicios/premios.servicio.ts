import { apiCliente } from "./api-cliente";
import { TransaccionPuntosInterfaz } from "@/tipos/puntos";

export const PuntosServicio = {
  asignar: async (usuarioId: string, cantidad: number, concepto: string, token: string) => {
    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/puntos/asignar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          usuarioId,
          puntos: cantidad,
          concepto
        })
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || "Error al asignar puntos");
      }

      return await respuesta.json();
    } catch (error) {
      console.error("Error en PuntosServicio:", error);
      throw error;
    }
  }
};