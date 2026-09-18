"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { AccountAvatar } from "@/components/profile/account-avatar";
import { accountInitials, accountLabel } from "@/lib/account/display";
import { getApiContextFromPath, getAuthHrefs } from "@/lib/navigation/safe-path";

import { DaviviendaLogo } from "../shared/davivienda-logo";
import { navItems } from "../content/navigation";

const linkClassName =
  "inline-flex min-h-11 w-full items-center rounded-[14px] px-4 text-[16px] font-medium transition-colors duration-300";

export function MarketplaceMobileMenu({
  activeHref = "/",
  className = "",
}: {
  activeHref?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, displayName, companyName, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const dialogId = useId();
  const { loginHref, signupHref } = getAuthHrefs(pathname);
  const returnTo = getApiContextFromPath(pathname)?.returnTo;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (media.matches) {
        setOpen(false);
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  const overlay =
    mounted &&
    createPortal(
      <div
        className={`fixed inset-0 z-[60] xl:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
        inert={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Cerrar menú"
          onClick={closeMenu}
          className={`absolute inset-0 bg-[#141F25]/55 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`absolute inset-y-0 right-0 flex w-[min(22rem,85vw)] max-w-full flex-col bg-[linear-gradient(180deg,#E1111C_0%,#870412_100%)] text-white shadow-[-18px_0_50px_rgba(20,31,37,0.28)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4">
            <p id={titleId} className="sr-only">
              Menú de navegación
            </p>
            <DaviviendaLogo />
            <button
              type="button"
              onClick={closeMenu}
              tabIndex={open ? 0 : -1}
              aria-label="Cerrar menú"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-300 hover:bg-white/25"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
            {navItems.map((item) => {
              const isActive = item.href === activeHref;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  transitionTypes={["marketplace-nav"]}
                  tabIndex={open ? 0 : -1}
                  onClick={closeMenu}
                  className={`${linkClassName} ${
                    isActive ? "bg-white text-[#870412]" : "text-white hover:bg-white/12"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/20 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {loading ? (
              <div className="h-11 w-full rounded-full bg-white/15" />
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-1">
                  <AccountAvatar
                    name={accountInitials(companyName, displayName, user.email)}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-white">
                      {companyName.trim() || accountLabel(displayName, companyName)}
                    </p>
                    <p className="truncate text-[12px] text-white/70">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/perfil"
                  tabIndex={open ? 0 : -1}
                  onClick={closeMenu}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/60 px-5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Mi cuenta
                </Link>
                <Link
                  href="/solicitud-contratacion"
                  tabIndex={open ? 0 : -1}
                  onClick={closeMenu}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/60 px-5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Solicitar contratación
                </Link>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={async () => {
                    closeMenu();
                    await signOut();
                    router.push("/");
                  }}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-[15px] font-bold text-[#404040] transition-colors duration-300 hover:bg-[#F2F3F5]"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AuthReturnLink
                  href={signupHref}
                  returnTo={returnTo}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/60 px-5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Crear cuenta
                </AuthReturnLink>
                <AuthReturnLink
                  href={loginHref}
                  returnTo={returnTo}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-[15px] font-bold text-[#404040] transition-colors duration-300 hover:bg-[#F2F3F5]"
                >
                  Iniciar sesión
                </AuthReturnLink>
              </div>
            )}
          </div>
        </aside>
      </div>,
      document.body,
    );

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white transition-colors duration-300 hover:bg-white/20"
      >
        <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
          <span
            className={`h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-full rounded-full bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </span>
      </button>
      {overlay}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
