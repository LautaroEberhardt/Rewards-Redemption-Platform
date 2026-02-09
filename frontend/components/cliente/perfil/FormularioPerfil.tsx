"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { User, Phone, Mail, Save, Loader2, Camera } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import type { Usuario } from "@/tipos/usuario";

export interface DatosPerfilForm {
  nombre: string;
  telefono: string;
}

interface Props {
  usuario: Usuario;
  guardando: boolean;
  onGuardar: (datos: DatosPerfilForm) => void;
}

export default function FormularioPerfil({
  usuario,
  guardando,
  onGuardar,
}: Props) {
  const valoresIniciales = useMemo(
    () => ({
      nombre: usuario.nombre,
      telefono: usuario.telefono ?? "",
    }),
    [usuario.nombre, usuario.telefono],
  );

  const [form, setForm] = useState<DatosPerfilForm>(valoresIniciales);

  /* Sincroniza si el usuario cambia (ej. tras guardar) */
  if (
    form.nombre !== valoresIniciales.nombre &&
    valoresIniciales.nombre !== usuario.nombre
  ) {
    setForm(valoresIniciales);
  }
  // Also sync when telefono changes from server
  if (
    form.telefono !== valoresIniciales.telefono &&
    valoresIniciales.telefono !== (usuario.telefono ?? "")
  ) {
    setForm(valoresIniciales);
  }

  const hayCambios =
    form.nombre !== usuario.nombre ||
    form.telefono !== (usuario.telefono ?? "");

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hayCambios || guardando) return;
    onGuardar(form);
  };

  return (
    <form onSubmit={manejarEnvio} className="space-y-8">
      {/* ── Cabecera: Avatar + info básica ── */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          {usuario.foto ? (
            <Image
              src={usuario.foto}
              alt={usuario.nombre}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
              <User className="w-10 h-10 text-primary" />
            </div>
          )}
          {/* Overlay para futura subida de foto */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-not-allowed">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900">{usuario.nombre}</h2>
          <p className="text-sm text-gray-500">{usuario.email}</p>
          {usuario.puntos !== undefined && (
            <span className="inline-block mt-1 px-3 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {usuario.puntos} puntos
            </span>
          )}
          {usuario.fechaCreacion && (
            <p className="text-xs text-gray-400 mt-1">
              Miembro desde{" "}
              {new Date(usuario.fechaCreacion).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
              })}
            </p>
          )}
        </div>
      </div>

      {/* ── Campos editables ── */}
      <div className="grid gap-5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
              placeholder="Tu nombre completo"
              required
            />
          </div>
        </div>

        {/* Email (solo lectura) */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={usuario.email}
              readOnly
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            El correo no se puede modificar.
          </p>
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="telefono"
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
              placeholder="Ej: +54 11 1234-5678"
            />
          </div>
        </div>
      </div>

      {/* ── Botón guardar ── */}
      <div className="flex justify-end">
        <Boton
          type="submit"
          variante="primario"
          disabled={!hayCambios || guardando}
          className="min-w-40 flex items-center justify-center gap-2"
        >
          {guardando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar cambios
            </>
          )}
        </Boton>
      </div>
    </form>
  );
}
