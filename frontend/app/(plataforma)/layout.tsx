import '@/app/globals.css';

export default function PlataformaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <aside className="w-64 p-4 border-r" style={{ borderColor: 'var(--color-border)' }}>
        <div className="font-semibold mb-4">Plataforma</div>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard" className="text-sm">Dashboard</a>
          <a href="/premios" className="text-sm">Premios</a>
          <a href="/historial" className="text-sm">Historial</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
