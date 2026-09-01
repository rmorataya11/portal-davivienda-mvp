"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { useAuth } from "@/components/auth/auth-provider";
import { getApiContextFromPath, getAuthHrefs } from "@/lib/navigation/safe-path";

const buttonClassName =
  "inline-flex min-h-[40px] min-w-[120px] items-center justify-center rounded-full bg-white px-4 text-[13px] font-bold !text-[#404040] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F2F3F5] hover:shadow-[0_14px_34px_rgba(20,31,37,0.16)] sm:min-w-[132px] sm:px-5 lg:min-h-[42px] lg:min-w-[156px] lg:px-7 lg:text-[14px]";

export function AuthNav() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { loginHref, signupHref } = getAuthHrefs(pathname);
  const returnTo = getApiContextFromPath(pathname)?.returnTo;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (loading) {
    return <div className="h-10 w-[120px] rounded-full bg-white/15 sm:w-[132px] lg:min-h-[42px] lg:w-[156px]" />;
  }

  if (user) {
    return (
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((current) => !current)}
          className={`${buttonClassName} gap-2`}
        >
          <span className="max-w-[160px] truncate">{user.email}</span>
          <svg
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute right-0 z-[80] mt-2 w-[220px] overflow-hidden rounded-[16px] border border-[#E7EAEE] bg-white py-2 shadow-[0_18px_44px_rgba(20,31,37,0.16)]"
          >
            <Link
              href="/perfil"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[14px] font-medium text-[#141F25] transition-colors hover:bg-[#F8F9FB] hover:text-[#E1251B]"
            >
              Mi cuenta
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await signOut();
                router.push("/");
              }}
              className="block w-full px-4 py-2.5 text-left text-[14px] font-medium text-[#141F25] transition-colors hover:bg-[#F8F9FB] hover:text-[#E1251B]"
            >
              Cerrar sesión
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 sm:gap-8">
      <AuthReturnLink
        href={signupHref}
        returnTo={returnTo}
        className="text-[14px] font-medium text-white transition-all duration-300 hover:opacity-85"
      >
        Crear cuenta
      </AuthReturnLink>
      <AuthReturnLink href={loginHref} returnTo={returnTo} className={buttonClassName}>
        Iniciar sesión
      </AuthReturnLink>
    </div>
  );
}
