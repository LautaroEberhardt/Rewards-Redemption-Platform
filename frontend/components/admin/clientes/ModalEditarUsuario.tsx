"use client";

import { useEffect } from "react";
import type { Usuario } from "@/tipos/usuario";
import { FormularioUsuario, type DatosUsuarioForm } from "./FormularioUsuario";

interface Props {
  usuario: Usuario | null;
  abierto: boolean;
  cargando?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (datos: DatosUsuarioForm) => Promise<void> | void;
}

export function ModalEditarUsuario({
  usuario,
  abierto,
  cargando = false,
  error,
  onClose,
  onSave,
}: Props) {
  // Cerrar con Escape
  useEffect(() => {
    if (!abierto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [abierto, onClose]);

  if (!abierto || !usuario) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Editar usuario
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Modifica los datos básicos del cliente. Los puntos se gestionan desde
          las acciones de asignar/retirar.
        </p>

        <FormularioUsuario
          usuario={usuario}
          cargando={cargando}
          error={error}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
