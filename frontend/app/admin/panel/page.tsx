"use client";

import { useEffect, useState } from "react";
import { UsuariosServicio } from "@/servicios/usuarios.servicio";
import { TablaClientes } from "@/components/admin/clientes/TablaClientes";
import { Usuario } from "@/tipos/usuario";

export default function PaginaPanelAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await UsuariosServicio.obtenerTodos();
        const soloClientes = datos.filter((u) => u.rol === "cliente");
        setUsuarios(soloClientes);
      } catch (err) {
        setError("No se pudieron cargar los clientes.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Panel de Control
          </h1>
          <p className="text-sm text-gray-500">
            Vista general de clientes y actividad reciente.
          </p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">
          + Nuevo Cliente
        </button>
      </div>

      <section>
        {cargando ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">Cargando clientes...</p>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        ) : (
          <TablaClientes usuarios={usuarios} />
        )}
      </section>
    </div>
  );
}
