"use client";

import { Boton } from "@/components/ui/boton";
import { Pencil, Trash2 } from "lucide-react"; // Asumo que usas lucide-react, si no, usa texto o svg
import { eliminarPremio } from "@/servicios/premios.servicio";
import { useSession } from "next-auth/react";

interface Props {
  idPremio: number;
  onDeleted?: () => void; // Para refrescar lista luego de borrar
}

export const AccionesTarjetaAdmin = ({ idPremio, onDeleted }: Props) => {
  const { data: sesion } = useSession();

  const manejarEdicion = () => {
    console.log(`Editando premio ${idPremio}`);
    // Aquí redirigiremos a /admin/premios/editar/ID o abriremos un modal
  };

  const manejarEliminacion = async () => {
    if (!confirm("¿Estás seguro de eliminar este premio?")) return;
    try {
      const token =
        (sesion as any)?.accessToken || (sesion as any)?.user?.token;
      await eliminarPremio(idPremio, token);
      alert("Premio eliminado");
      onDeleted?.();
    } catch (e: any) {
      alert(e?.message || "No se pudo eliminar el premio");
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <Boton
        variante="secundario"
        className="w-full flex gap-2 items-center justify-center text-xs"
        onClick={manejarEdicion}
      >
        <Pencil size={14} /> Editar
      </Boton>

      <Boton
        variante="peligro"
        className="w-full flex gap-2 items-center justify-center text-xs"
        onClick={manejarEliminacion}
      >
        <Trash2 size={14} /> Borrar
      </Boton>
    </div>
  );
};
