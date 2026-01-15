import React from 'react';
import '@/app/globals.css';
import { FondoPatron } from '@/components/ui/fondo-patron'; //
import { FondoDegradado } from '@/components/ui/fondo-degradado';


export const metadata = {
  title: 'Sistema Uniformes',
  description: 'Aplicación de gestión de uniformes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased text-text-primary">
        {/* Envolvemos la app con nuestro patrón */}
        <FondoDegradado variante="marca">
            {children}
        </FondoDegradado>
      </body>
    </html>
  );
}