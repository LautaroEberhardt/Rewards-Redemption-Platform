export default function TarjetaPremio({ title, points }: { title: string; points: number }) {
  return (
    <article className="p-4 border rounded-md bg-white" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{points} pts</p>
    </article>
  );
}
