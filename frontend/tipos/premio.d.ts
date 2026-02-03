export interface Premio {
  id: number;
  nombre: string;
  descripcion?: string;
  costoPuntos: number;
  imagenUrl?: string;
  activo?: boolean;
}
