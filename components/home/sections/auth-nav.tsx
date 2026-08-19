"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";

const buttonClassName =
  "inline-flex min-h-[40px] min-w-[120px] items-center justify-center rounded-full bg-white px-4 text-[13px] font-bold !text-[#404040] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F2F3F5] hover:shadow-[0_14px_34px_rgba(20,31,37,0.16)] sm:min-w-[132px] sm:px-5 lg:min-h-[42px] lg:min-w-[156px] lg:px-7 lg:text-[14px]";

export function AuthNav() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="ml-auto h-10 w-[120px] rounded-full bg-white/15 sm:w-[132px] lg:min-h-[42px] lg:w-[156px]" />;
  }

  if (user) {
    return (
      <div className="ml-auto flex items-center gap-3 sm:gap-5">
        <span className="hidden max-w-[180px] truncate text-[13px] font-medium text-white/90 sm:inline lg:text-[14px]">
          {user.email}
        </span>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className={buttonClassName}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-4 sm:gap-8">
      <Link
        href="/crear-cuenta"
        className="hidden text-[14px] font-medium text-white transition-all duration-300 hover:opacity-85 md:block"
      >
        Crear cuenta
      </Link>
      <Link href="/iniciar-sesion" className={buttonClassName}>
        Iniciar sesión
      </Link>
    </div>
  );
}
