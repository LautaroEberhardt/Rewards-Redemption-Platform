import React from 'react';
import '@/app/globals.css';
import { FondoDegradado } from '@/components/ui/fondo-degradado';
import { ProveedorUI } from '@/context/ui-context';
import { SidebarRegistro } from '@/components/layout/SidebarRegistro';



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
            <SidebarRegistro />
          </ProveedorUI>
        </FondoDegradado>
      </body>
    </html>
  );
}