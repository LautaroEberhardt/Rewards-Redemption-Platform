"use client";
import React, { useState } from "react";
import { SidebarAdmin } from "@/components/admin/layout/SidebarAdmin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-200 text-slate-900 overflow-hidden">
      {/* Barra Lateral de Navegación */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm z-20 hidden md:block">
        <SidebarAdmin />
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar móvil con botón de menú */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shadow-sm z-10">
          <button
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto(true)}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-white hover:bg-slate-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.75 6.75h16.5a.75.75 0 000-1.5H3.75a.75.75 0 000 1.5zm0 6h16.5a.75.75 0 000-1.5H3.75a.75.75 0 000 1.5zm0 6h16.5a.75.75 0 000-1.5H3.75a.75.75 0 000 1.5z" />
            </svg>
            Menú
          </button>
          <span className="text-sm font-semibold text-slate-700">
            Panel Admin
          </span>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {/* Contenedor centrado para evitar que las tablas se estiren infinitamente en monitores 4k */}
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </div>

        {/* Drawer móvil: overlay + panel */}
        {menuAbierto && (
          <div className="md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 z-30 bg-black/40"
              onClick={() => setMenuAbierto(false)}
            />
            {/* Panel lateral */}
            <div className="fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-slate-200 shadow-xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="text-sm font-semibold">Menú</span>
                <button
                  aria-label="Cerrar menú"
                  onClick={() => setMenuAbierto(false)}
                  className="rounded-md p-2 hover:bg-slate-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M6.225 4.811a.75.75 0 10-1.06 1.06L10.94 11.646l-5.774 5.775a.75.75 0 101.06 1.06l5.775-5.774 5.775 5.774a.75.75 0 101.06-1.06l-5.774-5.775 5.774-5.775a.75.75 0 10-1.06-1.06l-5.775 5.774-5.775-5.774z" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarAdmin />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
