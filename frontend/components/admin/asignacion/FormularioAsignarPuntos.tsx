"use client";

import { useState } from "react";
import { Usuario } from "@/tipos/usuario";
import { PuntosServicio } from "@/servicios/premios.servicio";
import { useSession } from "next-auth/react";

interface Props {
  usuario: Usuario | null;
  estaAbierto: boolean;
  alCerrar: () => void;
  alCompletar: () => void; // Para recargar la tabla después
}

export const ModalAsignarPuntos = ({ usuario, estaAbierto, alCerrar, alCompletar }: Props) => {
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
      if (!sesion?.user?.accessToken) throw new Error("No hay sesión activa");

      const puntosNumero = parseInt(puntos, 10);
      if (isNaN(puntosNumero) || puntosNumero <= 0) {
        throw new Error("La cantidad de puntos debe ser mayor a 0");
      }

      await PuntosServicio.asignar(
        usuario.id,
        puntosNumero,
        concepto || "Asignación manual",
        sesion.user.accessToken
      );

      // Limpieza y cierre
      setPuntos("");
      setConcepto("");
      alCompletar(); 
      alCerrar();
      alert(`¡Puntos asignados a ${usuario.nombre}!`); // O usar un Toast mejor
      
    } catch (error: any) {
      setMensajeError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Encabezado */}
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold">Asignar Puntos</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Cliente: <span className="font-semibold">{usuario.nombre}</span>
          </p>
          <div className="mt-2 inline-block bg-indigo-700 rounded px-2 py-1 text-xs">
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
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              disabled={cargando}
            >
              {cargando ? "Procesando..." : "Confirmar Asignación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};