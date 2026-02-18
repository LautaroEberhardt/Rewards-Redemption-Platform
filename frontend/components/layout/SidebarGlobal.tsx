// frontend/components/layout/SidebarGlobal.tsx
"use client";

import { useUI } from "@/context/ui-context";
import { motion, AnimatePresence } from "framer-motion";
import { FormularioRegistro } from "../auth/FormularioRegistro";
import { FormularioLogin } from "../auth/FormularioLogin";

export const SidebarGlobal = () => {
  const { isSidebarOpen, cerrarSidebar, contenidoSidebar } = useUI();

  return (
    <>
      {/* Overlay - Fondo oscuro */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={cerrarSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {contenidoSidebar === "registro"
                  ? "Crear Cuenta"
                  : "Iniciar Sesión"}
              </h2>
              <button
                onClick={cerrarSidebar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Renderizado Condicional de la Lógica de Negocio */}
            {contenidoSidebar === "registro" && <FormularioRegistro />}
            {contenidoSidebar === "login" && <FormularioLogin />}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
