import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface IAdaptadorCorreo {
  enviarCorreoRecuperacion(destinatario: string, enlaceRecuperacion: string): Promise<void>;
}

@Injectable()
export class AdaptadorCorreoGmail implements IAdaptadorCorreo {
  private readonly registrador = new Logger(AdaptadorCorreoGmail.name);
  private transportador: nodemailer.Transporter;

  constructor() {
    this.transportador = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CORREO_GMAIL,
        pass: process.env.CORREO_GMAIL_APP_PASSWORD,
      },
    });
  }

  async enviarCorreoRecuperacion(destinatario: string, enlaceRecuperacion: string): Promise<void> {
    const opcionesCorreo = {
      from: `"Sistema de Fidelización" <${process.env.CORREO_GMAIL}>`,
      to: destinatario,
      subject: 'Recuperación de Contraseña',
      html: `
        <h2>Restablecer tu contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para crear una nueva:</p>
        <a href="${enlaceRecuperacion}" target="_blank" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
          Restablecer Contraseña
        </a>
        <p>Si no solicitaste esto, puedes ignorar este correo de forma segura.</p>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    };

    try {
      await this.transportador.sendMail(opcionesCorreo);
      this.registrador.log(`Correo de recuperación enviado exitosamente a: ${destinatario}`);
    } catch (error) {
      this.registrador.error(`Fallo crítico al enviar correo a ${destinatario}`, error);
      throw new InternalServerErrorException(
        'No se pudo enviar el correo de recuperación. Contacte al administrador.',
      );
    }
  }
}
