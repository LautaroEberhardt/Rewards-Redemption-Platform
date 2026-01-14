import React from 'react';
import Link from 'next/link';


export default function PlataformaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-text-primary">
      <aside className="w-64 p-4 border-r border-border">
        <div className="font-semibold mb-4 text-primary">Plataforma</div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="text-sm px-2 py-1 rounded hover:bg-background-tertiary transition-colors">
            Dashboard
          </Link>
          <Link href="/premios" className="text-sm px-2 py-1 rounded hover:bg-background-tertiary transition-colors">
            Premios
          </Link>
          <Link href="/historial" className="text-sm px-2 py-1 rounded hover:bg-background-tertiary transition-colors">
            Historial
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}