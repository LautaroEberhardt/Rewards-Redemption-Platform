export enum EstadoCanje {
  PENDIENTE = 'PENDIENTE', // El cliente lo pidió en la app, pero no fue al local
  ENTREGADO = 'ENTREGADO', // El gerente le dio el producto
  CANCELADO = 'CANCELADO', // Se arrepintieron (se devuelven los puntos)
}
