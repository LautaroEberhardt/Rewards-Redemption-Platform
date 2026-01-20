'use client';

import { useState } from 'react';
import { useUI } from '@/context/ui-context';
import { useRouter } from 'next/navigation';
import { Boton } from '../ui/boton';

const IconoGoogle = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
        fill="#EA4335"
      />
    </svg>
);


export function SidebarRegistro() {

  const { estaSidebarAbierto, cerrarSidebar } = useUI();
  const router = useRouter();


  // Estados del formulario
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    contrasena: '',
  });

  // Lógica de control de inputs
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Lógica de envío (API)
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/usuarios/registro`;
      
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.message || 'Error al registrar');

      // Éxito
      alert('¡Cuenta creada con éxito! Por favor inicia sesión.');
      cerrarSidebar();
      router.push('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* Overlay Oscuro (Fondo) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          estaSidebarAbierto ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={cerrarSidebar}
      />

      {/* Panel Lateral (Slide Over) */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          estaSidebarAbierto ? 'translate-x-0' : 'translate-x-full'
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
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                <label className="block text-sm font-medium text-gray-900">Nombre Completo</label>
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
                <label className="block text-sm font-medium text-gray-900">Email</label>
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
                <label className="block text-sm font-medium text-gray-900">Contraseña</label>
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  {cargando ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
  };

  const manejarRegistroGoogle = async () => {
    try {
      // TODO: Integrar con el servicio de autenticación definido en el core
      console.log("Iniciando flujo de OAuth2 con Google...");
      
      // Ejemplo de flujo:
      // await servicioAuth.loginConGoogle();
      
    } catch (error) {
      // Manejo de errores centralizado (podría integrarse con un sistema de notificaciones/toast)
      console.error("Error durante el registro con Google:", error);
      alert("Hubo un problema al conectar con Google. Por favor, intenta de nuevo.");
    }
  };

  return (
      <aside className="flex flex-col gap-6 p-6 bg-background-secondary rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-primary">Beneficios de Miembro</h2>
          <p className="text-sm text-gray-600">
            Únete para empezar a acumular puntos por tus compras y canjearlos por premios exclusivos.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background-secondary px-2 text-gray-500">O continúa con</span>
          </div>
        </div>

        <Boton 
          variante="secundario" 
          onClick={manejarRegistroGoogle}
          className="flex items-center justify-center gap-3 w-full py-3 shadow-sm hover:shadow-md transition-all"
        >
          <IconoGoogle />
          <span>Registrarse con Google</span>
        </Boton>

        <footer className="text-xs text-center text-gray-500 mt-4">
          Al registrarte, aceptas nuestros términos y condiciones de fidelización.
        </footer>
      </aside>
    );
};