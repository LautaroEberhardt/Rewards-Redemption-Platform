import Link from 'next/link';
import { Boton } from '../ui/boton';

export default function BarraNavegacion() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background-secondary text-shadow-violet-950/50 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        
        {/* Logo */}
        <Link href="/" className="text-primary font-bold text-xl no-underline">
          Uniformes
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex gap-6 items-center" aria-label="Navegación principal">
          <Link href="/" className="text-text-primarypx-3 py-2">
            Inicio
          </Link>
          <Link href="/registrar" className="text-text-primary px-3 py-2">
            Registrate
          </Link>
          <Link href="/productos" className="text-text-primary px-3 py-2 hover:text-secondary-hover">
            Productos para canjear
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Boton>Ingresar</Boton>
          </Link>
        </div>
      </div>
    </header>
  );
}
