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
        correo: u.correo,
        nombre: u.nombre ?? u.nombreCompleto ?? "",
        rol: String(u.rol).toLowerCase() as Usuario["rol"],
        puntos: typeof u.puntos === "number" ? u.puntos : undefined,
        telefono: u.telefono ?? undefined,
        foto: u.foto ?? undefined,
        googleId: u.googleId ?? undefined,
        fechaCreacion: u.fechaCreacion ?? undefined,
        fechaActualizacion: u.fechaActualizacion ?? undefined,
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
        correo: u.correo,
        nombre: u.nombre ?? u.nombreCompleto ?? "",
        rol: String(u.rol).toLowerCase() as Usuario["rol"],
        puntos:
          typeof u.puntos === "number"
            ? u.puntos
            : typeof u.saldoPuntosActual === "number"
              ? u.saldoPuntosActual
              : undefined,
        telefono: u.telefono ?? undefined,
        foto: u.foto ?? undefined,
        googleId: u.googleId ?? undefined,
        fechaCreacion: u.fechaCreacion ?? undefined,
        fechaActualizacion: u.fechaActualizacion ?? undefined,
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
  actualizar: async (
    id: string,
    datos: {
      nombre?: string;
      email?: string;
      telefono?: string;
    },
    token?: string,
  ): Promise<Usuario> => {
    const cabeceras: HeadersInit = { "Content-Type": "application/json" };
    if (token) cabeceras["Authorization"] = `Bearer ${token}`;

    // El backend espera "nombreCompleto", no "nombre"
    const { nombre, ...resto } = datos;
    const payload: Record<string, unknown> = { ...resto };
    if (nombre !== undefined) payload.nombreCompleto = nombre;
    const body = JSON.stringify(payload);

    let respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PATCH",
      headers: cabeceras,
      body,
    });

    if (
      !respuesta.ok &&
      (respuesta.status === 404 || respuesta.status === 405)
    ) {
      respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: cabeceras,
        body,
      });
    }

    if (!respuesta.ok) {
      let detalle: string | undefined;
      try {
        const data = await respuesta.json();
        detalle = (data as any)?.message || (data as any)?.error;
      } catch {
        // ignore
      }
      const base = `Error al actualizar usuario (status ${respuesta.status})`;
      throw new Error(detalle || base);
    }

    const u: any = await respuesta.json();
    const usuario: Usuario = {
      id: String(u.id),
      correo: u.correo,
      nombre: u.nombre ?? u.nombreCompleto ?? "",
      rol: String(u.rol).toLowerCase() as Usuario["rol"],
      puntos:
        typeof u.puntos === "number"
          ? u.puntos
          : typeof u.saldoPuntosActual === "number"
            ? u.saldoPuntosActual
            : undefined,
      telefono: u.telefono ?? undefined,
      foto: u.foto ?? undefined,
      googleId: u.googleId ?? undefined,
      fechaCreacion: u.fechaCreacion ?? undefined,
      fechaActualizacion: u.fechaActualizacion ?? undefined,
    };

    return usuario;
  },

  /** Obtiene el perfil del usuario autenticado (GET /usuarios/perfil) */
  obtenerPerfil: async (token: string): Promise<Usuario> => {
    const respuesta = await fetch(`${API_URL}/usuarios/perfil`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!respuesta.ok) {
      let detalle: string | undefined;
      try {
        const d = await respuesta.json();
        detalle = (d as any)?.message || (d as any)?.error;
      } catch {
        /* ignore */
      }
      throw new Error(
        detalle || `Error al obtener perfil (status ${respuesta.status})`,
      );
    }

    const u: any = await respuesta.json();
    return {
      id: String(u.id),
      correo: u.correo,
      nombre: u.nombre ?? u.nombreCompleto ?? "",
      rol: String(u.rol).toLowerCase() as Usuario["rol"],
      puntos:
        typeof u.puntos === "number"
          ? u.puntos
          : typeof u.saldoPuntosActual === "number"
            ? u.saldoPuntosActual
            : undefined,
      telefono: u.telefono ?? undefined,
      foto: u.foto ?? undefined,
      fechaCreacion: u.fechaCreacion ?? undefined,
      fechaActualizacion: u.fechaActualizacion ?? undefined,
    };
  },

  /** Actualiza el perfil del usuario autenticado (PATCH /usuarios/perfil) */
  actualizarPerfil: async (
    datos: { nombre?: string; telefono?: string },
    token: string,
  ): Promise<Usuario> => {
    const { nombre, ...resto } = datos;
    const payload: Record<string, unknown> = { ...resto };
    if (nombre !== undefined) payload.nombreCompleto = nombre;

    const respuesta = await fetch(`${API_URL}/usuarios/perfil`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!respuesta.ok) {
      let detalle: string | undefined;
      try {
        const d = await respuesta.json();
        detalle = (d as any)?.message || (d as any)?.error;
      } catch {
        /* ignore */
      }
      throw new Error(
        detalle || `Error al actualizar perfil (status ${respuesta.status})`,
      );
    }

    const u: any = await respuesta.json();
    return {
      id: String(u.id),
      correo: u.correo,
      nombre: u.nombre ?? u.nombreCompleto ?? "",
      rol: String(u.rol).toLowerCase() as Usuario["rol"],
      puntos:
        typeof u.puntos === "number"
          ? u.puntos
          : typeof u.saldoPuntosActual === "number"
            ? u.saldoPuntosActual
            : undefined,
      telefono: u.telefono ?? undefined,
      foto: u.foto ?? undefined,
      fechaCreacion: u.fechaCreacion ?? undefined,
      fechaActualizacion: u.fechaActualizacion ?? undefined,
    };
  },
};
