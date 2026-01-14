export default function Page() {
  return (
    <>
      <main id="main" className="container">
        <section className="hero">
          <h1 className="text-3xl md:text-4xl font-bold">Bienvenido a Sistema Uniformes</h1>
          <p className="mt-4 text-lg text-gray-600">Panel de ejemplo usando variables de color y configuración global.</p>
        </section>

        <section className="section">
          <h2 className="text-2xl font-semibold">Contenido de ejemplo</h2>
          <p className="mt-2">Esta página muestra el header fijo y el footer. Desplázate para ver el comportamiento de scroll.</p>

          <div className="mt-6 space-y-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <article key={i} className="p-4 border rounded-md" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="font-semibold">Sección {i + 1}</h3>
                <p className="mt-2 text-sm text-gray-700">Contenido de ejemplo para probar el scroll y la separación entre secciones.</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
