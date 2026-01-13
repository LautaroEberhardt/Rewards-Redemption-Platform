import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="brand">Uniformes</Link>
          </div>

          <nav className="nav-links" aria-label="Navegación principal">
            <Link href="/" className="nav-link">Inicio</Link>
            <Link href="/productos" className="nav-link">Productos</Link>
            <Link href="/contacto" className="nav-link">Contacto</Link>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="btn-primary">Ingresar</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
