"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

import { useCatalogViews } from "@/components/catalog/catalog-provider";
import type { CatalogView } from "@/lib/catalog/present";
import { useDeveloperApps } from "@/components/dashboard/apps-provider";
import { localizeGuide } from "@/components/guides/localize-guide";
import { getGuideBySlug } from "@/lib/guides/guides-content";

const HIDDEN_PATHS = new Set(["/", "/iniciar-sesion", "/crear-cuenta"]);

type Crumb = {
  href: string;
  label: string;
};

function findProduct(products: CatalogView[], slug: string) {
  return products.find((product) => product.slug === slug);
}

function buildCrumbs(
  pathname: string,
  productSlug: string | null,
  products: CatalogView[],
  getApp: (id: string) => { name: string } | undefined,
  t: (key: string) => string,
  dashboardT: (key: string) => string,
  profileT: (key: string) => string,
  docsT: (key: string) => string,
  faqT: (key: string) => string,
  contratacionT: (key: string) => string,
  navT: (key: string) => string,
  authT: (key: string) => string,
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
      const api = findProduct(products, segment);
      crumbs.push({ href, label: api?.name ?? segment });
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

    if (segment === "soporte") {
      crumbs.push({ href, label: faqT("breadcrumb.faq") });
      return;
    }

    if (segment === "guias" && previous === "soporte") {
      crumbs.push({ href: "/soporte#guias-integracion", label: faqT("breadcrumb.guides") });
      return;
    }

    if (previous === "guias") {
      const guide = getGuideBySlug(segment);
      crumbs.push({ href, label: guide ? localizeGuide(guide, faqT).title : segment });
      return;
    }

    if (segment === "solicitud-contratacion") {
      const product = productSlug ? findProduct(products, productSlug) : undefined;
      if (product) {
        crumbs.push({ href: "/catalogo-apis", label: t("breadcrumb.catalog") });
        crumbs.push({ href: `/catalogo-apis/${product.slug}`, label: product.name });
      }
      crumbs.push({ href, label: contratacionT("breadcrumb.request") });
      return;
    }

    if (segment === "iniciar-sesion") {
      crumbs.push({ href, label: navT("signIn") });
      return;
    }

    if (segment === "crear-cuenta") {
      crumbs.push({ href, label: navT("createAccount") });
      return;
    }

    if (segment === "recuperar-clave") {
      crumbs.push({ href, label: authT("recover.title") });
      return;
    }

    if (segment === "restablecer-clave") {
      crumbs.push({ href, label: authT("reset.title") });
      return;
    }
  });

  return crumbs;
}

export function PageBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { apps } = useDeveloperApps();
  const t = useTranslations("Catalog");
  const dashboardT = useTranslations("Dashboard.breadcrumb");
  const profileT = useTranslations("Profile.breadcrumb");
  const docsT = useTranslations("Documentacion.breadcrumb");
  const faqT = useTranslations("Faq");
  const contratacionT = useTranslations("Contratacion");
  const navT = useTranslations("Navbar");
  const authT = useTranslations("Auth");
  const homeLabel = navT("home");

  if (HIDDEN_PATHS.has(pathname)) {
    return null;
  }

  const products = useCatalogViews();
  const crumbs = buildCrumbs(
    pathname,
    searchParams.get("producto"),
    products,
    (id) => apps.find((app) => app.id === id),
    t,
    dashboardT,
    profileT,
    docsT,
    faqT,
    contratacionT,
    navT,
    authT,
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
