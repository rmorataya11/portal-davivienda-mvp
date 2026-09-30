"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  createDeveloperApp,
  fetchDeveloperApp,
  fetchDeveloperApps,
  markDeveloperAppContracting,
  revokeDeveloperApp,
  updateDeveloperApp,
} from "@/lib/developer-apps/api";
import type { CreateAppInput, CreatedAppResult, DeveloperApp, UpdateAppInput } from "@/lib/developer-apps/types";

type AppsContextValue = {
  apps: DeveloperApp[];
  ready: boolean;
  loadError: number | null;
  createApp: (input: CreateAppInput) => Promise<CreatedAppResult>;
  updateApp: (appId: string, input: UpdateAppInput) => Promise<DeveloperApp>;
  deleteApp: (appId: string) => Promise<void>;
  getApp: (id: string) => Promise<DeveloperApp>;
  markContracting: (appId: string) => Promise<DeveloperApp>;
};

const AppsContext = createContext<AppsContextValue | null>(null);

function replaceApp(apps: DeveloperApp[], nextApp: DeveloperApp) {
  if (nextApp.status !== "active") {
    return apps.filter((app) => app.id !== nextApp.id);
  }

  const exists = apps.some((app) => app.id === nextApp.id);
  if (!exists) {
    return [nextApp, ...apps];
  }

  return apps.map((app) => (app.id === nextApp.id ? nextApp : app));
}

export function AppsProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [apps, setApps] = useState<DeveloperApp[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<number | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setApps([]);
      setLoadError(null);
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    fetchDeveloperApps()
      .then((next) => {
        if (cancelled) {
          return;
        }

        setApps(next);
        setLoadError(null);
        setReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setApps([]);
        setLoadError(error instanceof Error && "status" in error && typeof error.status === "number" ? error.status : 500);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const createApp = useCallback(async (input: CreateAppInput) => {
    const created = await createDeveloperApp(input);
    setApps((current) => replaceApp(current, created.app));
    return created;
  }, []);

  const getApp = useCallback(async (id: string) => {
    const app = await fetchDeveloperApp(id);
    setApps((current) => replaceApp(current, app));
    return app;
  }, []);

  const updateApp = useCallback(async (appId: string, input: UpdateAppInput) => {
    const app = await updateDeveloperApp(appId, input);
    setApps((current) => replaceApp(current, app));
    return app;
  }, []);

  const deleteApp = useCallback(async (appId: string) => {
    await revokeDeveloperApp(appId);
    setApps((current) => current.filter((app) => app.id !== appId));
  }, []);

  const markContracting = useCallback(async (appId: string) => {
    const app = await markDeveloperAppContracting(appId);
    setApps((current) => replaceApp(current, app));
    return app;
  }, []);

  const value = useMemo<AppsContextValue>(
    () => ({
      apps,
      ready,
      loadError,
      createApp,
      updateApp,
      deleteApp,
      getApp,
      markContracting,
    }),
    [apps, createApp, deleteApp, getApp, loadError, markContracting, ready, updateApp],
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
