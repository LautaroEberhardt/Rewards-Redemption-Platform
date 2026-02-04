"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Boton } from "@/components/ui/boton";
import { crearPremio } from "@/servicios/premios.servicio";

interface Props {
  token: string;
  onSaved: (nuevo: {
    id: number;
    nombre: string;
    descripcion?: string;
    costoPuntos: number;
    imagenUrl?: string;
  }) => void;
  onCancel: () => void;
}

export function FormularioPremio({ token, onSaved, onCancel }: Props) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [cargando, setCargando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");
  const [archivo, setArchivo] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const manejarCambioArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setArchivo(undefined);
      setPreviewUrl(undefined);
    }
  };

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError("No hay token de sesión");
      return;
    }
    setCargando(true);
    try {
      const nuevo = await crearPremio(
        {
          nombre,
          costoPuntos: costo,
          descripcion: descripcion?.trim() || undefined,
          imagen: archivo,
        },
        token,
      );
      showSuccess("Premio creado");
      onSaved(nuevo);
      // limpiar formulario
      setNombre("");
      setCosto(0);
      setDescripcion("");
      setArchivo(undefined);
      setPreviewUrl(undefined);
      router.refresh();
    } catch (error: any) {
      showError(error?.message || "Error al crear el premio");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form
      onSubmit={manejarEnvio}
      className="space-y-4 p-4 border rounded-2xl bg-white w-full max-w-lg"
    >
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del Premio
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border p-2 w-full rounded"
          placeholder="Ej: Auriculares Bluetooth"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Costo en Puntos
        </label>
        <input
          type="number"
          value={costo}
          onChange={(e) => setCosto(Number(e.target.value))}
          required
          min={1}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Describe los detalles del premio..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={manejarCambioArchivo}
          className="border p-2 w-full rounded"
        />
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="max-h-40 rounded-md border"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Cancelar
        </button>
        <Boton type="submit" disabled={cargando} variante="secundario">
          {cargando ? "Guardando..." : "Crear Premio"}
        </Boton>
      </div>
    </form>
  );
}
