import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  const rol = (session?.user as { rol?: string } | undefined)?.rol;
  const esAdmin = rol === "ADMIN" || rol === "admin";
  if (!esAdmin) {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
