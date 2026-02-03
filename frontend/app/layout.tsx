import React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import { FondoDegradado } from "@/components/ui/fondo-degradado";
import { ProveedorUI } from "@/context/ui-context";
import { SidebarGlobal } from "@/components/layout/SidebarGlobal";
import { SessionProvider } from "next-auth/react";
import { ToastProvider, ToastViewport } from "../components/ui/toast";

export const metadata = {
  title: "Sistema Uniformes",
  description: "Aplicación de gestión de uniformes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <FondoDegradado>
          <SessionProvider>
            <ToastProvider>
              <ProveedorUI>
                <main>{children}</main>
                <SidebarGlobal />
                <ToastViewport />
              </ProveedorUI>
            </ToastProvider>
          </SessionProvider>
        </FondoDegradado>
      </body>
    </html>
  );
}
