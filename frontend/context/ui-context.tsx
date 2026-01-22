// frontend/context/ui-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type TipoContenidoSidebar = "registro" | "login" | null;

interface ContextoUIInterface {
  isSidebarOpen: boolean;
  contenidoSidebar: TipoContenidoSidebar;
  abrirSidebar: (contenido: TipoContenidoSidebar) => void;
  cerrarSidebar: () => void;
}

const ContextoUI = createContext<ContextoUIInterface | undefined>(undefined);

export const ProveedorUI = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contenidoSidebar, setContenidoSidebar] = useState<TipoContenidoSidebar>(null);

  const abrirSidebar = (contenido: TipoContenidoSidebar) => {
    setContenidoSidebar(contenido);
    setIsSidebarOpen(true);
  };

  const cerrarSidebar = () => {
    setIsSidebarOpen(false);
    // Opcional: limpiar contenido tras la animación de cierre
  };

  return (
    <ContextoUI.Provider value={{ isSidebarOpen, contenidoSidebar, abrirSidebar, cerrarSidebar }}>
      {children}
    </ContextoUI.Provider>
  );
};

export const useUI = () => {
  const contexto = useContext(ContextoUI);
  if (!contexto) throw new Error("useUI debe usarse dentro de un ProveedorUI");
  return contexto;
};