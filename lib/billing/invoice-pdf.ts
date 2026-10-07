export type InvoicePdfInput = {
  id: string;
  periodLabel: string;
  dateLabel: string;
  amountLabel: string;
  statusLabel: string;
  holder: string;
  accountLabel: string;
  contractFolio: string;
  apiName: string;
};

const encoder = new TextEncoder();

function pdfString(value: string) {
  const extras: Record<string, number> = {
    á: 0xe1,
    é: 0xe9,
    í: 0xed,
    ó: 0xf3,
    ú: 0xfa,
    Á: 0xc1,
    É: 0xc9,
    Í: 0xcd,
    Ó: 0xd3,
    Ú: 0xda,
    ñ: 0xf1,
    Ñ: 0xd1,
    ü: 0xfc,
    "·": 0xb7,
    "°": 0xb0,
  };

  let output = "(";

  for (const char of value) {
    if (char === "\\" || char === "(" || char === ")") {
      output += `\\${char}`;
      continue;
    }

    const code = extras[char] ?? char.charCodeAt(0);
    if (code < 32 || code > 255) {
      output += "-";
      continue;
    }

    if (code > 126) {
      output += `\\${code.toString(8).padStart(3, "0")}`;
      continue;
    }

    output += char;
  }

  return `${output})`;
}

function line(x: number, y: number, size: number, text: string, font = "F1") {
  return `BT /${font} ${size} Tf ${x} ${y} Td ${pdfString(text)} Tj ET`;
}

function concat(chunks: Uint8Array[]) {
  const bytes = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0));
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }

  return bytes;
}

export function buildInvoicePdf(input: InvoicePdfInput) {
  const rows = [
    ["Factura", input.id],
    ["Estado", input.statusLabel],
    ["Cliente", input.holder],
    ["Cuenta", input.accountLabel],
    ["Contrato", input.contractFolio || "-"],
    ["API", input.apiName],
    ["Periodo", input.periodLabel],
    ["Fecha", input.dateLabel],
    ["Monto", input.amountLabel],
  ];

  const content = [
    "0.882 0.145 0.106 rg",
    "0 747 612 45 re f",
    "1 1 1 rg",
    line(40, 764, 16, "Davivienda", "F2"),
    line(40, 752, 9, "API Marketplace", "F1"),
    "0.251 0.251 0.251 rg",
    line(40, 700, 18, `Factura ${input.id}`, "F2"),
    line(40, 678, 11, "Débito a cuenta Davivienda asociado al contrato de producción.", "F1"),
    "0.906 0.918 0.933 rg",
    "40 662 532 1 re f",
    "0.251 0.251 0.251 rg",
    ...rows.flatMap(([label, value], index) => {
      const y = 640 - index * 28;
      return ["0.557 0.557 0.557 rg", line(40, y, 9, label, "F1"), "0.251 0.251 0.251 rg", line(160, y, 11, value, "F1")];
    }),
    "0.557 0.557 0.557 rg",
    line(40, 360, 9, "Documento generado desde el portal de desarrolladores.", "F1"),
  ].join("\n");

  const stream = `${content}\n`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];

  const chunks: Uint8Array[] = [];
  const offsets = [0];
  let size = 0;

  const write = (value: string) => {
    const bytes = encoder.encode(value);
    chunks.push(bytes);
    size += bytes.length;
  };

  write("%PDF-1.4\n");

  objects.forEach((object, index) => {
    offsets.push(size);
    write(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const xref = size;
  write(`xref\n0 ${objects.length + 1}\n`);
  write("0000000000 65535 f \n");

  for (let index = 1; index <= objects.length; index += 1) {
    write(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }

  write(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return concat(chunks);
}

export function downloadInvoicePdf(input: InvoicePdfInput) {
  const bytes = buildInvoicePdf(input);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${input.id}.pdf`;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
