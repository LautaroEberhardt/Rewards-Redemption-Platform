"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UsuariosServicio } from "@/servicios/usuarios.servicio";
// Usamos una tabla local para evitar incompatibilidades de props
import { Usuario } from "@/tipos/usuario";
import { ModalAsignarPuntos } from "@/components/admin/asignacion/FormularioAsignarPuntos";

export default function PaginaPanelAdmin() {
  const { data: sesion } = useSession();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Función para abrir el modal desde la tabla
  const abrirModalAsignacion = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(true);
  };

  const refrescarDatos = () => {
    setCargando(true);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token =
          (sesion as any)?.user?.token ??
          (sesion as any)?.accessToken ??
          (sesion as any)?.backendToken;
        if (!token) {
          setError(
            "No autorizado: falta token de sesión para consultar usuarios.",
          );
          return;
        }
        const datos = await UsuariosServicio.obtenerTodos(token);
        const soloClientes = datos.filter((u) => u.rol === "cliente");
        setUsuarios(soloClientes);
      } catch (err) {
        setError("No se pudieron cargar los clientes.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [sesion]);

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
          <TablaClientesLocal
            usuarios={usuarios}
            onAsignar={abrirModalAsignacion}
          />
        )}
      </section>

      <ModalAsignarPuntos
        usuario={usuarioSeleccionado}
        estaAbierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
        alCompletar={refrescarDatos}
      />
    </div>
  );
}

type TablaProps = { usuarios: Usuario[]; onAsignar: (u: Usuario) => void };
function TablaClientesLocal({ usuarios, onAsignar }: TablaProps) {
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-50">
          <th className="text-left p-2 border">ID</th>
          <th className="text-left p-2 border">Nombre</th>
          <th className="text-left p-2 border">Email</th>
          <th className="text-left p-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id}>
            <td className="p-2 border">{u.id}</td>
            <td className="p-2 border">{u.nombre}</td>
            <td className="p-2 border">{u.email}</td>
            <td className="p-2 border">
              <button
                className="text-primary hover:underline"
                onClick={() => onAsignar(u)}
              >
                Asignar puntos
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
