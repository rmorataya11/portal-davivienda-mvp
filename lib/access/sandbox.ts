export const SANDBOX_REQUEST_HREF = "/solicitud-contratacion?tipo=sandbox";
export const PRODUCTION_REQUEST_HREF = "/solicitud-contratacion?tipo=produccion";

export const ACCESS_ENVIRONMENTS = ["sandbox", "produccion"] as const;
export type AccessEnvironment = (typeof ACCESS_ENVIRONMENTS)[number];

export function isAccessEnvironment(value: string): value is AccessEnvironment {
  return (ACCESS_ENVIRONMENTS as readonly string[]).includes(value);
}

/** Normalize legacy form values to the unified access environments. */
export function normalizeAccessEnvironment(value: string): AccessEnvironment | null {
  if (value === "sandbox" || value === "pruebas-extendidas") {
    return "sandbox";
  }

  if (value === "produccion") {
    return "produccion";
  }

  return null;
}
