'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House, Pen, ShoppingCart, LogIn, Menu, X } from 'lucide-react';
import { Boton } from '../ui/boton';
import { useUI } from '@/context/ui-context';

export default function BarraNavegacion() {
  const { abrirSidebar } = useUI();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Función auxiliar para cerrar el menú al navegar
  const manejarNavegacion = (accion: () => void) => {
    setMenuAbierto(false);
    accion();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background-secondary text-shadow-violet-950/50 shadow-sm transition-all">
      <div className="container flex items-center justify-between py-4">
        
        {/* 1. LOGO */}
        <Link href="/" className="text-primary font-bold text-2xl z-50">
          A.V
        </Link>

        {/* 2. NAVEGACIÓN DESKTOP (Oculta en móviles) */}
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

        {/* 3. ACCIONES DESKTOP (Oculta en móviles) */}
        <div className="hidden md:flex items-center gap-4">
          <Boton onClick={() => abrirSidebar("login")} variante="primario">
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4"/>
              Ingresar
            </span>
          </Boton>
        </div>

        {/* 4. BOTÓN HAMBURGUESA (Visible solo en móviles) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-primary p-2 focus:outline-none"
            aria-label="Alternar menú"
          >
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 5. MENÚ MÓVIL DESPLEGABLE */}
      {/* Renderizado condicional del panel móvil */}
      {menuAbierto && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background-secondary border-t border-gray-100 shadow-lg flex flex-col p-4 gap-4 animate-in slide-in-from-top-5 fade-in duration-200">
          
          <Boton 
            onClick={() => manejarNavegacion(() => router.push('/#inicio'))} 
            variante='sencillo'
            className="w-full justify-start" // Ajuste para que ocupe todo el ancho
          >
            <span className="flex items-center gap-2">
              <House className="w-4 h-4" />
              Inicio
            </span>
          </Boton>

          <Boton 
            onClick={() => manejarNavegacion(() => abrirSidebar("registro"))} 
            variante="sencillo"
            className="w-full justify-start"
          >
            <span className="flex items-center gap-2">
              <Pen className="w-4 h-4" />
              Regístrate
            </span>
          </Boton>

          <Boton 
            onClick={() => manejarNavegacion(() => router.push('/#catalogo-premios'))} 
            variante='sencillo'
            className="w-full justify-start"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Productos para canjear
            </span>
          </Boton>

          <div className="border-t border-gray-200 my-2 pt-2">
            <Boton 
              onClick={() => manejarNavegacion(() => abrirSidebar("login"))} 
              variante="primario"
              className="w-full justify-center"
            >
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4"/>
                Ingresar
              </span>
            </Boton>
          </div>
        </div>
      )}
    </header>
  );
}