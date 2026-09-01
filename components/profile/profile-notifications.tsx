"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { getAuthErrorMessage } from "@/lib/firebase/errors";
import { getUserProfile, saveNotifyBeforeExpiration } from "@/lib/firebase/user-profile";

export function ProfileNotifications() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    getUserProfile(user.uid)
      .then((profile) => {
        if (!cancelled) {
          setEnabled(profile?.notifyBeforeExpiration === true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("No se pudo cargar la preferencia de avisos.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleToggle() {
    if (!user || saving) {
      return;
    }

    const next = !enabled;
    setEnabled(next);
    setSaving(true);
    setError("");

    try {
      await saveNotifyBeforeExpiration(user.uid, next);
    } catch (saveError) {
      setEnabled(!next);
      setError(getAuthErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="h-32 animate-pulse rounded-[18px] bg-[#F2F3F5]" />;
  }

  return (
    <section className="rounded-[22px] border border-[#E7EAEE] bg-[#FCFCFD] px-5 py-6 sm:px-6">
      <h3 className="text-[18px] font-bold tracking-[0.2px] text-[#141F25]">Avisos por correo</h3>
      <p className="mt-2 text-[15px] leading-7 text-[#6A7178]">
        Reciba un recordatorio antes de que venzan las credenciales de sandbox.
      </p>
      <div className="mt-5 flex items-start justify-between gap-4">
        <p id="notify-expiration-label" className="max-w-[420px] text-[15px] leading-6 text-[#404040]">
          Avisarme por email cuando mi sandbox esté por vencer
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-labelledby="notify-expiration-label"
          disabled={saving}
          onClick={handleToggle}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
            enabled ? "bg-[#E1251B]" : "bg-[#D5DAE0]"
          } disabled:opacity-60`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      {error ? <p className="mt-3 text-[14px] text-[#E1251B]">{error}</p> : null}
    </section>
  );
}
