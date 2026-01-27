import { TarjetaPremio as Tarjeta } from "@/components/cliente/catalogo/TarjetaPremio";

export default function PageCanje() {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Tarjeta
        id={1}
        nombre="Ejemplo"
        descripcion="Premio de ejemplo"
        costoPuntos={100}
      />
    </section>
  );
}
