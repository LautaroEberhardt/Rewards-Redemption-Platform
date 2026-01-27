import { FormularioAsignarPuntos } from "@/components/admin/asignacion/FormularioAsignarPuntos";

export default function PageAsignarPuntos() {
  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Asignar puntos</h1>
      <FormularioAsignarPuntos />
    </section>
  );
}
