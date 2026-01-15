import React from 'react';
import '@/app/globals.css';
import { FondoDegradado } from '@/components/ui/fondo-degradado';


export const metadata = {
  title: 'Sistema Uniformes',
  description: 'Aplicación de gestión de uniformes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased text-text-primary">
        <FondoDegradado>
            {children}
        </FondoDegradado>
      </body>
    </html>
  );
}