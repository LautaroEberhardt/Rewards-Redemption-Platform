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
  obtenerPagina: async (
    pagina: number,
    limite: number,
    token?: string,
    busqueda?: string,
  ): Promise<{
    items: Usuario[];
    total: number;
    pagina: number;
    limite: number;
  }> => {
    try {
      const cabeceras: HeadersInit = { "Content-Type": "application/json" };
      if (token) cabeceras["Authorization"] = `Bearer ${token}`;

      const params = new URLSearchParams();
      params.set("pagina", String(pagina));
      params.set("limite", String(limite));
      if (busqueda && busqueda.trim().length > 0) {
        params.set("busqueda", busqueda.trim());
      }

      const respuesta = await fetch(
        `${API_URL}/usuarios?${params.toString()}`,
        {
          method: "GET",
          headers: cabeceras,
          cache: "no-store",
        },
      );
      if (!respuesta.ok) {
        let detalle: string | undefined;
        try {
          const data = await respuesta.json();
          detalle = (data as any)?.message || (data as any)?.error;
        } catch {
          // ignore
        }
        const base = `Error al obtener usuarios paginados (status ${respuesta.status})`;
        if (respuesta.status === 401)
          throw new Error(detalle || `${base}: sesión no válida o expirada.`);
        if (respuesta.status === 403)
          throw new Error(
            detalle || `${base}: permiso denegado (rol insuficiente).`,
          );
        throw new Error(detalle || base);
      }

      const datos = await respuesta.json();
      const items: Usuario[] = (datos.items as any[]).map((u: any) => ({
        id: String(u.id),
        email: u.email,
        nombre: u.nombre ?? u.nombreCompleto ?? "",
        rol: String(u.rol).toLowerCase() as Usuario["rol"],
        puntos:
          typeof u.puntos === "number"
            ? u.puntos
            : typeof u.saldoPuntosActual === "number"
              ? u.saldoPuntosActual
              : undefined,
      }));

      return {
        items,
        total: datos.total ?? items.length,
        pagina: datos.pagina ?? datos.page ?? pagina,
        limite: datos.limite ?? datos.limit ?? limite,
      };
    } catch (error) {
      console.error("Error en UsuariosServicio (paginado):", error);
      throw error;
    }
  },
};
