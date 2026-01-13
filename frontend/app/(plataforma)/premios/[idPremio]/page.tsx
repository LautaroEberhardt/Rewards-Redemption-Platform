export default function PremioDetalle({ params }: { params: { idPremio: string } }) {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Detalle del premio {params.idPremio}</h1>
      <p className="mt-2 text-sm text-gray-600">Información y opción de canje (placeholder).</p>
    </section>
  );
}
