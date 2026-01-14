import React from 'react'; 
import Link from 'next/link';
import '@/app/globals.css';

export default function PlataformaLayout({ children }: { children: React.ReactNode }) {
  return (

    <div className="min-h-screen flex bg-background text-text-primary">
      
      <aside className="w-64 p-4 border-r border-border">
        <div className="font-semibold mb-4">Plataforma</div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/premios" className="text-sm hover:text-primary transition-colors">
            Premios
          </Link>
          <Link href="/historial" className="text-sm hover:text-primary transition-colors">
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
