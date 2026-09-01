"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/firebase/user-profile";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  displayName: string;
  setDisplayName: (name: string) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const auth = getFirebaseAuth();

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (!nextUser) {
        setDisplayName("");
      }
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    getUserProfile(user.uid)
      .then((profile) => {
        if (!cancelled && profile?.displayName) {
          setDisplayName(profile.displayName);
        }
      })
      .catch(() => {
        // El menú puede mostrar un nombre genérico hasta que el usuario lo configure.
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      displayName,
      setDisplayName,
      signOut: () => firebaseSignOut(getFirebaseAuth()),
    }),
    [displayName, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}

export function accountLabel(displayName: string) {
  if (displayName.trim()) {
    return displayName.trim();
  }

  return "Mi cuenta";
}
