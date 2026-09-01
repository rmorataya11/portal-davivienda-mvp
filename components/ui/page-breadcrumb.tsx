"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { getApiDetailBySlug } from "@/components/catalog/content/apis";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";

const HIDDEN_PATHS = new Set(["/", "/iniciar-sesion", "/crear-cuenta"]);

type Crumb = {
  href: string;
  label: string;
};

function buildCrumbs(
  pathname: string,
  productSlug: string | null,
  getApp: (id: string) => { name: string } | undefined,
): Crumb[] {
  if (pathname === "/") {
    return [{ href: "/", label: "Inicio" }];
  }

  const crumbs: Crumb[] = [{ href: "/", label: "Inicio" }];
  const segments = pathname.split("/").filter(Boolean);

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const previous = segments[index - 1];

    if (segment === "catalogo-apis") {
      crumbs.push({ href, label: "Catálogo de APIs" });
      return;
    }

    if (previous === "catalogo-apis") {
      crumbs.push({ href, label: getApiDetailBySlug(segment)?.name ?? segment });
      return;
    }

    if (segment === "detalle-tecnico") {
      crumbs.push({ href, label: "Detalle técnico" });
      return;
    }

    if (segment === "dashboard") {
      crumbs.push({ href, label: "Mis apps" });
      return;
    }

    if (segment === "apps") {
      return;
    }

    if (previous === "apps" && segment === "nueva") {
      crumbs.push({ href, label: "Nueva app" });
      return;
    }

    if (previous === "apps") {
      crumbs.push({ href, label: getApp(segment)?.name ?? "Aplicación" });
      return;
    }

    if (segment === "perfil") {
      crumbs.push({ href, label: "Mi perfil" });
      return;
    }

    if (segment === "guias") {
      crumbs.push({ href, label: "Guías de Uso" });
      return;
    }

    if (segment === "soporte") {
      crumbs.push({ href, label: "Soporte" });
      return;
    }

    if (segment === "solicitud-contratacion") {
      const product = productSlug ? getApiDetailBySlug(productSlug) : undefined;
      if (product) {
        crumbs.push({ href: "/catalogo-apis", label: "Catálogo de APIs" });
        crumbs.push({ href: `/catalogo-apis/${product.slug}`, label: product.name });
      }
      crumbs.push({ href, label: "Solicitud de contratación" });
      return;
    }

    if (segment === "iniciar-sesion") {
      crumbs.push({ href, label: "Iniciar sesión" });
      return;
    }

    if (segment === "crear-cuenta") {
      crumbs.push({ href, label: "Crear cuenta" });
      return;
    }

    if (segment === "recuperar-clave") {
      crumbs.push({ href, label: "Recuperar clave" });
      return;
    }
  });

  return crumbs;
}

export function PageBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getApp } = useDeveloperApps();

  if (HIDDEN_PATHS.has(pathname)) {
    return null;
  }

  const crumbs = buildCrumbs(pathname, searchParams.get("producto"), getApp);

  return (
    <nav aria-label="Breadcrumb" className="text-[13px] font-normal tracking-[0.2px] text-[#8E8E8E] sm:text-[14px]">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <span key={`${crumb.href}-${crumb.label}`}>
            {index > 0 ? <span className="px-2">›</span> : null}
            {isLast ? (
              <span>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="transition-colors duration-300 hover:text-[#E1251B]">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
