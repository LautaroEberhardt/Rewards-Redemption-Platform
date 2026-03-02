import { FormularioRestablecerContrasena } from "@/components/auth/FormularioRestablecerContrasena";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function PageRecuperarContrasena({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  return (
    <section className="w-full max-w-md">
      <FormularioRestablecerContrasena token={token} />
    </section>
  );
}
