import nodemailer, { Transporter } from 'nodemailer';

export interface AdaptadorCorreo {
  enviarCorreo(destinatario: string, asunto: string, html: string): Promise<void>;
}

export class AdaptadorCorreoGmail implements AdaptadorCorreo {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CORREO_GMAIL,
        pass: process.env.CORREO_GMAIL_APP_PASSWORD,
      },
    });
  }

  async enviarCorreo(destinatario: string, asunto: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.CORREO_GMAIL,
      to: destinatario,
      subject: asunto,
      html,
    });
  }
}
