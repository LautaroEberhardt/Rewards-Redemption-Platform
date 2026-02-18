"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Usuario } from "@/tipos/usuario";
import { PuntosServicio } from "@/servicios/puntos.servicio";
import { useSession } from "next-auth/react";
import { Boton } from "@/components/ui/boton";
import { CantidadPuntosField } from "./CantidadPuntosField";

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
      const token = sesion?.user?.accessToken;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
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

            <CantidadPuntosField
              value={puntos}
              onChange={setPuntos}
              presets={[100, 250, 500]}
              buttonClassName="hover:bg-background-secondary"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concepto / Motivo
              </label>
              <input
                type="text"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-background-secondary focus:outline-none"
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
