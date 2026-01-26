'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EsquemaRegistro, FormularioRegistroDatos } from './esquemas';
import { Boton } from '@/components/ui/boton';
import { BotonSocial } from './BotonSocial';
import { useUI } from '@/context/ui-context';
import { iniciarSesionConGoogle } from '@/actions/autenticacion';


export const FormularioRegistro = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const { abrirSidebar } = useUI();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormularioRegistroDatos>({
    resolver: zodResolver(EsquemaRegistro),
  });

  const manejarEnvio = async (datos: FormularioRegistroDatos) => {
    setCargando(true);
    setError(null);
    setExito(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo completar el registro.');
      }

      setExito('¡Registro exitoso! Ahora puedes iniciar sesión.');
      reset(); // Limpia el formulario

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(manejarEnvio)} className="flex flex-col gap-4">
      {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">{error}</div>}
      {exito && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">{exito}</div>}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
        <input
          {...register('nombreCompleto')}
          placeholder="Ej: Juan Pérez"
          className={`w-full p-3 border rounded-lg outline-none transition-all ${errors.nombreCompleto ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.nombreCompleto && <span className="text-xs text-red-500">{errors.nombreCompleto.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input
          {...register('email')}
          type="email"
          placeholder="juan@ejemplo.com"
          className={`w-full p-3 border rounded-lg outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Contraseña</label>
        <input
          {...register('contrasena')}
          type="password"
          placeholder="••••••••"
          className={`w-full p-3 border rounded-lg outline-none transition-all ${errors.contrasena ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.contrasena && <span className="text-xs text-red-500">{errors.contrasena.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
        <input
          {...register('confirmarContrasena')}
          type="password"
          placeholder="••••••••"
          className={`w-full p-3 border rounded-lg outline-none transition-all ${errors.confirmarContrasena ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.confirmarContrasena && <span className="text-xs text-red-500">{errors.confirmarContrasena.message}</span>}
      </div>

      <div className="pt-4">
        <Boton type="submit" className="w-full justify-center" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Registrarse'}
        </Boton>
      </div>
      
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">O regístrate con</span></div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <BotonSocial proveedor="google" onClick={iniciarSesionConGoogle} />
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={() => abrirSidebar('login')} className="text-verde-primario font-medium hover:underline">
          Inicia Sesión
        </button>
      </p>
    </form>
  );
};