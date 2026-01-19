'use client';

import { useState, FormEvent } from 'react';
import { Boton } from '@/components/ui/boton';
import { BotonSocial } from './BotonSocial';

export const FormularioRegistro = () => {
  const [cargando, setCargando] = useState(false);

  // Manejo de envío (simulado para el ejemplo)
  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    try {
      // Simulación de llamada al backend NestJS
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registro exitoso');
      // Aquí podrías usar useUI().cerrarSidebar() al terminar
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
      <div className="space-y-2">
        <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input 
          id="nombre"
          type="text" 
          placeholder="Ej: Juan Pérez"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input 
          id="email"
          type="email" 
          placeholder="juan@ejemplo.com"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input 
          id="password"
          type="password" 
          placeholder="••••••••"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmar-password" className="text-sm font-medium text-gray-700">
          Confirmar Contraseña
        </label>
        <input 
          id="confirmar-password"
          type="password" 
          placeholder="••••••••"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">O regístrate con</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <BotonSocial proveedor="google" onClick={() => console.log('Login Google')} />
        </div>
      </div>

      <div className="pt-4">
        <Boton type="submit" className="w-full justify-center" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Registrarse'}
        </Boton>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        ¿Ya tienes cuenta? <a href="/login" className="text-indigo-600 font-medium hover:underline">Inicia Sesión</a>
      </p>
    </form>
  );
};