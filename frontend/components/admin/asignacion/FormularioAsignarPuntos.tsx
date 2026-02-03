"use client";

import { useState } from "react";
import { Usuario } from "@/tipos/usuario";
import { PuntosServicio } from "@/servicios/puntos.servicio";
import { useSession } from "next-auth/react";
import { Boton } from "@/components/ui/boton";

interface Props {
  usuario: Usuario | null;
  estaAbierto: boolean;
  alCerrar: () => void;
  alCompletar: () => void; // Para recargar la tabla después
}

export const ModalAsignarPuntos = ({
  usuario,
  estaAbierto,
  alCerrar,
  alCompletar,
}: Props) => {
  const { data: sesion } = useSession();
  const [puntos, setPuntos] = useState<string>(""); // String para manejo de inputs
  const [concepto, setConcepto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  if (!estaAbierto || !usuario) return null;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);
    setCargando(true);

    try {
      const token =
        // Compatibilidad con distintas formas de exponer el token en la sesión
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.user?.token ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.accessToken ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.backendToken;

      if (!token) throw new Error("No autorizado: falta token de sesión");

      const puntosNumero = parseInt(puntos, 10);
      if (isNaN(puntosNumero) || puntosNumero <= 0) {
        throw new Error("La cantidad de puntos debe ser mayor a 0");
      }

      await PuntosServicio.asignar(
        usuario.id,
        puntosNumero,
        concepto || "Asignación manual",
        token,
      );

      // Limpieza y cierre
      setPuntos("");
      setConcepto("");
      alCompletar();
      alCerrar();
      alert(`¡Puntos asignados a ${usuario.nombre}!`); // O usar un Toast mejor

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMensajeError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Encabezado */}
        <div className="bg-background-secondary p-6 text-text-primary">
          <h2 className="text-xl font-bold">Asignar Puntos</h2>
          <p className="text-text-secondary text-sm mt-1">
            Cliente: <span className="font-semibold">{usuario.nombre}</span>
          </p>
          <div className="mt-2 inline-block bg-white rounded px-2 py-1 text-xs text-gray-700">
            Saldo actual: {usuario.puntos} pts
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
          {mensajeError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
              {mensajeError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de Puntos
            </label>
            <input
              type="number"
              min="1"
              value={puntos}
              onChange={(e) => setPuntos(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg font-mono"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Concepto / Motivo
            </label>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ej: Compra Ticket #9944"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={alCerrar}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={cargando}
            >
              Cancelar
            </button>
            <Boton
              type="submit"
              className="flex-1 px-4 py-2"
              disabled={cargando}
              variante="secundario"
            >
              {cargando ? "Procesando..." : "Confirmar Asignación"}
            </Boton>
          </div>
        </form>
      </div>
    </div>
  );
};

// Formulario standalone para la página /admin/puntos/asignar
// Permite ingresar manualmente el ID del usuario, cantidad y concepto.
export function FormularioAsignarPuntos() {
  const { data: sesion } = useSession();
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [puntos, setPuntos] = useState<string>("");
  const [concepto, setConcepto] = useState<string>("");
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);
    setMensajeOk(null);
    setCargando(true);

    try {
      const token =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.user?.token ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.accessToken ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sesion as any)?.backendToken;

      if (!token) throw new Error("No autorizado: falta token de sesión");

      const puntosNumero = parseInt(puntos, 10);
      if (!usuarioId) throw new Error("Debes indicar el ID del usuario");
      if (isNaN(puntosNumero) || puntosNumero <= 0)
        throw new Error("La cantidad de puntos debe ser mayor a 0");

      await PuntosServicio.asignar(
        usuarioId,
        puntosNumero,
        concepto || "Asignación manual",
        token,
      );

      setMensajeOk("¡Puntos asignados correctamente!");
      setUsuarioId("");
      setPuntos("");
      setConcepto("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setMensajeError(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      {mensajeError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
          {mensajeError}
        </div>
      )}
      {mensajeOk && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200">
          {mensajeOk}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID de Usuario (UUID)
        </label>
        <input
          type="text"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="00000000-0000-0000-0000-000000000000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad de Puntos
        </label>
        <input
          type="number"
          min="1"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
          className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg font-mono"
          placeholder="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Concepto / Motivo
        </label>
        <input
          type="text"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Ej: Ajuste administrativo"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Boton
          type="submit"
          className="flex-1 px-4 py-2"
          disabled={cargando}
          variante="secundario"
        >
          {cargando ? "Procesando..." : "Confirmar Asignación"}
        </Boton>
      </div>
    </form>
  );
}
