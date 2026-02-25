"use client";

import { useState } from "react";
import type { Usuario } from "@/tipos/usuario";
import { Boton } from "@/components/ui/boton";

export type DatosUsuarioForm = {
  nombre: string;
  correo: string;
  telefono: string;
};

interface Props {
  usuario: Usuario;
  cargando?: boolean;
  error?: string | null;
  onSubmit: (datos: DatosUsuarioForm) => Promise<void> | void;
  onCancel: () => void;
}

function formatearFecha(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FormularioUsuario({
  usuario,
  cargando = false,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [email, setEmail] = useState(usuario.correo);
  const [telefono, setTelefono] = useState(usuario.telefono ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!nombre.trim()) {
      setValidationError("El nombre es obligatorio");
      return;
    }
    if (!email.trim()) {
      setValidationError("El email es obligatorio");
      return;
    }

    await onSubmit({
      nombre: nombre.trim(),
      correo: email.trim(),
      telefono: telefono.trim(),
    });
  };

  return (
    <form onSubmit={manejarSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {validationError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
          {validationError}
        </div>
      )}

      {/* Cabecera: avatar + info de solo lectura */}
      <div className="flex items-center gap-4 pb-2 border-b border-gray-100">
        {usuario.foto ? (
          <img
            src={usuario.foto}
            alt={usuario.nombre}
            className="h-14 w-14 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg border border-indigo-200">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {usuario.nombre}
          </p>
          <p className="text-xs text-gray-500">{usuario.correo}</p>
        </div>
        <div className="text-right text-xs text-gray-400 shrink-0">
          <p>Creado: {formatearFecha(usuario.fechaCreacion)}</p>
          <p>Actualizado: {formatearFecha(usuario.fechaActualizacion)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block font-medium text-gray-700 mb-1">ID</label>
          <input
            type="text"
            value={usuario.id}
            disabled
            className="w-full rounded-lg border-gray-300 border px-3 py-2 bg-gray-100 text-gray-600 text-xs"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Puntos actuales
          </label>
          <input
            type="text"
            value={usuario.puntos ?? 0}
            disabled
            className="w-full rounded-lg border-gray-300 border px-3 py-2 bg-gray-100 text-gray-700 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-background-secondary focus:outline-none"
          placeholder="Nombre del cliente"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
          {usuario.googleId && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Cuenta de Google
            </span>
          )}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={!!usuario.googleId}
          className={`w-full rounded-lg border-gray-300 border px-3 py-2 ${
            usuario.googleId
              ? "bg-gray-50 text-gray-500 cursor-not-allowed"
              : "focus:ring-2 focus:ring-background-secondary focus:outline-none"
          }`}
          placeholder="cliente@ejemplo.com"
        />
        {usuario.googleId && (
          <p className="text-xs text-gray-400 mt-1">
            El email no se puede modificar porque la cuenta está vinculada a
            Google.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-background-secondary focus:outline-none"
          placeholder="Ej: +54 11 1234-5678"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          disabled={cargando}
        >
          Cancelar
        </button>
        <Boton
          type="submit"
          variante="secundario"
          className="px-4 py-2 text-sm"
          disabled={cargando}
        >
          {cargando ? "Guardando..." : "Guardar cambios"}
        </Boton>
      </div>
    </form>
  );
}
