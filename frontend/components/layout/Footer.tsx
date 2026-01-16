export default function FooterLayout() {
  return (
    <footer className="bg-background-secondary text-text-secondary mt-auto shadow-[0_-8px_20px_-8px_rgba(0,0,0,0.12)]">
      <div className="container py-6 text-center text-sm">
        <div>Copyright © {new Date().getFullYear()} - Desarrollado by Lautaro Eberhardt</div>
      </div>
    </footer>
  );
}
