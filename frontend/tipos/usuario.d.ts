export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "cliente";
  puntos?: number;
}
