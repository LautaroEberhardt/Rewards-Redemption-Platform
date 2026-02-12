export const Roles = {
  Admin: "admin",
  Cliente: "cliente",
} as const;

export const Rutas = {
  login: "/login",
  registro: "/registro",
  admin: "/admin",
  cliente: "/cliente",
} as const;

export const ConfigNegocio = {
  TELEFONO_PEDIDOS: process.env.NEXT_PUBLIC_WHATSAPP_TELEFONO || "",
  NOMBRE_EMPRESA: "AyV Uniformes",
} as const;
