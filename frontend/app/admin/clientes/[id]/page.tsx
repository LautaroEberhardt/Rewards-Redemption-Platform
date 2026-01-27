type Props = { params: { id: string } };

export default function PageDetalleCliente({ params }: Props) {
  return (
    <section>
      <h1 className="text-2xl font-bold">Cliente #{params.id}</h1>
    </section>
  );
}
