"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

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

  const token = (session?.user as any)?.token as string | undefined;

  const manejarBusqueda = (termino: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (termino) {
      params.set("busqueda", termino);
      params.set("pagina", "1");
    } else {
      params.delete("busqueda");
      params.delete("pagina");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1) return;
    const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_POR_PAGINA));
    if (nuevaPagina > totalPaginas) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", String(nuevaPagina));
    replace(`${pathname}?${params.toString()}`);
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
      } catch (e: any) {
        if (cancelado) return;
        setError(e?.message ?? "Error al cargar usuarios");
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargar();

    return () => {
      cancelado = true;
    };
  }, [token, status, paginaActual, busquedaActual]);

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
          <button
            type="button"
            onClick={() => manejarBusqueda(busquedaInput.trim())}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Buscar
          </button>
        </div>
        {busquedaActual && (
          <button
            type="button"
            onClick={() => {
              setBusquedaInput("");
              manejarBusqueda("");
            }}
            className="text-xs text-gray-600 hover:underline self-start sm:self-auto"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="text-sm text-gray-600">Cargando clientes...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-sm text-gray-600">
          No se encontraron usuarios con los criterios actuales.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Email
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Rol
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-700">
                  Puntos
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{u.nombre}</td>
                  <td className="px-3 py-2 text-gray-700">{u.email}</td>
                  <td className="px-3 py-2 capitalize">{u.rol}</td>
                  <td className="px-3 py-2 text-right">
                    {typeof u.puntos === "number" ? u.puntos : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}
