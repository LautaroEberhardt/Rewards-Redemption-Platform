"use client";
import { useEffect, useState } from "react";
import { listarPremios } from "@/servicios/premios.servicio";

type Premio = { id: number; nombre: string; costoPuntos: number };

export function TablaPremios() {
  const [premios, setPremios] = useState<Premio[]>([]);
  useEffect(() => {
    listarPremios()
      .then(setPremios)
      .catch(() => setPremios([]));
  }, []);
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-50">
          <th className="text-left p-2 border">ID</th>
          <th className="text-left p-2 border">Nombre</th>
          <th className="text-left p-2 border">Puntos</th>
        </tr>
      </thead>
      <tbody>
        {premios.map((p) => (
          <tr key={p.id}>
            <td className="p-2 border">{p.id}</td>
            <td className="p-2 border">{p.nombre}</td>
            <td className="p-2 border">{p.costoPuntos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
