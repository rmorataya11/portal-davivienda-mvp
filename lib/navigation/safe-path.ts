const AUTH_RETURN_KEY = "davivienda-auth-return";

export function getSafeInternalPath(path: string | undefined | null) {
  if (!path) {
    return undefined;
  }

  let value = path.trim();

  try {
    while (value.includes("%")) {
      const decoded = decodeURIComponent(value);
      if (decoded === value) {
        break;
      }
      value = decoded;
    }
  } catch {
    return undefined;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return undefined;
  }

  return value;
}

export function rememberReturnPath(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  const safe = getSafeInternalPath(path);
  if (safe) {
    window.sessionStorage.setItem(AUTH_RETURN_KEY, safe);
  }
}

export function readReturnPath(fromQuery?: string | null) {
  const fromParam = getSafeInternalPath(fromQuery);
  if (fromParam) {
    return fromParam;
  }

  if (typeof window === "undefined") {
    return undefined;
  }

  return getSafeInternalPath(window.sessionStorage.getItem(AUTH_RETURN_KEY));
}

export function resolveAuthReturnPath() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const params = new URLSearchParams(window.location.search);
  return readReturnPath(params.get("returnTo") ?? params.get("next"));
}

export function clearReturnPath() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(AUTH_RETURN_KEY);
}

export function getApiContextFromPath(pathname: string | null) {
  const match = pathname?.match(/^\/catalogo-apis\/([^/]+)(?:\/detalle-tecnico)?$/);

  if (!match) {
    return undefined;
  }

  return {
    slug: match[1],
    returnTo: pathname as string,
  };
}

export function getSignupHref(returnTo?: string) {
  if (!returnTo) {
    return "/crear-cuenta";
  }

  const slug = returnTo.match(/^\/catalogo-apis\/([^/]+)/)?.[1];
  const params = new URLSearchParams({ returnTo });

  if (slug) {
    params.set("producto", slug);
  }

  return `/crear-cuenta?${params.toString()}`;
}

export function getLoginHref(returnTo?: string) {
  if (!returnTo) {
    return "/iniciar-sesion";
  }

  return `/iniciar-sesion?returnTo=${encodeURIComponent(returnTo)}`;
}

export function getAuthHrefs(pathname: string | null) {
  const context = getApiContextFromPath(pathname);

  if (context) {
    return {
      loginHref: getLoginHref(context.returnTo),
      signupHref: getSignupHref(context.returnTo),
    };
  }

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/solicitud-contratacion")) {
    return {
      loginHref: getLoginHref(pathname),
      signupHref: getSignupHref(pathname),
    };
  }

  return {
    loginHref: getLoginHref(),
    signupHref: getSignupHref(),
  };
}
