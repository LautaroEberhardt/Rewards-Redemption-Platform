"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EsquemaRestablecerContrasena,
  FormularioRestablecerContrasenaDatos,
} from "./esquemas";
import { Boton } from "../ui/boton";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

export const FormularioRestablecerContrasena = ({ token }: Props) => {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioRestablecerContrasenaDatos>({
    resolver: zodResolver(EsquemaRestablecerContrasena),
  });

  const alEnviar = async (datos: FormularioRestablecerContrasenaDatos) => {
    setCargando(true);
    setMensaje(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const resp = await fetch(`${API_URL}/recuperar-contrasena/restablecer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          nuevaContrasena: datos.nuevaContrasena,
        }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => null);
        throw new Error(
          body?.message || "No se pudo restablecer la contraseña.",
        );
      }

      setMensaje({
        tipo: "exito",
        texto:
          "¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Ocurrió un error inesperado.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800">
          Restablecer contraseña
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Ingresa tu nueva contraseña para continuar.
        </p>
      </div>

      {mensaje && (
        <div
          className={`p-3 border rounded text-sm text-center ${
            mensaje.tipo === "exito"
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {mensaje?.tipo !== "exito" && (
        <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
          {/* Nueva contraseña */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <input
              {...register("nuevaContrasena")}
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 border rounded-lg outline-none transition-all ${
                errors.nuevaContrasena
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:ring-1 focus:ring-verde-primario"
              }`}
              disabled={cargando}
            />
            {errors.nuevaContrasena && (
              <span className="text-xs text-red-500">
                {errors.nuevaContrasena.message}
              </span>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <input
              {...register("confirmarContrasena")}
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 border rounded-lg outline-none transition-all ${
                errors.confirmarContrasena
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:ring-1 focus:ring-verde-primario"
              }`}
              disabled={cargando}
            />
            {errors.confirmarContrasena && (
              <span className="text-xs text-red-500">
                {errors.confirmarContrasena.message}
              </span>
            )}
          </div>

          <Boton
            variante="secundario"
            className="w-full py-3 mt-2"
            disabled={cargando}
          >
            {cargando ? "Restableciendo..." : "Restablecer contraseña"}
          </Boton>
        </form>
      )}

      <p className="text-center text-sm text-gray-600">
        <a
          href="/login"
          className="text-verde-primario font-semibold hover:underline"
        >
          Volver al inicio de sesión
        </a>
      </p>
    </div>
  );
};

export default FormularioRestablecerContrasena;
