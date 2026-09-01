"use client";

import { useState } from "react";

import { DeleteAccountModal } from "./delete-account-modal";

export function ProfileDangerZone() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-[22px] border border-[#E7B8B5] bg-[#FFF8F8] px-5 py-6 sm:px-6">
      <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#E1251B]">Zona de peligro</p>
      <h2 className="mt-2 text-[22px] font-bold tracking-[0.2px] text-[#141F25]">Eliminar cuenta</h2>
      <p className="mt-2 max-w-[640px] text-[15px] leading-7 text-[#6A7178]">
        Esta acción no se puede deshacer desde el portal. Si necesita dar de baja la cuenta, inicie el proceso con
        soporte.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-[#E1251B] bg-white px-5 text-[14px] font-semibold text-[#E1251B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF1F0]"
      >
        Eliminar cuenta
      </button>
      <DeleteAccountModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
