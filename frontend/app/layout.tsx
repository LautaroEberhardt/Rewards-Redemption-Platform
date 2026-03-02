import React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import { FondoDegradado } from "@/components/ui/fondo-degradado";
import { SidebarGlobal } from "@/components/layout/SidebarGlobal";
import { ProvidersWrapper } from "@/components/layout/ProvidersWrapper";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Sistema de Fidelización",
  description: "Plataforma de asignación y canje de puntos",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es">
      <body>
        <FondoDegradado>
          <ProvidersWrapper session={session}>
            <main>{children}</main>
            <SidebarGlobal />
          </ProvidersWrapper>
        </FondoDegradado>
      </body>
    </html>
  );
}
