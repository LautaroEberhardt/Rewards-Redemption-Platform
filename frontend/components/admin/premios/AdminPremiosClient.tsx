"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import { TarjetaPremio } from "@/components/ui/TarjetaModulo";
import { EditorTarjetaPremioOverlay } from "@/components/admin/premios/EditorTarjetaPremioOverlay";
import {
  listarPremios,
  crearPremio,
  actualizarPremio,
  eliminarPremio,
} from "@/servicios/premios.servicio";
import type { Premio } from "@/tipos/premio";
import { Boton } from "@/components/ui/boton";

export function AdminPremiosClient() {
  const { data: sesion } = useSession();
  const token = sesion?.user?.accessToken;
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [premios, setPremios] = useState<Premio[]>([]);
  const [overlayPremio, setOverlayPremio] = useState<Premio | null>(null);

  useEffect(() => {
    listarPremios()
      .then(setPremios)
      .catch(() => setPremios([]));
  }, []);

  const abrirNuevo = () =>
    setOverlayPremio({
      id: 0,
      nombre: "Nuevo premio",
      costoPuntos: 0,
      descripcion: "",
    });
  const abrirEditar = (p: Premio) => setOverlayPremio(p);
  const cerrarOverlay = () => setOverlayPremio(null);

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
        showError("No hay token de sesión");
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
        setPremios((prev) => [...prev, creado]);
        showSuccess("Premio creado");
        router.refresh();
      } else {
        const actualizado = await actualizarPremio(
          id,
          {
            nombre: data.nombre,
            costoPuntos: data.costoPuntos,
            descripcion: data.descripcion,
            imagen: data.imagen,
          },
          token,
        );
        setPremios((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
        showSuccess("Premio actualizado");
        router.refresh();
      }
      cerrarOverlay();
    } catch (e: any) {
      showError(e?.message || "No se pudo guardar el premio");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este premio?")) return;
    try {
      if (!token) {
        showError("No hay token de sesión");
        return;
      }
      await eliminarPremio(id, token);
      setPremios((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Premio eliminado");
      router.refresh();
      cerrarOverlay();
    } catch (e: any) {
      showError(e?.message || "No se pudo eliminar el premio");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          Gestión de Premios
        </h1>
        <Boton variante="secundario" onClick={abrirNuevo}>
          + Nuevo Premio
        </Boton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premios.map((premio) => (
          <TarjetaPremio
            key={premio.id}
            id={premio.id}
            nombre={premio.nombre}
            descripcion={premio.descripcion ?? ""}
            costoPuntos={premio.costoPuntos}
            imagenUrl={premio.imagenUrl}
            acciones={
              <div className="flex gap-2 w-full">
                <Boton
                  variante="secundario"
                  className="text-xs"
                  onClick={() => abrirEditar(premio)}
                >
                  Editar
                </Boton>
                <Boton
                  variante="peligro"
                  className="text-xs"
                  onClick={() => handleDelete(premio.id)}
                >
                  Borrar
                </Boton>
              </div>
            }
          />
        ))}
      </div>

      {overlayPremio && (
        <EditorTarjetaPremioOverlay
          id={overlayPremio.id}
          initial={{
            nombre: overlayPremio.nombre,
            descripcion: overlayPremio.descripcion ?? "",
            costoPuntos: overlayPremio.costoPuntos,
          }}
          imagenUrl={overlayPremio.imagenUrl}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={cerrarOverlay}
        />
      )}
    </section>
  );
}
