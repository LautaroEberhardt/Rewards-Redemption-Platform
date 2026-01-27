"use client";
import { useState } from "react";
import { Boton } from "@/components/ui/boton";
import { asignarPuntos } from "@/servicios/puntos.servicio";

export function FormularioAsignarPuntos() {
  const [clienteId, setClienteId] = useState("");
  const [puntos, setPuntos] = useState<number>(0);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    try {
      await asignarPuntos({ clienteId, puntos });
      setMensaje("Puntos asignados correctamente");
    } catch (e) {
      setMensaje("No se pudo asignar puntos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mensaje && <div className="text-sm text-gray-600">{mensaje}</div>}
      <div className="space-y-1">
        <label className="text-sm">ID Cliente</label>
        <input
          className="border rounded p-2 w-full"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm">Puntos</label>
        <input
          className="border rounded p-2 w-full"
          type="number"
          value={puntos}
          onChange={(e) => setPuntos(parseInt(e.target.value || "0", 10))}
        />
      </div>
      <Boton disabled={cargando}>{cargando ? "Asignando..." : "Asignar"}</Boton>
    </form>
  );
}
