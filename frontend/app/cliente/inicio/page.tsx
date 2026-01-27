import { TarjetaPuntos } from "@/components/cliente/billetera/TarjetaPuntos";

export default function PageInicioCliente() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tu billetera</h1>
      <TarjetaPuntos puntos={0} nivel="Bronce" />
    </section>
  );
}
