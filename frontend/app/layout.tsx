import React from 'react';
import type { Metadata } from "next";
import '@/app/globals.css';
import { FondoDegradado } from '@/components/ui/fondo-degradado';
import { ProveedorUI } from '@/context/ui-context';
import { SidebarGlobal } from '@/components/layout/SidebarGlobal';



export const metadata = {
  title: 'Sistema Uniformes',
  description: 'Aplicación de gestión de uniformes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <FondoDegradado>
          <ProveedorUI>
            <main>{children}</main>
            <SidebarGlobal />
          </ProveedorUI>
        </FondoDegradado>
      </body>
    </html>
  );
}