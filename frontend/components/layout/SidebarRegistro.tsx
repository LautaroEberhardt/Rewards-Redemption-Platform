'use client';

import { useEffect } from 'react';
import { useUI } from '@/context/ui-context';
import { FormularioRegistro } from '@/components/auth/FormularioRegistro';
import { X } from 'lucide-react';

export const SidebarRegistro = () => {
  const { estaSidebarAbierto, cerrarSidebar } = useUI();

  // Cerrar al presionar la tecla ESC (Accesibilidad)
  useEffect(() => {
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarSidebar();
    };
    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [cerrarSidebar]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        estaSidebarAbierto ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
    >
      {/* Backdrop (Fondo oscuro) */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            estaSidebarAbierto ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={cerrarSidebar}
      />

      {/* Panel Lateral */}
      <aside 
        className={`relative w-full max-w-md h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
            estaSidebarAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabecera del Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Crear Cuenta</h2>
          <button 
            onClick={cerrarSidebar}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido (Formulario) */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
            <FormularioRegistro />
        </div>
      </aside>
    </div>
  );
};