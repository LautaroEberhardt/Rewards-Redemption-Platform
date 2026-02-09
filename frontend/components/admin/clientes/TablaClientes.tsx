import { Usuario } from "@/tipos/usuario";

interface Props {
  usuarios: Usuario[];
  onEditar?: (usuario: Usuario) => void;
}

export const TablaClientes = ({ usuarios, onEditar }: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 uppercase text-gray-700">
          <tr>
            <th className="px-6 py-3 font-semibold">Cliente</th>
            <th className="px-6 py-3 font-semibold">Email</th>
            <th className="px-6 py-3 font-semibold">Puntos</th>
            <th className="px-6 py-3 font-semibold text-center">Estado</th>
            <th className="px-6 py-3 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No hay clientes registrados aún.
              </td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {usuario.nombre}
                </td>
                <td className="px-6 py-4">{usuario.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {usuario.puntos} pts
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-green-500"
                    title="Activo"
                  ></span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 font-medium text-xs uppercase"
                    onClick={() => onEditar?.(usuario)}
                  >
                    Ver / Editar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
