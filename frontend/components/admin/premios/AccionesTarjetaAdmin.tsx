'use client';

import { Boton } from "@/components/ui/boton";
import { Pencil, Trash2 } from "lucide-react"; // Asumo que usas lucide-react, si no, usa texto o svg

interface Props {
    idPremio: number;
}

export const AccionesTarjetaAdmin = ({ idPremio }: Props) => {
    
    const manejarEdicion = () => {
        console.log(`Editando premio ${idPremio}`);
        // Aquí redirigiremos a /admin/premios/editar/ID o abriremos un modal
    };

    const manejarEliminacion = async () => {
        if(!confirm("¿Estás seguro de eliminar este premio?")) return;
        console.log(`Eliminando premio ${idPremio}`);
        // Aquí llamaríamos a la Server Action de eliminar
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
                variante="peligro" // Asumiendo que tienes esta variante, si no usa className="bg-red-500..."
                className="w-full flex gap-2 items-center justify-center text-xs"
                onClick={manejarEliminacion}
            >
                <Trash2 size={14} /> Borrar
            </Boton>
        </div>
    );
};