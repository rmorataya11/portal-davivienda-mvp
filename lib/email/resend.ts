import { Resend } from "resend";

const FROM_EMAIL = "onboarding@resend.dev";
const DEFAULT_TO_EMAIL = "renemorataya11@gmail.com";

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
    const apiKey = process.env.RESEND_API_KEY?.trim();

    if (!apiKey) {
      console.error("RESEND_API_KEY no está configurada. Se omitió el envío de correo.");
      return;
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: process.env.NOTIFICATION_EMAIL?.trim() || DEFAULT_TO_EMAIL,
      subject,
      html: htmlBody,
    });

    if (result.error) {
      console.error("Resend rechazó el envío de correo.", result.error);
    }
  } catch (error) {
    console.error("No se pudo enviar el correo de notificación.", error);
  }
}
