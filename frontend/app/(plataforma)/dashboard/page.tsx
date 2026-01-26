// frontend/app/(plataforma)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const sesion = await auth();

  if (!sesion) redirect("/");

  const esAdmin = sesion.user.rol === "ADMIN";

  return (
    <div>
      <h1>Bienvenido, {sesion.user.name}</h1>
      {esAdmin ? (
        <p className="text-red-600 font-bold">MODO ADMINISTRADOR ACTIVADO</p>
      ) : (
        <p className="text-blue-600 font-bold">VISTA CLIENTE (PUNTOS)</p>
      )}
    </div>
  );
}