"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import { TarjetaPremio } from "@/components/ui/TarjetaModulo";
import { Pencil, Trash } from "lucide-react";
import { EditorTarjetaPremioOverlay } from "@/components/admin/premios/EditorTarjetaPremioOverlay";
import {
  crearPremio,
  actualizarPremio,
  eliminarPremio,
} from "@/servicios/premios.servicio";

type PremioUI = {
  id: number;
  nombre: string;
  descripcion: string;
  costoPuntos: number;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = (sesion as any)?.accessToken || (sesion as any)?.user?.token;

  const [lista, setLista] = useState<PremioUI[]>(premios);
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

  // Si el query param `crear=1` cambia después del primer render,
  // abrimos el overlay de creación de manera reactiva.
  useEffect(() => {
    if (crearNuevo && !overlayPremio) {
      setOverlayPremio({
        id: 0,
        nombre: "Nuevo premio",
        descripcion: "Describe el premio...",
        costoPuntos: 0,
      });
    }
  }, [crearNuevo]);

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
    data: { nombre: string; descripcion: string; costoPuntos: number },
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
    if (!confirm("¿Eliminar este premio?")) return;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showError(e?.message || "No se pudo eliminar el premio");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {lista.map((premio) => (
        <TarjetaPremio
          key={premio.id}
          id={premio.id}
          nombre={premio.nombre}
          descripcion={premio.descripcion}
          costoPuntos={premio.costoPuntos}
          acciones={
            <div className="flex gap-2">
              <button
                className="text-xs rounded-md border px-10 py-2 bg-gray-200 hover:bg-gray-300"
                onClick={() => abrirOverlay(premio)}
                title="Editar"
              >
                <Pencil className="w-4 h-4 inline-block mr-1" />
                Editar
              </button>
              <button
                className="text-xs rounded-md border px-10 py-2 bg-red-100 text-red-700 hover:bg-red-200"
                onClick={() => handleDelete(premio.id)}
                title="Eliminar"
              >
                <Trash className="w-4 h-4 inline-block mr-1" />
                Borrar
              </button>
            </div>
          }
        />
      ))}

      {overlayPremio && (
        <EditorTarjetaPremioOverlay
          id={overlayPremio.id}
          initial={{
            nombre: overlayPremio.nombre,
            descripcion: overlayPremio.descripcion,
            costoPuntos: overlayPremio.costoPuntos,
          }}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={cerrarOverlay}
        />
      )}
    </div>
  );
}
