export default function FooterLayout() {
  return (
    <footer className="bg-background-secondary border-t border-border text-text-secondary mt-auto">
      <div className="container py-6 text-center text-sm">
        <div>© {new Date().getFullYear()} Uniformes · Todos los derechos reservados</div>
      </div>
    </footer>
  );
}
