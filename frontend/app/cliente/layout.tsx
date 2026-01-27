import React from "react";
import { NavbarCliente } from "@/components/cliente/layout/NavbarCliente";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <NavbarCliente />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
