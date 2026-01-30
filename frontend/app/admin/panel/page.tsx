"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UsuariosServicio } from "@/servicios/usuarios.servicio";
import { Usuario } from "@/tipos/usuario";
import { ModalAsignarPuntos } from "@/components/admin/asignacion/FormularioAsignarPuntos";
import { Boton } from "@/components/ui/boton";

// --- Componentes UI Locales (Iconos SVG puros para no depender de librerías externas) ---
const IconoUsuario = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const IconoPuntos = () => (
  <svg
    className="h-4 w-4 mr-1 text-emerald-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function PaginaPanelAdmin() {
  const { data: sesion } = useSession();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagina, setPagina] = useState(1);
  const TAMANIO_PAGINA = 8;
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  // Refetch: cargar clientes (reutilizable)
  const cargarClientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const token =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.user?.token ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.accessToken ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.backendToken;

      if (!token) {
        setError("No autorizado: falta token de sesión.");
        return;
      }
      const resp = await UsuariosServicio.obtenerPagina(
        pagina,
        TAMANIO_PAGINA,
        token,
      );
      const soloClientes = resp.items.filter((u) => u.rol === "cliente");
      setUsuarios(soloClientes);
      setTotalUsuarios(resp.total);
    } catch (err) {
      setError("No se pudieron cargar los clientes.");
    } finally {
      setCargando(false);
    }
  };

  // Función para abrir el modal desde la tabla
  const abrirModalAsignacion = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(true);
  };

  const refrescarDatos = () => {
    setCargando(true);
  };

  useEffect(() => {
    cargarClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion, pagina]);

  const totalPaginas = Math.max(1, Math.ceil(totalUsuarios / TAMANIO_PAGINA));
  const inicio = (pagina - 1) * TAMANIO_PAGINA;
  const fin = Math.min(inicio + TAMANIO_PAGINA, totalUsuarios);

  // Si cambia la cantidad de usuarios, re-clamp de página
  useEffect(() => {
    const nuevasTotal = Math.max(1, Math.ceil(totalUsuarios / TAMANIO_PAGINA));
    if (pagina > nuevasTotal) setPagina(nuevasTotal);
  }, [totalUsuarios]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 flex flex-col">
      {/* Encabezado fijo (no scrollea) */}
      <div className="md:flex md:items-center md:justify-between shrink-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-color-primary text-2xl font-bold leading-7 sm:truncate sm:text-3xl">
            Panel de clientes
          </h2>
        </div>
        {/* ... botón nuevo cliente ... */}
      </div>

      <section className="flex-1 min-h-0">
        {cargando ? (
          <SkeletonTabla />
        ) : error ? (
          <EstadoError mensaje={error} />
        ) : usuarios.length === 0 ? (
          <EstadoVacio />
        ) : (
          <div className="flex flex-col rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            {/* Contenedor principal de la tabla (sin scroll vertical) */}
            <div className="relative">
              <TablaClientesModerna
                usuarios={usuarios}
                onAsignar={abrirModalAsignacion}
              />
            </div>

            {/* Footer de la tabla (Preparado para Paginación futura) */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 shrink-0">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Mostrando {totalUsuarios === 0 ? 0 : inicio + 1}-
                  {inicio + usuarios.length} de {totalUsuarios} clientes ·
                  Página {pagina} de {totalPaginas}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className={`px-2 py-1 rounded border bg-white ${
                      pagina === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() =>
                      setPagina((p) => Math.min(totalPaginas, p + 1))
                    }
                    disabled={pagina === totalPaginas}
                    className={`px-2 py-1 rounded border bg-white ${
                      pagina === totalPaginas
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {usuarioSeleccionado && (
        <ModalAsignarPuntos
          usuario={usuarioSeleccionado}
          estaAbierto={modalAbierto}
          alCerrar={() => {
            setModalAbierto(false);
            setUsuarioSeleccionado(null);
          }}
          alCompletar={() => {
            setModalAbierto(false);
            // Refrescar la tabla automáticamente después de asignar puntos
            cargarClientes();
          }}
        />
      )}
    </div>
  );
}

// --- Componentes de Presentación (UI) ---

type TablaProps = { usuarios: Usuario[]; onAsignar: (u: Usuario) => void };

function TablaClientesModerna({ usuarios, onAsignar }: TablaProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      {/* CAMBIO CLAVE: sticky top-0 z-10 
          Esto hace que el encabezado se quede fijo al hacer scroll vertical 
      */}
      <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50"
          >
            Cliente
          </th>
          {/* Ocultamos columna Estado en móvil para ahorrar espacio (hidden sm:table-cell) */}
          <th
            scope="col"
            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell bg-gray-50"
          >
            Estado
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50"
          >
            Cant. Puntos
          </th>
          <th scope="col" className="relative px-6 py-4 bg-gray-50">
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {usuarios.map((usuario) => (
          <tr
            key={usuario.id}
            className="hover:bg-gray-50 transition-colors group"
          >
            <td className="px-6 py-4 whitespace-nowrap">
              {/* ... contenido celda cliente ... */}
              <div className="flex items-center">
                <div className="h-10 w-10 shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
                    {usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">
                    {usuario.nombre}
                  </div>
                  <div className="text-sm text-gray-500">{usuario.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Activo
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {/* ... contenido celda puntos ... */}
              <div className="flex items-center text-sm text-gray-900 font-medium">
                {/* IconoPuntos SVG aqui */}
                <span className="text-emerald-600 mr-1">●</span>
                {usuario.puntos ?? 0} pts
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <Boton
                onClick={() => onAsignar(usuario)}
                className="text-indigo-600  font-semibold"
                variante="secundario"
              >
                Asignar Puntos
              </Boton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Componentes de Estado (Loading / Error / Empty) ---

function SkeletonTabla() {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-100 border-b border-gray-200" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <div className="rounded-lg bg-red-50 p-6 text-center border border-red-100">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-3">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-red-800">Error al cargar</h3>
      <p className="mt-1 text-sm text-red-600">{mensaje}</p>
    </div>
  );
}

function EstadoVacio() {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No hay clientes
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Comienza registrando un nuevo cliente en el sistema.
      </p>
    </div>
  );
}
