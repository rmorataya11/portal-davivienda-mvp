import nodemailer from "nodemailer";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendNotificationEmail(subject: string, htmlBody: string) {
  try {
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS;
    const to = process.env.NOTIFICATION_EMAIL?.trim();

    if (!host || !Number.isFinite(port) || !user || !pass || !to) {
      console.error("SMTP no está configurado. Se omitió el envío de correo.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: user,
      to,
      subject,
      html: htmlBody,
    });
    console.info("Correo de notificación enviado.");
  } catch (error) {
    console.error("No se pudo enviar el correo de notificación.", error);
  }
}
