export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500 text-center md:text-left">
            &copy; {currentYear} Sistema de Uniformes. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-400 hover:text-neutral-500">
              <span className="sr-only">Ayuda</span>
              Ayuda
            </a>
            <a href="#" className="text-neutral-400 hover:text-neutral-500">
              <span className="sr-only">Contacto</span>
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
