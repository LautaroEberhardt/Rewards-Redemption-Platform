"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { EditorTarjetaPremioOverlay } from "@/components/admin/premios/EditorTarjetaPremioOverlay";
import {
  crearPremio,
  actualizarPremio,
  eliminarPremio,
} from "@/servicios/premios.servicio";

type Props = {
  id: number;
  initial: { nombre: string; descripcion: string; costoPuntos: number };
};

export function OverlayEditableWrapper({ id, initial }: Props) {
  const { data: sesion } = useSession();
  const [visible, setVisible] = useState(true);

  const token = (sesion as any)?.accessToken || (sesion as any)?.user?.token;

  const handleSave = async (
    premioId: number,
    data: { nombre: string; descripcion: string; costoPuntos: number },
  ) => {
    try {
      if (!token) {
        alert("No hay token de sesión");
        return;
      }
      if (!premioId || premioId === 0) {
        await crearPremio(
          {
            nombre: data.nombre,
            costoPuntos: data.costoPuntos,
            descripcion: data.descripcion,
          },
          token,
        );
        alert("Premio creado");
      } else {
        await actualizarPremio(
          premioId,
          {
            nombre: data.nombre,
            costoPuntos: data.costoPuntos,
            descripcion: data.descripcion,
          },
          token,
        );
        alert("Premio actualizado");
      }
      // TODO: opcional - disparar un refresh del router
    } catch (e: any) {
      alert(e?.message || "No se pudo guardar el premio");
    }
  };

  const handleDelete = async (premioId: number) => {
    if (!confirm("¿Eliminar este premio?")) return;
    try {
      if (!token) {
        alert("No hay token de sesión");
        return;
      }
      await eliminarPremio(premioId, token);
      alert("Premio eliminado");
      // TODO: opcional - disparar un refresh del router
    } catch (e: any) {
      alert(e?.message || "No se pudo eliminar el premio");
    }
  };

  if (!visible) return null;
  return (
    <EditorTarjetaPremioOverlay
      id={id}
      initial={initial}
      onSave={handleSave}
      onDelete={handleDelete}
      onClose={() => setVisible(false)}
    />
  );
}
