type Props = { puntos: number; nivel: string };

export function TarjetaPuntos({ puntos, nivel }: Props) {
  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="text-sm text-gray-500">Nivel</div>
      <div className="text-lg font-semibold">{nivel}</div>
      <div className="mt-3 text-sm text-gray-500">Puntos</div>
      <div className="text-2xl font-bold">{puntos}</div>
    </div>
  );
}
