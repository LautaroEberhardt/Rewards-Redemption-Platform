
export type TipoTransaccion = 'INGRESO' | 'EGRESO'; // Ajusta según tu Enum del backend

export interface TransaccionPuntosInterfaz {
  id: string;
  usuarioId: string; // Relación con el usuario
  puntos: number;    // Cantidad (ej: 100)
  tipo: TipoTransaccion;
  concepto: string;  // Ej: "Compra en tienda", "Canje de premio"
  fechaCreacion: string; // ISO Date String que viene de la BD
  
  // Opcionales (depende si tu backend devuelve el objeto completo o solo IDs)
  usuario?: {
    nombre: string;
    email: string;
  };
}

export interface RespuestaAsignacion {
  exito: boolean;
  nuevoSaldo: number;
  transaccion: TransaccionPuntosInterfaz;
}