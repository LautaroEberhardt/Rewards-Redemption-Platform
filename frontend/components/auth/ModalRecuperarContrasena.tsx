"use client";
import React, { useState } from "react";
import { Boton } from "@/components/ui/boton";

interface ModalRecuperarContrasenaProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalRecuperarContrasena: React.FC<
  ModalRecuperarContrasenaProps
> = ({ abierto, alCerrar }) => {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const solicitarRecuperacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setEnviado(false);
    try {
      const resp = await fetch("/api/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });
      if (!resp.ok)
        throw new Error("No se pudo enviar el correo de recuperación.");
      setEnviado(true);
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar"
          onClick={alCerrar}
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-neutral-800 text-center">
          Recuperar contraseña
        </h3>
        {enviado ? (
          <div className="text-green-700 text-center mb-4">
            Se ha enviado un correo con instrucciones para reestablecer tu
            contraseña.
          </div>
        ) : (
          <form
            onSubmit={solicitarRecuperacion}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              required
              placeholder="Tu correo electrónico"
              className="w-full p-3 border rounded-lg outline-none border-gray-300 focus:ring-1 focus:ring-verde-primario"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={cargando}
            />
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Boton
              type="submit"
              variante="secundario"
              className="w-full py-3"
              disabled={cargando}
            >
              {cargando ? "Enviando..." : "Enviar instrucciones"}
            </Boton>
          </form>
        )}
      </div>
    </div>
  );
};
