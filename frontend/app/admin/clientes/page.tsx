"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Boton } from "@/components/ui/boton";
import { TablaClientes } from "@/components/admin/clientes/TablaClientes";
import { ModalEditarUsuario } from "@/components/admin/clientes/ModalEditarUsuario";
import { UsuariosServicio } from "@/servicios/usuarios.servicio";
import type { Usuario } from "@/tipos/usuario";

const LIMITE_POR_PAGINA = 10;

export default function PageClientes() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const paginaActual = Number(searchParams.get("pagina") ?? "1") || 1;
  const busquedaActual = searchParams.get("busqueda") ?? "";

  const [busquedaInput, setBusquedaInput] = useState<string>(busquedaActual);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [cargandoEdicion, setCargandoEdicion] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null);

  const token = session?.user?.accessToken;

  const manejarBusqueda = useCallback(
    (termino: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (termino) {
        params.set("busqueda", termino);
        params.set("pagina", "1");
      } else {
        params.delete("busqueda");
        params.delete("pagina");
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams],
  );

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1) return;
    const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_POR_PAGINA));
    if (nuevaPagina > totalPaginas) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", String(nuevaPagina));
    replace(`${pathname}?${params.toString()}`);
  };

  const abrirEdicionUsuario = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    setErrorEdicion(null);
    setModalEditarAbierto(true);
  };

  const cerrarEdicionUsuario = () => {
    setModalEditarAbierto(false);
    setUsuarioEditar(null);
    setErrorEdicion(null);
  };

  const guardarUsuarioEditado = async ({
    nombre,
    email,
    telefono,
  }: {
    nombre: string;
    email: string;
    telefono: string;
  }) => {
    if (!usuarioEditar) return;
    if (!token) {
      setErrorEdicion("No hay token de sesión para actualizar el usuario");
      return;
    }

    try {
      setCargandoEdicion(true);
      setErrorEdicion(null);
      // No enviar email si la cuenta es de Google (protección)
      const datosActualizar: {
        nombre?: string;
        email?: string;
        telefono?: string;
      } = {
        nombre,
        telefono,
      };
      if (!usuarioEditar.googleId) {
        datosActualizar.email = email;
      }

      const actualizado = await UsuariosServicio.actualizar(
        usuarioEditar.id,
        datosActualizar,
        token,
      );

      setUsuarios((prev) =>
        prev.map((u) => (u.id === actualizado.id ? actualizado : u)),
      );
      cerrarEdicionUsuario();
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "Error al actualizar usuario";
      setErrorEdicion(mensaje);
    } finally {
      setCargandoEdicion(false);
    }
  };

  useEffect(() => {
    // Sin sesión todavía o sin token, no intentamos cargar
    if (!token || status === "loading") return;

    let cancelado = false;

    const cargar = async () => {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await UsuariosServicio.obtenerPagina(
          paginaActual,
          LIMITE_POR_PAGINA,
          token,
          busquedaActual || undefined,
        );

        if (cancelado) return;

        setUsuarios(respuesta.items);
        setTotal(respuesta.total);
      } catch (error) {
        if (cancelado) return;
        const mensaje =
          error instanceof Error ? error.message : "Error al cargar usuarios";
        setError(mensaje);
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargar();

    return () => {
      cancelado = true;
    };
  }, [token, status, paginaActual, busquedaActual]);

  // Debounce para la búsqueda: dispara automáticamente 500ms después de dejar de escribir
  useEffect(() => {
    const termino = busquedaInput.trim();

    // Si el valor del input ya coincide con el de la URL, no hacemos nada
    if (termino === (busquedaActual ?? "").trim()) {
      return;
    }

    const handler = setTimeout(() => {
      manejarBusqueda(termino);
    }, 500);

    return () => clearTimeout(handler);
  }, [busquedaInput, busquedaActual, manejarBusqueda]);

  // Sin sesión (por ejemplo, no logueado)
  if (status === "unauthenticated") {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Acceso restringido</h1>
        <p className="text-sm text-gray-600">
          Debes iniciar sesión para ver la lista de clientes.
        </p>
      </div>
    );
  }

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_POR_PAGINA));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <p className="text-sm text-gray-600">
          Modificación y datos de usuarios del sistema.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                manejarBusqueda(busquedaInput.trim());
              }
            }}
            placeholder="Buscar por nombre o email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Boton
            type="button"
            onClick={() => manejarBusqueda(busquedaInput.trim())}
            variante="secundario"
          >
            Buscar
          </Boton>
        </div>
        {busquedaActual && (
          <Boton
            type="button"
            onClick={() => {
              setBusquedaInput("");
              manejarBusqueda("");
            }}
            variante="primario"
          >
            Limpiar búsqueda
          </Boton>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="text-sm text-gray-600">Cargando clientes...</p>
      ) : (
        <TablaClientes usuarios={usuarios} onEditar={abrirEdicionUsuario} />
      )}

      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>
          Página {paginaActual} de {totalPaginas} ({total} usuarios)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual <= 1}
            className="rounded-md border border-gray-300 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual >= totalPaginas}
            className="rounded-md border border-gray-300 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>

      <ModalEditarUsuario
        usuario={usuarioEditar}
        abierto={modalEditarAbierto}
        cargando={cargandoEdicion}
        error={errorEdicion}
        onClose={cerrarEdicionUsuario}
        onSave={guardarUsuarioEditado}
      />
    </div>
  );
}
