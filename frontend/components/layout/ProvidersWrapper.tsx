"use client";

import React from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ProveedorUI } from "@/context/ui-context";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function ProvidersWrapper({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <ProveedorUI>
          {children}
          <ToastViewport />
        </ProveedorUI>
      </ToastProvider>
    </SessionProvider>
  );
}
