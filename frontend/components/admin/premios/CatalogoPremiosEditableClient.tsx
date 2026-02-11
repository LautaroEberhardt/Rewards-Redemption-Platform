"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import { TarjetaPremio } from "@/components/ui/TarjetaModulo";
import {
  Pencil,
  Trash,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  X,
} from "lucide-react";
import { EditorTarjetaPremioOverlay } from "@/components/admin/premios/EditorTarjetaPremioOverlay";
import {
  crearPremio,
  actualizarPremio,
  eliminarPremio,
  listarPremiosAdmin,
  cambiarEstadoPremio,
} from "@/servicios/premios.servicio";

type PremioUI = {
  id: number;
  nombre: string;
  descripcion: string;
  costoPuntos: number;
  imagenUrl?: string;
  activo?: boolean;
};

type Props = {
  premios: PremioUI[];
  crearNuevo?: boolean;
};

export function CatalogoPremiosEditableClient({ premios, crearNuevo }: Props) {
  const { data: sesion } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  const token = sesion?.user?.accessToken;

  const [lista, setLista] = useState<PremioUI[]>(premios);
  const [premioAEliminar, setPremioAEliminar] = useState<PremioUI | null>(null);
  const [overlayPremio, setOverlayPremio] = useState<PremioUI | null>(
    crearNuevo
      ? {
          id: 0,
          nombre: "Nuevo premio",
          descripcion: "Describe el premio...",
          costoPuntos: 0,
        }
      : null,
  );

  // Cargar premios con estado activo desde el backend (admin)
  useEffect(() => {
    if (!token) return;
    listarPremiosAdmin(token)
      .then((data) => {
        setLista(
          data.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion ?? "",
            costoPuntos: p.costoPuntos,
            imagenUrl: p.imagenUrl,
            activo: p.activo ?? true,
          })),
        );
      })
      .catch(() => {
        // Si falla, mantener los premios pasados por props
      });
  }, [token]);

  // Si el query param `crear=1` cambia después del primer render,
  // abrimos el overlay de creación de manera reactiva.
  const crearNuevoPrevio = useRef(crearNuevo);
  useEffect(() => {
    // Solo abrir si crearNuevo cambió de false a true (no en el montaje inicial)
    if (crearNuevo && !crearNuevoPrevio.current && !overlayPremio) {
      // Usar setTimeout para evitar el setState síncrono dentro del effect
      const timeout = setTimeout(() => {
        setOverlayPremio({
          id: 0,
          nombre: "Nuevo premio",
          descripcion: "Describe el premio...",
          costoPuntos: 0,
        });
      }, 0);
      return () => clearTimeout(timeout);
    }
    crearNuevoPrevio.current = crearNuevo;
  }, [crearNuevo, overlayPremio]);

  const abrirOverlay = (p: PremioUI) => setOverlayPremio(p);
  const cerrarOverlay = () => {
    setOverlayPremio(null);
    // Limpiar el query param `crear=1` para permitir re-apertura en clicks siguientes
    const isCrear = urlParams.get("crear") === "1";
    if (isCrear) {
      const nextParams = new URLSearchParams(urlParams.toString());
      nextParams.delete("crear");
      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  };

  const handleSave = async (
    id: number,
    data: {
      nombre: string;
      descripcion: string;
      costoPuntos: number;
      imagen?: File;
    },
  ) => {
    try {
      if (!token) {
        alert("No hay token de sesión");
        return;
      }
      if (id === 0) {
        const creado = await crearPremio(
          {
            nombre: data.nombre,
            costoPuntos: data.costoPuntos,
            descripcion: data.descripcion,
            imagen: data.imagen,
          },
          token,
        );
        setLista((prev) => [
          ...prev,
          {
            id: creado.id,
            nombre: creado.nombre,
            descripcion: creado.descripcion ?? "",
            costoPuntos: creado.costoPuntos,
            imagenUrl: creado.imagenUrl,
          },
        ]);
        showSuccess("Premio creado");
        router.refresh();
      } else {
        const actualizado = await actualizarPremio(
          Number(id),
          {
            nombre: data.nombre,
            costoPuntos: data.costoPuntos,
            descripcion: data.descripcion,
            imagen: data.imagen,
          },
          token,
        );
        setLista((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  id: actualizado.id,
                  nombre: actualizado.nombre,
                  descripcion: actualizado.descripcion ?? "",
                  costoPuntos: actualizado.costoPuntos,
                  imagenUrl: actualizado.imagenUrl ?? p.imagenUrl,
                }
              : p,
          ),
        );
        showSuccess("Premio actualizado");
        router.refresh();
      }
      cerrarOverlay();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showError(e?.message || "No se pudo guardar el premio");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!token) {
        alert("No hay token de sesión");
        return;
      }
      await eliminarPremio(Number(id), token);
      setLista((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Premio eliminado");
      router.refresh();
      cerrarOverlay();
      setPremioAEliminar(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showError(e?.message || "No se pudo eliminar el premio");
    }
  };

  const pedirConfirmacionEliminar = (premio: PremioUI) => {
    setPremioAEliminar(premio);
  };

  const handleToggleEstado = async (id: number, estadoActual: boolean) => {
    try {
      if (!token) {
        showError("No hay token de sesión");
        return;
      }
      const actualizado = await cambiarEstadoPremio(id, !estadoActual, token);
      setLista((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                activo: actualizado.activo,
              }
            : p,
        ),
      );
      showSuccess(
        actualizado.activo ? "Premio habilitado" : "Premio deshabilitado",
      );
    } catch (e: unknown) {
      showError(
        e instanceof Error
          ? e.message
          : "No se pudo cambiar el estado del premio",
      );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {lista.map((premio) => {
        const estaDeshabilitado = premio.activo === false;
        return (
          <div
            key={premio.id}
            className={`relative ${estaDeshabilitado ? "opacity-60" : ""}`}
          >
            {/* Badge de estado */}
            {estaDeshabilitado && (
              <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                Deshabilitado
              </div>
            )}
            <TarjetaPremio
              id={premio.id}
              nombre={premio.nombre}
              descripcion={premio.descripcion}
              costoPuntos={premio.costoPuntos}
              imagenUrl={premio.imagenUrl}
              acciones={
                <div className="flex flex-col gap-2 w-full">
                  {/* Toggle de estado */}
                  <button
                    onClick={() =>
                      handleToggleEstado(premio.id, premio.activo ?? true)
                    }
                    className={`flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                      premio.activo !== false
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {premio.activo !== false ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        Habilitado
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        Deshabilitado
                      </>
                    )}
                  </button>
                  <div className="flex gap-2 w-full">
                    <button
                      className="flex-1 text-xs rounded-md border px-4 py-2 bg-gray-200 hover:bg-gray-300"
                      onClick={() => abrirOverlay(premio)}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4 inline-block mr-1" />
                      Editar
                    </button>
                    <button
                      className="flex-1 text-xs rounded-md border px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={() => pedirConfirmacionEliminar(premio)}
                      title="Eliminar"
                    >
                      <Trash className="w-4 h-4 inline-block mr-1" />
                      Borrar
                    </button>
                  </div>
                </div>
              }
            />
          </div>
        );
      })}

      {overlayPremio && (
        <EditorTarjetaPremioOverlay
          id={overlayPremio.id}
          initial={{
            nombre: overlayPremio.nombre,
            descripcion: overlayPremio.descripcion,
            costoPuntos: overlayPremio.costoPuntos,
          }}
          imagenUrl={overlayPremio.imagenUrl}
          onSave={handleSave}
          onDelete={(id) => {
            const premio = lista.find((p) => p.id === id);
            if (premio) pedirConfirmacionEliminar(premio);
          }}
          onClose={cerrarOverlay}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      {premioAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2.5 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">
                  Eliminar premio
                </h3>
              </div>
              <button
                onClick={() => setPremioAEliminar(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <p className="text-sm text-neutral-600 mb-2">
              ¿Estás seguro de que querés eliminar el premio?
            </p>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 mb-6">
              <p className="font-semibold text-neutral-800">
                {premioAEliminar.nombre}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {premioAEliminar.costoPuntos.toLocaleString("es-AR")} puntos
              </p>
            </div>
            <p className="text-xs text-red-600 mb-5">
              Esta acción no se puede deshacer. Si solo querés ocultarlo, usá el
              botón de deshabilitar.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPremioAEliminar(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(premioAEliminar.id)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
