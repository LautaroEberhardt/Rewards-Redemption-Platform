'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos la interfaz del contexto para tipado estricto
interface InterfazContextoUI {
  estaSidebarAbierto: boolean;
  abrirSidebar: () => void;
  cerrarSidebar: () => void;
  alternarSidebar: () => void;
}

const ContextoUI = createContext<InterfazContextoUI | undefined>(undefined);

export const ProveedorUI = ({ children }: { children: ReactNode }) => {
  const [estaSidebarAbierto, setEstaSidebarAbierto] = useState(false);

  const abrirSidebar = () => setEstaSidebarAbierto(true);
  const cerrarSidebar = () => setEstaSidebarAbierto(false);
  const alternarSidebar = () => setEstaSidebarAbierto((prev) => !prev);

  return (
    <ContextoUI.Provider value={{ estaSidebarAbierto, abrirSidebar, cerrarSidebar, alternarSidebar }}>
      {children}
    </ContextoUI.Provider>
  );
};

// Hook personalizado para consumir el contexto fácilmente
export const useUI = () => {
  const contexto = useContext(ContextoUI);
  if (!contexto) {
    throw new Error('useUI debe ser usado dentro de un ProveedorUI');
  }
  return contexto;
};