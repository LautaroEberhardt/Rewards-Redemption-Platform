"use client";
import Link from "next/link";

export function BotonAgregarPremioFlotante() {
  return (
    <Link
      href="/?edit=premios&crear=1"
      title="Añadir premio"
      className="bg-background-secondary border-2 border-primary fixed bottom-6 right-6 z-50 rounded-full w-40 h-12 text-white flex items-center justify-center shadow-lg hover:bg-primary-hover"
    >
      <span className="leading-none">agregar premio +</span>
    </Link>
  );
}
