import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Este correo ya tiene una cuenta. Inicie sesión.";
      case "auth/invalid-email":
        return "Ingrese un correo válido, por ejemplo nombre@empresa.com.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 8 caracteres.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "El correo o la contraseña no coinciden.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Espere un momento e intente de nuevo.";
      case "auth/network-request-failed":
        return "No hay conexión. Revise su red e intente de nuevo.";
      case "auth/operation-not-allowed":
        return "El inicio de sesión con correo no está habilitado en Firebase.";
      default:
        return "No pudimos completar la operación. Intente de nuevo.";
    }
  }

  return "No pudimos completar la operación. Intente de nuevo.";
}
