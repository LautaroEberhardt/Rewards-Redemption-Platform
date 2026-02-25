export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: "admin" | "cliente";
  puntos?: number;
  telefono?: string;
  foto?: string;
  googleId?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
