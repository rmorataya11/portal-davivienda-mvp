"use client";

import { useEffect, useId } from "react";

type TermsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TermsModal({ open, onClose }: TermsModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-[#141F25]/45"
        aria-label="Cerrar términos y condiciones"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[80vh] w-full max-w-[640px] overflow-y-auto rounded-[24px] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(20,31,37,0.18)] sm:px-8 sm:py-8"
      >
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[#8E8E8E]">Legal</p>
        <h2 id={titleId} className="mt-2 text-[26px] font-bold tracking-[0.3px] text-[#141F25]">
          Términos y condiciones
        </h2>
        <div className="mt-5 space-y-4 text-[14px] leading-6 text-[#5B636A]">
          <p>
            Esta solicitud de contratación aplica a empresas que ya tienen acceso a sandbox y desean avanzar a un
            ambiente de pruebas extendidas o producción sobre las APIs de Davivienda.
          </p>
          <p>
            Al enviar el formulario, autoriza a Davivienda a contactar al responsable técnico declarado, validar la
            información de la empresa y evaluar el caso de uso, el volumen estimado y los controles de seguridad
            necesarios para habilitar el ambiente solicitado.
          </p>
          <p>
            La aceptación de esta solicitud no implica la activación inmediata de producción. El alta queda sujeta a
            revisión comercial, cumplimiento y disponibilidad técnica.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1111C]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
