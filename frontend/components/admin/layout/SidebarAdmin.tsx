/* Ubicación: frontend/components/admin/layout/SidebarAdmin.tsx
  Cambios: Se agregó la sección inferior para "Volver al Inicio" usando mt-auto para empujarlo al final.
*/
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pen, ShoppingCart, User, ArrowLeft, Package } from "lucide-react";

type ItemNav = { href: string; label: string; icon?: React.ReactNode };

const items: ItemNav[] = [
  {
    href: "/admin/panel",
    label: "Panel clientes",
    icon: <User className="h-4 w-4" />,
  },
  {
    href: "/?edit=premios",
    label: "Cargar Premios",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    href: "/admin/canjes",
    label: "Solicitudes de Canje",
    icon: <Package className="h-4 w-4" />,
  },
  {
    href: "/admin/clientes",
    label: "Modificación y Datos de usuarios",
    icon: <Pen className="h-4 w-4" />,
  },
];

export const SidebarAdmin = () => {
  const pathname = usePathname();

  const esActivo = (href: string) => pathname?.startsWith(href);

  return (
    <nav className="flex flex-col gap-6 p-4 bg-background-secondary shadow-md shadow-gray-400 h-screen">
      {/* Encabezado / Branding */}
      <div className="px-2">
        <h2 className="text-lg font-semibold">Administración</h2>
        <p className="text-xs text-gray-500">Opciones de gestión</p>
      </div>

      {/* Navegación Principal */}
      <ul className="space-y-1 flex-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors border border-transparent ${
                esActivo(item.href)
                  ? "bg-gray-100 text-gray-900 border-gray-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span
                className={
                  esActivo(item.href) ? "text-gray-900" : "text-gray-500"
                }
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Navegación Secundaria (Bottom) */}
      <div className="border-t border-gray-200 pt-4 mt-auto">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          title="Volver a la vista pública sin cerrar sesión"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </nav>
  );
};
