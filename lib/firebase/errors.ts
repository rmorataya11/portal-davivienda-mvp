import { FirebaseError } from "firebase/app";

const AUTH_ERROR_KEYS = {
  "auth/email-already-in-use": "emailAlreadyInUse",
  "auth/invalid-email": "invalidEmail",
  "auth/weak-password": "weakPassword",
  "auth/expired-action-code": "invalidActionCode",
  "auth/invalid-action-code": "invalidActionCode",
  "auth/invalid-credential": "invalidCredentials",
  "auth/user-not-found": "invalidCredentials",
  "auth/wrong-password": "invalidCredentials",
  "auth/too-many-requests": "tooManyRequests",
  "auth/network-request-failed": "networkFailed",
  "auth/operation-not-allowed": "operationNotAllowed",
} as const;

const KNOWN_MESSAGE_KEYS: Record<string, string> = {
  "Este correo ya tiene una cuenta. Inicie sesión.": "emailAlreadyInUse",
  "Ingrese un correo válido, por ejemplo nombre@empresa.com.": "invalidEmail",
  "Ingrese un correo válido.": "invalidEmailShort",
  "La contraseña debe tener al menos 8 caracteres.": "weakPassword",
  "La contraseña es demasiado débil. Use al menos 6 caracteres.": "weakPassword",
  "Enlace inválido o expirado": "invalidActionCode",
  "El correo o la contraseña no coinciden.": "invalidCredentials",
  "Demasiados intentos. Espere un momento e intente de nuevo.": "tooManyRequests",
  "No hay conexión. Revise su red e intente de nuevo.": "networkFailed",
  "El inicio de sesión con correo no está habilitado en Firebase.": "operationNotAllowed",
  "El inicio de sesión con correo no está habilitado.": "operationNotAllowed",
  "No pudimos completar la operación. Intente de nuevo.": "generic",
  "No pudimos completar el registro. Intente de nuevo.": "registrationFailed",
  "Faltan campos obligatorios para completar el registro.": "missingRequiredFields",
  "Seleccione un tipo de identificación válido.": "invalidIdType",
  "Ingrese el número de identificación.": "idNumberRequired",
  "Ingrese un teléfono válido.": "invalidPhone",
  "Debe aceptar los términos y autorizar el tratamiento de datos personales.": "termsAndPrivacyRequired",
  "Ocurrió un error interno al registrar el developer.": "registrationInternal",
};

const FALLBACK_MESSAGES: Record<string, string> = {
  emailAlreadyInUse: "Este correo ya tiene una cuenta. Inicie sesión.",
  invalidEmail: "Ingrese un correo válido, por ejemplo nombre@empresa.com.",
  invalidEmailShort: "Ingrese un correo válido.",
  weakPassword: "La contraseña debe tener al menos 8 caracteres.",
  invalidActionCode: "Enlace inválido o expirado",
  invalidCredentials: "El correo o la contraseña no coinciden.",
  tooManyRequests: "Demasiados intentos. Espere un momento e intente de nuevo.",
  networkFailed: "No hay conexión. Revise su red e intente de nuevo.",
  operationNotAllowed: "El inicio de sesión con correo no está habilitado en Firebase.",
  generic: "No pudimos completar la operación. Intente de nuevo.",
  registrationFailed: "No pudimos completar el registro. Intente de nuevo.",
  missingRequiredFields: "Faltan campos obligatorios para completar el registro.",
  invalidIdType: "Seleccione un tipo de identificación válido.",
  idNumberRequired: "Ingrese el número de identificación.",
  invalidPhone: "Ingrese un teléfono válido.",
  termsAndPrivacyRequired: "Debe aceptar los términos y autorizar el tratamiento de datos personales.",
  registrationInternal: "Ocurrió un error interno al registrar el developer.",
};

export function getAuthErrorKey(error: unknown) {
  if (typeof error === "string") {
    return KNOWN_MESSAGE_KEYS[error] ?? "generic";
  }

  if (error instanceof FirebaseError) {
    return AUTH_ERROR_KEYS[error.code as keyof typeof AUTH_ERROR_KEYS] ?? "generic";
  }

  if (error instanceof Error) {
    return KNOWN_MESSAGE_KEYS[error.message] ?? "generic";
  }

  return "generic";
}

export function getAuthErrorMessage(error: unknown) {
  return FALLBACK_MESSAGES[getAuthErrorKey(error)] ?? FALLBACK_MESSAGES.generic;
}
