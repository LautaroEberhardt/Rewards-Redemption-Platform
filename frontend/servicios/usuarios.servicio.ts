import { Usuario } from "@/tipos/usuario";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const UsuariosServicio = {
  obtenerTodos: async (token?: string): Promise<Usuario[]> => {
    try {
      const cabeceras: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        cabeceras["Authorization"] = `Bearer ${token}`;
      }

      const respuesta = await fetch(`${API_URL}/usuarios`, {
        method: "GET",
        headers: cabeceras,
        cache: "no-store",
      });

      if (!respuesta.ok) {
        throw new Error("Error al obtener usuarios");
      }

      const datos = await respuesta.json();
      // Normalizamos estructura y rol proveniente del backend (ADMIN/CLIENTE -> admin/cliente)
      const normalizados: Usuario[] = (datos as any[]).map((u: any) => ({
        id: String(u.id),
        email: u.email,
        nombre: u.nombre ?? u.nombreCompleto ?? "",
        rol: String(u.rol).toLowerCase() as Usuario["rol"],
        puntos: typeof u.puntos === "number" ? u.puntos : undefined,
      }));

      return normalizados;
    } catch (error) {
      console.error("Error en UsuariosServicio:", error);
      throw error;
    }
  },
};
