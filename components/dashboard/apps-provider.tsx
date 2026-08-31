"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { createDeveloperAppRecord } from "@/lib/developer-apps/factory";
import { loadDeveloperApps, saveDeveloperApps } from "@/lib/developer-apps/storage";
import type { CreateAppInput, DeveloperApp, UpdateAppInput } from "@/lib/developer-apps/types";

type AppsContextValue = {
  apps: DeveloperApp[];
  ready: boolean;
  createApp: (input: CreateAppInput) => DeveloperApp;
  updateApp: (appId: string, input: UpdateAppInput) => DeveloperApp | undefined;
  deleteApp: (appId: string) => void;
  getApp: (id: string) => DeveloperApp | undefined;
  linkProduct: (appId: string, productSlug: string) => void;
  markContracting: (appId: string) => void;
};

const AppsContext = createContext<AppsContextValue | null>(null);

export function AppsProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [apps, setApps] = useState<DeveloperApp[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setApps([]);
      setReady(true);
      return;
    }

    setApps(loadDeveloperApps(user.uid));
    setReady(true);
  }, [loading, user]);

  const persist = useCallback(
    (next: DeveloperApp[]) => {
      if (!user) {
        return;
      }

      saveDeveloperApps(user.uid, next);
      setApps(next);
    },
    [user],
  );

  const createApp = useCallback(
    (input: CreateAppInput) => {
      const app = createDeveloperAppRecord(input);
      persist([app, ...apps]);
      return app;
    },
    [apps, persist],
  );

  const getApp = useCallback((id: string) => apps.find((app) => app.id === id), [apps]);

  const updateApp = useCallback(
    (appId: string, input: UpdateAppInput) => {
      const current = apps.find((app) => app.id === appId);
      if (!current) {
        return undefined;
      }

      const nextApp: DeveloperApp = {
        ...current,
        name: input.name,
        description: input.description,
        productSlugs: input.productSlugs,
      };

      persist(apps.map((app) => (app.id === appId ? nextApp : app)));
      return nextApp;
    },
    [apps, persist],
  );

  const deleteApp = useCallback(
    (appId: string) => {
      persist(apps.filter((app) => app.id !== appId));
    },
    [apps, persist],
  );

  const linkProduct = useCallback(
    (appId: string, productSlug: string) => {
      persist(
        apps.map((app) =>
          app.id === appId && !app.productSlugs.includes(productSlug)
            ? { ...app, productSlugs: [...app.productSlugs, productSlug] }
            : app,
        ),
      );
    },
    [apps, persist],
  );

  const markContracting = useCallback(
    (appId: string) => {
      persist(
        apps.map((app) => (app.id === appId && app.status === "sandbox" ? { ...app, status: "contracting" } : app)),
      );
    },
    [apps, persist],
  );

  const value = useMemo<AppsContextValue>(
    () => ({
      apps,
      ready,
      createApp,
      updateApp,
      deleteApp,
      getApp,
      linkProduct,
      markContracting,
    }),
    [apps, createApp, deleteApp, getApp, linkProduct, markContracting, ready, updateApp],
  );

  return <AppsContext.Provider value={value}>{children}</AppsContext.Provider>;
}

export function useDeveloperApps() {
  const context = useContext(AppsContext);

  if (!context) {
    throw new Error("useDeveloperApps debe usarse dentro de AppsProvider.");
  }

  return context;
}
