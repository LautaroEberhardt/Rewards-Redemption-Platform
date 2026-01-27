"use client";
import { BotonSocial } from "@/components/auth/BotonSocial";

export const BotonGoogle = ({ onClick }: { onClick?: () => void }) => {
  return <BotonSocial proveedor="google" onClick={onClick} />;
};
