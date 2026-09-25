import path from "node:path";

import nodemailer from "nodemailer";

export const EMAIL_LOGO_WHITE_CID = "davivienda-logo-white";
export const EMAIL_LOGO_COLOR_CID = "davivienda-logo-color";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type NotificationEmailPriority = "high" | "normal";

type SendEmailOptions = {
  to: string;
  subject: string;
  htmlBody: string;
  fromName?: string;
  priority?: NotificationEmailPriority;
};

async function sendEmail({ to, subject, htmlBody, fromName, priority = "normal" }: SendEmailOptions) {
  try {
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS;

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
      from: fromName ? `${fromName} <${user}>` : user,
      to,
      subject,
      html: htmlBody,
      priority,
      attachments: [
        {
          filename: "davivienda-white.png",
          path: path.join(process.cwd(), "public/logo/davivienda-white.png"),
          cid: EMAIL_LOGO_WHITE_CID,
          contentDisposition: "inline",
        },
        {
          filename: "davivienda.png",
          path: path.join(process.cwd(), "public/logo/davivienda.png"),
          cid: EMAIL_LOGO_COLOR_CID,
          contentDisposition: "inline",
        },
      ],
    });
    console.info("Correo de notificación enviado.", {
      subject,
      priority,
      kind: fromName ? "confirmation" : "internal",
    });
  } catch (error) {
    console.error("No se pudo enviar el correo de notificación.", error);
  }
}

export async function sendNotificationEmail(
  subject: string,
  htmlBody: string,
  priority: NotificationEmailPriority = "normal",
) {
  const to = process.env.NOTIFICATION_EMAIL?.trim();

  if (!to) {
    console.error("NOTIFICATION_EMAIL no está configurada. Se omitió el envío de correo.");
    return;
  }

  await sendEmail({ to, subject, htmlBody, priority });
}

export async function sendConfirmationEmail(to: string, subject: string, htmlBody: string) {
  await sendEmail({
    to,
    subject,
    htmlBody,
    fromName: "No Responder - Soporte Davivienda",
  });
}
