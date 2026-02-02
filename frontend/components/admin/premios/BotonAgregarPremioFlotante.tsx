"use client";
import Link from "next/link";

export function BotonAgregarPremioFlotante() {
  return (
    <Link
      href="/?edit=premios&crear=1"
      title="Añadir premio"
      className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-hover"
    >
      <span className="text-2xl leading-none">+</span>
    </Link>
  );
}
