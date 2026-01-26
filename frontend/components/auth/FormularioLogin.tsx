// frontend/components/auth/FormularioLogin.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EsquemaLogin, FormularioLoginDatos } from "./esquemas";
import { Boton } from "../ui/boton";
import { BotonSocial } from "./BotonSocial";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const FormularioLogin = () => {
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioLoginDatos>({
    resolver: zodResolver(EsquemaLogin),
  });

  const alEnviar = async (datos: FormularioLoginDatos) => {
    setCargando(true);
    try {
      const resultado = await signIn("credentials", {
        email: datos.email,
        password: datos.password,
        redirect: false, // Manejamos la redirección manualmente para no recargar
      });

      if (resultado?.error) {
        // Aquí podrías usar un Toast para mostrar el error
        alert("Credenciales incorrectas o usuario no existe");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Error crítico:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="tu@ejemplo.com"
            className={`w-full p-3 border rounded-lg outline-none transition-all ${
              errors.email
                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:ring-1 focus:ring-verde-primario"
            }`}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <button
              type="button"
              className="text-xs text-verde-primario hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className={`w-full p-3 border rounded-lg outline-none transition-all ${
              errors.password
                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:ring-1 focus:ring-verde-primario"
            }`}
          />
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <Boton variante="secundario" className="w-full py-3 mt-2">
          {cargando ? "Iniciando sesión..." : "Ingresar"}
        </Boton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">O continuar con</span>
        </div>
      </div>

      <div className="gap-4 items-center">
        <BotonSocial proveedor="google" />
      </div>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{" "}
        <button className="text-verde-primario font-semibold hover:underline">
          Regístrate aquí
        </button>
      </p>
    </div>
  );
};
