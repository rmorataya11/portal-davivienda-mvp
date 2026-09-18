import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type ActionCodeSettings,
  type User,
} from 'firebase/auth';

import { auth } from '@/lib/firebase/client';

export type AuthUser = {
  uid: string;
  email: string;
};

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email ?? '',
  };
}

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya tiene una cuenta. Inicie sesión.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil. Use al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'Ingrese un correo válido, por ejemplo nombre@empresa.com.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'El correo o la contraseña no coinciden.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Espere un momento e intente de nuevo.';
      case 'auth/network-request-failed':
        return 'No hay conexión. Revise su red e intente de nuevo.';
      case 'auth/operation-not-allowed':
        return 'El inicio de sesión con correo no está habilitado.';
      default:
        return 'No pudimos completar la operación. Intente de nuevo.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'No pudimos completar la operación. Intente de nuevo.';
}

function throwAuthError(error: unknown): never {
  throw new Error(getAuthErrorMessage(error));
}

export async function signUp(
  email: string,
  password: string,
): Promise<AuthUser> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return toAuthUser(credential.user);
  } catch (error) {
    throwAuthError(error);
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return toAuthUser(credential.user);
  } catch (error) {
    throwAuthError(error);
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throwAuthError(error);
  }
}

export function getAppBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').trim().replace(/\/$/, '');
}

export function getPasswordResetActionCodeSettings(): ActionCodeSettings {
  return {
    url: `${getAppBaseUrl()}/restablecer-clave`,
  };
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email, getPasswordResetActionCodeSettings());
  } catch (error) {
    throwAuthError(error);
  }
}

export function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user ? toAuthUser(user) : null);
      },
      (error) => {
        unsubscribe();
        reject(new Error(getAuthErrorMessage(error)));
      },
    );
  });
}

export function onAuthChange(
  callback: (user: AuthUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAuthUser(user) : null);
  });
}
