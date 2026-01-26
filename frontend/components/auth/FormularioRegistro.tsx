'use client';

import { useState, useTransition } from 'react'; // Usamos useTransition para Server Actions
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EsquemaRegistro, FormularioRegistroDatos } from './esquemas';
import { Boton } from '@/components/ui/boton';
import { BotonSocial } from './BotonSocial';
import { useUI } from '@/context/ui-context';
// Importamos nuestras acciones del servidor
import { iniciarSesionConGoogle, registrarUsuario } from '@/actions/autenticacion';

export const FormularioRegistro = () => {
  // useTransition es el hook recomendado para manejar estados de carga con Server Actions
  const [estaPendiente, iniciarTransicion] = useTransition();
  const [errorBackend, setErrorBackend] = useState<string | null>(null);
  const { abrirSidebar } = useUI();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioRegistroDatos>({
    resolver: zodResolver(EsquemaRegistro),
  });

  const manejarEnvio = (datos: FormularioRegistroDatos) => {
    setErrorBackend(null);

    // Envolvemos la llamada al Server Action en una transición
    iniciarTransicion(async () => {
      const respuesta = await registrarUsuario(datos);
      
      // Si la acción devuelve algo, es un error (si tiene éxito, redirecciona)
      if (respuesta?.error) {
        setErrorBackend(respuesta.error);
      }
    });
  };

  const manejarGoogle = async () => {
     try {
       await iniciarSesionConGoogle();
     } catch (error) {
       console.error("Error iniciando con Google", error);
     }
  };

  return (
    <form onSubmit={handleSubmit(manejarEnvio)} className="flex flex-col gap-4">
      {/* Mostramos errores globales del backend aquí */}
      {errorBackend && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center font-medium">
          🚨 {errorBackend}
        </div>
      )}

      {/* --- CAMPOS DEL FORMULARIO --- */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
        <input
          {...register('nombreCompleto')}
          placeholder="Ej: Juan Pérez"
          className={`w-full p-3 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
            errors.nombreCompleto ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
          }`}
        />
        {errors.nombreCompleto && <span className="text-xs text-red-500 font-medium">{errors.nombreCompleto.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input
          {...register('email')}
          type="email"
          placeholder="juan@ejemplo.com"
          className={`w-full p-3 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
          }`}
        />
        {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Contraseña</label>
        <input
          {...register('contrasena')}
          type="password"
          placeholder="••••••••"
          className={`w-full p-3 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
            errors.contrasena ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
          }`}
        />
        {errors.contrasena && <span className="text-xs text-red-500 font-medium">{errors.contrasena.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
        <input
          {...register('confirmarContrasena')}
          type="password"
          placeholder="••••••••"
          className={`w-full p-3 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
            errors.confirmarContrasena ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
          }`}
        />
        {errors.confirmarContrasena && <span className="text-xs text-red-500 font-medium">{errors.confirmarContrasena.message}</span>}
      </div>

      {/* --- BOTÓN DE REGISTRO --- */}
      <div className="pt-4">
        <Boton type="submit" variante='secundario' className="w-full justify-center" disabled={estaPendiente}>
          {estaPendiente ? 'Creando cuenta...' : 'Registrarse'}
        </Boton>
      </div>
      
      {/* --- DIVISOR SOCIAL --- */}
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">O regístrate con</span>
        </div>
      </div>

      {/* --- LOGIN SOCIAL (GOOGLE) --- */}
      <div className="mt-6 grid grid-cols-1 gap-3">
        <BotonSocial proveedor="google" onClick={manejarGoogle} />
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        ¿Ya tienes cuenta?{' '}
        <button 
          type="button" 
          onClick={() => abrirSidebar('login')} 
          className="text-indigo-600 font-medium hover:underline"
        >
          Inicia Sesión
        </button>
      </p>
    </form>
  );
};