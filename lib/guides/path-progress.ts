const STORAGE_PREFIX = "davivienda-guides-path:v1:";

export type GuidesPathProgress = {
  securityDone: boolean;
  firstCallDone: boolean;
};

const emptyProgress: GuidesPathProgress = {
  securityDone: false,
  firstCallDone: false,
};

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function loadGuidesPathProgress(userId: string): GuidesPathProgress {
  if (typeof window === "undefined") {
    return emptyProgress;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) {
      return emptyProgress;
    }

    const parsed = JSON.parse(raw) as Partial<GuidesPathProgress>;
    return {
      securityDone: parsed.securityDone === true,
      firstCallDone: parsed.firstCallDone === true,
    };
  } catch {
    return emptyProgress;
  }
}

export function saveGuidesPathProgress(userId: string, progress: GuidesPathProgress) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(userId), JSON.stringify(progress));
}
