"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { onAuthChange, signOutUser, type AuthUser } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/firebase/user-profile";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  displayName: string;
  companyName: string;
  setDisplayName: (name: string) => void;
  setCompanyName: (name: string) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    return onAuthChange((nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (!nextUser) {
        setDisplayName("");
        setCompanyName("");
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
        if (cancelled || !profile) {
          return;
        }

        setDisplayName(profile.displayName);
        setCompanyName(profile.companyName);
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
      companyName,
      setDisplayName,
      setCompanyName,
      signOut: () => signOutUser(),
    }),
    [companyName, displayName, loading, user],
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
