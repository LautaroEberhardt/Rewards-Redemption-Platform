'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House, Pen, ShoppingCart, LogIn } from 'lucide-react';
import { Boton } from '../ui/boton';
import { useUI } from '@/context/ui-context';

export default function BarraNavegacion() {
  const { abrirSidebar } = useUI();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background-secondary text-shadow-violet-950/50 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        
        {/* Logo */}
        <Link href="/" className="text-primary font-bold text-2xl">
          A.V
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex gap-6 items-center" aria-label="Navegación principal">

          <Boton onClick={() => router.push('/#inicio')} variante='sencillo'>
            <span className="flex items-center gap-2">
              <House className="w-4 h-4" />
              Inicio
            </span>
          </Boton>

          <Boton onClick={() => abrirSidebar("registro")} variante="sencillo">
            <span className="flex items-center gap-2">
              <Pen className="w-4 h-4" />
              Regístrate
            </span>
          </Boton>

          <Boton onClick={() => router.push('/#catalogo-premios')} variante='sencillo'>
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Productos para canjear
            </span>
          </Boton>

        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-4">

          <Boton onClick={() => abrirSidebar("login")} variante="primario">
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4"/>
              Ingresar
            </span>
          </Boton>
        </div>

      </div>
    </header>
  );
}
