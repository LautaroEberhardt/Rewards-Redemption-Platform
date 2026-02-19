import { BurbujaWhatsappFlotante } from "@/components/ui/BurbujaWhatsappFlotante";
("use client");

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { obtenerPerfilAction, actualizarPerfilAction } from "@/actions/perfil";
import FormularioPerfil, {
  type DatosPerfilForm,
} from "@/components/cliente/perfil/FormularioPerfil";
import type { Usuario } from "@/tipos/usuario";

export default function PerfilPage() {
  const { status } = useSession();
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  /* ── Cargar perfil vía server action ── */
  const cargarPerfil = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await obtenerPerfilAction();
      if (resultado.ok) {
        setUsuario(resultado.usuario);
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el perfil.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    // Autenticado → el server action maneja el token internamente
    cargarPerfil();
  }, [status, cargarPerfil, router]);

  /* ── Guardar perfil vía server action ── */
  const manejarGuardar = async (datos: DatosPerfilForm) => {
    setGuardando(true);
    setError(null);
    setExito(null);
    try {
      const resultado = await actualizarPerfilAction(datos);
      if (resultado.ok) {
        setUsuario(resultado.usuario);
        setExito("Perfil actualizado correctamente.");
        setTimeout(() => setExito(null), 3000);
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar el perfil.",
      );
    } finally {
      setGuardando(false);
    }
  };

  /* ── Estados de carga ── */
  if (status === "loading" || cargando) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="max-w-lg mx-auto mt-12 p-6 bg-red-50 rounded-lg text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700">{error ?? "Perfil no disponible."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {exito && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {exito}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <FormularioPerfil
            usuario={usuario}
            guardando={guardando}
            onGuardar={manejarGuardar}
          />
        </div>
      </div>
      <BurbujaWhatsappFlotante />
    </>
  );
}
