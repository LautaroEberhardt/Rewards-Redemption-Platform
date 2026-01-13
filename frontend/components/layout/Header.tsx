import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo o Título */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              Sistema Uniformes
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-neutral-600 hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link href="/pedidos" className="text-neutral-600 hover:text-primary transition-colors">
              Mis Pedidos
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
