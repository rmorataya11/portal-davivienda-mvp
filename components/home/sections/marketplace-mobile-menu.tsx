"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { accountLabel, useAuth } from "@/components/auth/auth-provider";
import { getApiContextFromPath, getAuthHrefs } from "@/lib/navigation/safe-path";

import { navItems } from "../content/navigation";

export function MarketplaceMobileMenu({
  activeHref = "/",
  className = "",
}: {
  activeHref?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, displayName, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const { loginHref, signupHref } = getAuthHrefs(pathname);
  const returnTo = getApiContextFromPath(pathname)?.returnTo;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white transition-colors duration-300 hover:bg-white/20"
      >
        <span className="relative flex h-4 w-5 flex-col justify-between">
          <span
            className={`h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-full rounded-full bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open ? (
        <div className="mt-4 border-t border-white/25 pt-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.href === activeHref;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  transitionTypes={["marketplace-nav"]}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors duration-300 ${
                    isActive ? "bg-white text-[#870412]" : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-white/25 pt-4">
            {loading ? (
              <div className="h-11 w-full rounded-full bg-white/15" />
            ) : user ? (
              <div className="flex flex-col gap-3">
                <span className="truncate text-[14px] font-medium text-white/80">{accountLabel(displayName)}</span>
                <Link
                  href="/perfil"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/60 px-5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Mi cuenta
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                    router.push("/");
                  }}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-[15px] font-bold text-[#404040] transition-colors duration-300 hover:bg-[#F2F3F5]"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AuthReturnLink
                  href={signupHref}
                  returnTo={returnTo}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/60 px-5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Crear cuenta
                </AuthReturnLink>
                <AuthReturnLink
                  href={loginHref}
                  returnTo={returnTo}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-[15px] font-bold text-[#404040] transition-colors duration-300 hover:bg-[#F2F3F5]"
                >
                  Iniciar sesión
                </AuthReturnLink>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
