"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

import { getApiDetailBySlug } from "@/components/catalog/content/apis";
import { localizeApiDetail } from "@/components/catalog/content/localize-api";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { localizeGuide } from "@/components/guides/localize-guide";
import { getGuideBySlug } from "@/lib/guides/guides-content";

const HIDDEN_PATHS = new Set(["/", "/iniciar-sesion", "/crear-cuenta"]);

type Crumb = {
  href: string;
  label: string;
};

function buildCrumbs(
  pathname: string,
  productSlug: string | null,
  getApp: (id: string) => { name: string } | undefined,
  t: (key: string) => string,
  dashboardT: (key: string) => string,
  profileT: (key: string) => string,
  docsT: (key: string) => string,
  faqT: (key: string) => string,
  homeLabel: string,
): Crumb[] {
  if (pathname === "/") {
    return [{ href: "/", label: homeLabel }];
  }

  const crumbs: Crumb[] = [{ href: "/", label: homeLabel }];
  const segments = pathname.split("/").filter(Boolean);

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const previous = segments[index - 1];

    if (segment === "catalogo-apis") {
      crumbs.push({ href, label: t("breadcrumb.catalog") });
      return;
    }

    if (previous === "catalogo-apis") {
      const api = getApiDetailBySlug(segment);
      crumbs.push({ href, label: api ? localizeApiDetail(api, t).name : segment });
      return;
    }

    if (segment === "detalle-tecnico") {
      crumbs.push({ href, label: t("breadcrumb.technicalDetail") });
      return;
    }

    if (segment === "dashboard") {
      crumbs.push({ href, label: dashboardT("apps") });
      return;
    }

    if (segment === "apps") {
      return;
    }

    if (previous === "apps" && segment === "nueva") {
      crumbs.push({ href, label: dashboardT("newApp") });
      return;
    }

    if (previous === "apps") {
      crumbs.push({ href, label: getApp(segment)?.name ?? dashboardT("application") });
      return;
    }

    if (segment === "perfil") {
      crumbs.push({ href, label: profileT("profile") });
      return;
    }

    if (segment === "documentacion") {
      crumbs.push({ href, label: docsT("documentation") });
      return;
    }

    if (segment === "faq") {
      crumbs.push({ href, label: faqT("breadcrumb.faq") });
      return;
    }

    if (segment === "guias" && previous === "faq") {
      crumbs.push({ href: "/faq#guias-integracion", label: faqT("breadcrumb.guides") });
      return;
    }

    if (previous === "guias") {
      const guide = getGuideBySlug(segment);
      crumbs.push({ href, label: guide ? localizeGuide(guide, faqT).title : segment });
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

    if (segment === "restablecer-clave") {
      crumbs.push({ href, label: "Restablecer clave" });
      return;
    }
  });

  return crumbs;
}

export function PageBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getApp } = useDeveloperApps();
  const t = useTranslations("Catalog");
  const dashboardT = useTranslations("Dashboard.breadcrumb");
  const profileT = useTranslations("Profile.breadcrumb");
  const docsT = useTranslations("Documentacion.breadcrumb");
  const faqT = useTranslations("Faq");
  const homeLabel = useTranslations("Navbar")("home");

  if (HIDDEN_PATHS.has(pathname)) {
    return null;
  }

  const crumbs = buildCrumbs(
    pathname,
    searchParams.get("producto"),
    getApp,
    t,
    dashboardT,
    profileT,
    docsT,
    faqT,
    homeLabel,
  );

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
