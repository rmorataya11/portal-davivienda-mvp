import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type ActionCodeSettings,
  type User,
} from 'firebase/auth';

import { getFirebaseAuth } from '@/lib/firebase/client';

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

function throwAuthError(error: unknown): never {
  throw error;
}

export async function signUp(
  email: string,
  password: string,
): Promise<AuthUser> {
  try {
    const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
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
    const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    return toAuthUser(credential.user);
  } catch (error) {
    throwAuthError(error);
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(getFirebaseAuth());
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
    await sendPasswordResetEmail(getFirebaseAuth(), email, getPasswordResetActionCodeSettings());
  } catch (error) {
    throwAuthError(error);
  }
}

export function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getFirebaseAuth(),
      (user) => {
        unsubscribe();
        resolve(user ? toAuthUser(user) : null);
      },
      (error) => {
        unsubscribe();
        reject(error);
      },
    );
  });
}

export function onAuthChange(
  callback: (user: AuthUser | null) => void,
): () => void {
  return onAuthStateChanged(
    getFirebaseAuth(),
    (user) => {
      callback(user ? toAuthUser(user) : null);
    },
    () => {
      callback(null);
    },
  );
}
