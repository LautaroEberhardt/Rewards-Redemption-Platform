import TarjetaPremio from './componentes/TarjetaPremio';

export default function PremiosPage() {
  const premios = [
    { id: '1', title: 'Remera Oficial', points: 500 },
    { id: '2', title: 'Gorra', points: 200 },
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold">Catálogo de Premios</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {premios.map((p) => (
          <TarjetaPremio key={p.id} title={p.title} points={p.points} />
        ))}
      </div>
    </section>
  );
}
