import React from 'react';
import BarraNavegacion from '../../components/layout/BarraNavegacion';
import PieDePagina from '../../components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <BarraNavegacion />
      <main className="flex-1">
        {children}
      </main>
      <PieDePagina />
    </div>
  );
}