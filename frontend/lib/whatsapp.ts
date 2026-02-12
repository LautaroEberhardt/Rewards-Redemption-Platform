import { ConfigNegocio } from "./constantes";

export const generarEnlaceCanje = (
  nombreUsuario: string,
  nombrePremio: string,
  idTransaccion: string,
): string => {
  const texto = `Hola ${ConfigNegocio.NOMBRE_EMPRESA}, quiero canjear mi premio:
🎁 *${nombrePremio}*
🆔 Ticket: #${idTransaccion}
👤 Usuario: ${nombreUsuario}`;

  return `https://wa.me/${ConfigNegocio.TELEFONO_PEDIDOS}?text=${encodeURIComponent(texto)}`;
};
