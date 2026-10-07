import { EMAIL_LOGO_COLOR_CID, EMAIL_LOGO_WHITE_CID, escapeHtml } from "@/lib/email/mailer";

type EmailField = {
  label: string;
  value: string;
};

const SUPPORT_SEVERITY_LABELS: Record<string, string> = {
  bloqueante: "Bloqueante",
  importante: "Importante",
  consulta: "Consulta general",
};

const SUPPORT_SEVERITY_COLORS: Record<string, string> = {
  bloqueante: "#E1251B",
  importante: "#141F25",
  consulta: "#5B636A",
};

const INDUSTRY_LABELS: Record<string, string> = {
  fintech: "Fintech",
  retail: "Retail",
  seguros: "Seguros",
  telecomunicaciones: "Telecomunicaciones",
  otro: "Otro",
};

const VOLUME_LABELS: Record<string, string> = {
  "lt-1000": "Menos de 1,000",
  "1000-10000": "1,000 – 10,000",
  "10000-100000": "10,000 – 100,000",
  "gt-100000": "+100,000",
};

const ENVIRONMENT_LABELS: Record<string, string> = {
  "pruebas-extendidas": "Pruebas extendidas",
  produccion: "Producción",
};

function labelFor(value: string, labels: Record<string, string>) {
  return labels[value] ?? value;
}

function formatMultiline(value: string) {
  return escapeHtml(value).replace(/\r\n|\n|\r/g, "<br>");
}

function renderFields(fields: EmailField[]) {
  return fields
    .map(
      (field, index) => `
        <tr>
          <td style="padding:${index === 0 ? "0" : "12px"} 0 0;border-top:${index === 0 ? "0" : "1px solid #E7EAEE"};">
            <p style="margin:0 0 4px;font-size:12px;line-height:18px;letter-spacing:0.2px;color:#6A7178;text-transform:uppercase;">
              ${escapeHtml(field.label)}
            </p>
            <p style="margin:0;font-size:15px;line-height:22px;color:#141F25;">
              ${formatMultiline(field.value)}
            </p>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderNotificationEmail(options: {
  eyebrow: string;
  title: string;
  badge: string;
  badgeColor: string;
  intro: string;
  fields: EmailField[];
  note?: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <body style="margin:0;padding:0;background:#F4F6F8;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E7EAEE;">
                <tr>
                  <td style="padding:20px 24px;background:#E1251B;">
                    <img
                      src="cid:${EMAIL_LOGO_WHITE_CID}"
                      alt="Davivienda"
                      width="168"
                      height="22"
                      style="display:block;border:0;outline:none;height:22px;width:auto;"
                    />
                    <p style="margin:16px 0 6px;font-size:12px;line-height:18px;letter-spacing:0.4px;text-transform:uppercase;color:#ffffff;">
                      ${escapeHtml(options.eyebrow)}
                    </p>
                    <h1 style="margin:0;font-size:22px;line-height:28px;color:#ffffff;">
                      ${escapeHtml(options.title)}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="height:6px;background:#E1111C;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:20px 24px 8px;">
                    <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${options.badgeColor};color:#ffffff;font-size:12px;line-height:18px;font-weight:700;">
                      ${escapeHtml(options.badge)}
                    </span>
                    <p style="margin:14px 0 0;font-size:15px;line-height:23px;color:#5B636A;">
                      ${escapeHtml(options.intro)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${renderFields(options.fields)}
                    </table>
                    ${
                      options.note
                        ? `<p style="margin:20px 0 0;font-size:13px;line-height:20px;color:#6A7178;">${escapeHtml(options.note)}</p>`
                        : ""
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;background:#F8FAFB;border-top:1px solid #E7EAEE;">
                    <img
                      src="cid:${EMAIL_LOGO_COLOR_CID}"
                      alt="Davivienda"
                      width="140"
                      height="18"
                      style="display:block;border:0;outline:none;height:18px;width:auto;"
                    />
                    <p style="margin:10px 0 0;font-size:12px;line-height:18px;color:#8A9198;">
                      API Marketplace · notificación automática
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function renderSupportCaseEmail(input: {
  id: string;
  titulo: string;
  descripcion: string;
  severidad: string;
  status: string;
  developerId: string | null;
  apiSlug?: string;
}) {
  const severityLabel = labelFor(input.severidad, SUPPORT_SEVERITY_LABELS);

  return renderNotificationEmail({
    eyebrow: "Soporte",
    title: input.titulo,
    badge: severityLabel.toUpperCase(),
    badgeColor: SUPPORT_SEVERITY_COLORS[input.severidad] ?? "#141F25",
    intro: "Se registró un nuevo caso de soporte en el portal.",
    fields: [
      { label: "ID del caso", value: input.id },
      { label: "Severidad", value: severityLabel },
      { label: "Estado", value: input.status === "abierto" ? "Abierto" : input.status },
      { label: "API afectada", value: input.apiSlug || "No aplica / General" },
      { label: "Developer", value: input.developerId ?? "No identificado" },
      { label: "Descripción", value: input.descripcion },
    ],
  });
}

export function renderSupportCaseConfirmationEmail(input: { id: string; titulo: string }) {
  return renderNotificationEmail({
    eyebrow: "Soporte",
    title: "Hemos recibido su caso",
    badge: "CONFIRMACIÓN",
    badgeColor: "#141F25",
    intro:
      "Confirmamos que recibimos su caso de soporte. Nuestro equipo lo revisará y se pondrá en contacto con usted pronto.",
    fields: [
      { label: "Caso", value: input.titulo },
      { label: "Referencia", value: input.id },
    ],
    note: "Este es un mensaje automático enviado desde una dirección de no-respuesta. No responda este correo. Si necesita agregar información, abra un nuevo caso en el portal o espere el contacto de nuestro equipo.",
  });
}

export function renderContractingRequestEmail(input: {
  id: string;
  razonSocial: string;
  nit: string;
  industria: string;
  casoUso: string;
  volumenEstimado: string;
  ambienteDestino: string;
  ipWhitelist: string | null;
  apiProduct: string;
  contactoTecnicoNombre: string;
  contactoTecnicoEmail: string;
  contactoTecnicoTelefono: string | null;
}) {
  return renderNotificationEmail({
    eyebrow: "Contratación",
    title: input.razonSocial,
    badge: "CONTRATACIÓN",
    badgeColor: "#E1251B",
    intro: "Se recibió una nueva solicitud de contratación.",
    fields: [
      { label: "ID de la solicitud", value: input.id },
      { label: "API", value: input.apiProduct },
      { label: "Razón social", value: input.razonSocial },
      { label: "NIT", value: input.nit },
      { label: "Industria", value: labelFor(input.industria, INDUSTRY_LABELS) },
      { label: "Caso de uso", value: input.casoUso },
      { label: "Volumen estimado", value: labelFor(input.volumenEstimado, VOLUME_LABELS) },
      { label: "Ambiente destino", value: labelFor(input.ambienteDestino, ENVIRONMENT_LABELS) },
      { label: "IP whitelist", value: input.ipWhitelist || "No aplica" },
      { label: "Contacto técnico", value: input.contactoTecnicoNombre },
      { label: "Email técnico", value: input.contactoTecnicoEmail },
      { label: "Teléfono técnico", value: input.contactoTecnicoTelefono || "No indicado" },
    ],
  });
}
