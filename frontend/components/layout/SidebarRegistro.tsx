"use client";

import { useState } from "react";
import { useUI } from "@/context/ui-context";
import { useRouter } from "next/navigation";
import { Boton } from "../ui/boton";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react"; // [MODIFICACIÓN: Importamos la función de Auth.js]

export function SidebarRegistro() {
  const { estaSidebarAbierto, cerrarSidebar } = useUI();
  const router = useRouter();

  // Estados del formulario
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  // Lógica de control de inputs
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lógica de envío (API)
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/usuarios/registro`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmarContrasena, ...datosAEnviar } = formData;

      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.message || "Error al registrar");

      // Éxito
      alert("¡Cuenta creada con éxito! Por favor inicia sesión.");
      cerrarSidebar();
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // [MODIFICACIÓN: Implementación real de Google Auth]
  const manejarRegistroGoogle = async () => {
    try {
      setCargando(true);
      // 'google' es el ID del proveedor configurado en auth.ts
      // callbackUrl asegura que tras el login vayan al dashboard o home
      await signIn("google", { callbackUrl: "/" }); 
    } catch (error) {
      console.error("Error durante el registro con Google:", error);
      setError("Hubo un problema al conectar con Google.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* Overlay Oscuro (Fondo) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          estaSidebarAbierto ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={cerrarSidebar}
      />

      {/* Panel Lateral (Slide Over) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          estaSidebarAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
          <div className="px-4 sm:px-6">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold leading-6 text-gray-900">
                Crear una cuenta
              </h2>
              <button
                type="button"
                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={cerrarSidebar}
              >
                <span className="sr-only">Cerrar panel</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative mt-6 flex-1 px-4 sm:px-6">
            {/* Formulario */}
            <form className="space-y-6" onSubmit={manejarEnvio}>
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  🚨 {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Nombre Completo
                </label>
                <input
                  name="nombreCompleto"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  value={formData.nombreCompleto}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  value={formData.email}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Contraseña
                </label>
                <input
                  name="contrasena"
                  type="password"
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  value={formData.contrasena}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Confirmar Contraseña
                </label>
                <input
                  name="confirmarContrasena"
                  type="password"
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  value={formData.confirmarContrasena}
                  onChange={manejarCambio}
                />
              </div>

              <div className="pt-4">
                <Boton
                  variante="secundario"
                  type="submit"
                  disabled={cargando}
                  className="flex w-full justify-center "
                >
                  {cargando ? "Registrando..." : "Registrarse"}
                </Boton>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    O continúa con
                  </span>
                </div>
              </div>

              <div>
                {/* [MODIFICACIÓN: Usamos el type="button" para evitar submit accidental] */}
                <Boton
                  variante="primario"
                  type="button"
                  onClick={manejarRegistroGoogle}
                  className="flex items-center justify-center gap-3 w-full py-2.5 shadow-sm hover:shadow-md transition-all"
                >
                  <FcGoogle className="h-5 w-5" />
                  <span>Registrarse con Google</span>
                </Boton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}