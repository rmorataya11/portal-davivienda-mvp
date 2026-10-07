"use client";

import { useTranslations } from "next-intl";

import { AuthReturnLink } from "@/components/auth/auth-return-link";
import { getLoginHref } from "@/lib/navigation/safe-path";

export type LockedPreviewKind = "docs" | "guide" | "technical" | "apps" | "profile" | "form";

export function LockedContentPanel({
  description,
  returnTo,
  titleId,
  titleTag: TitleTag = "h1",
  preview = "docs",
  className = "",
}: {
  description: string;
  returnTo: string;
  titleId?: string;
  titleTag?: "h1" | "h2";
  preview?: LockedPreviewKind;
  className?: string;
}) {
  const t = useTranslations("Auth.gate");

  const pageLike = preview === "guide" || preview === "apps";

  return (
    <div
      className={`relative isolate min-h-[520px] overflow-hidden rounded-2xl border border-[#E7EAEE] lg:min-h-[640px] ${
        pageLike ? "bg-[#F2F3F5]" : "bg-white"
      } ${className}`}
    >
      <div className="pointer-events-none select-none blur-[5px]" aria-hidden="true">
        <LockedPreview kind={preview} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-[#F2F3F5]/45 px-5">
        <div className="w-full max-w-[400px] rounded-2xl border border-[#E7EAEE] bg-white px-6 py-6 sm:px-7 sm:py-7">
          <TitleTag id={titleId} className="text-[22px] font-bold tracking-[0.2px] text-[#404040]">
            {t("lockedTitle")}
          </TitleTag>
          <p className="mt-2 text-[15px] leading-6 text-[#8E8E8E]">{description}</p>
          <AuthReturnLink
            href={getLoginHref(returnTo)}
            returnTo={returnTo}
            className="mt-5 inline-flex h-[46px] items-center justify-center rounded-[30px] bg-[#E1251B] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#C01F16]"
          >
            {t("signIn")}
          </AuthReturnLink>
        </div>
      </div>
    </div>
  );
}

function LockedPreview({ kind }: { kind: LockedPreviewKind }) {
  if (kind === "guide") {
    return <GuidePreview />;
  }

  if (kind === "technical") {
    return <TechnicalPreview />;
  }

  if (kind === "apps") {
    return <AppsPreview />;
  }

  if (kind === "profile") {
    return <ProfilePreview />;
  }

  if (kind === "form") {
    return <FormPreview />;
  }

  return <DocsPreview />;
}

function DocsPreview() {
  return (
    <div className="flex min-h-[520px] lg:min-h-[640px]">
      <aside className="hidden w-[260px] shrink-0 border-r border-[#E7EAEE] bg-[#F2F3F5] p-5 lg:block">
        <div className="h-10 rounded-[10px] border border-[#E7EAEE] bg-white" />
        <div className="mt-6 space-y-3">
          <div className="h-3 w-24 rounded bg-[#D5DAE0]" />
          <div className="h-3 w-40 rounded bg-[#D5DAE0]" />
          <div className="ml-3 h-3 w-32 rounded bg-[#C9CED4]" />
          <div className="ml-3 h-3 w-36 rounded bg-[#C9CED4]" />
          <div className="mt-6 h-3 w-20 rounded bg-[#D5DAE0]" />
          <div className="h-3 w-44 rounded bg-[#D5DAE0]" />
          <div className="ml-3 h-3 w-28 rounded bg-[#C9CED4]" />
        </div>
      </aside>
      <div className="min-w-0 flex-1 bg-white">
        <div className="flex h-12 items-center gap-3 border-b border-[#E7EAEE] px-5">
          <div className="inline-flex h-6 min-w-14 items-center justify-center rounded-full bg-[#E1251B]" />
          <div className="h-3 w-40 rounded bg-[#D5DAE0]" />
        </div>
        <div className="space-y-4 px-6 py-6">
          <div className="h-7 w-64 rounded bg-[#D5DAE0]" />
          <div className="h-3 w-full max-w-[520px] rounded bg-[#E7EAEE]" />
          <div className="h-3 w-full max-w-[460px] rounded bg-[#E7EAEE]" />
          <div className="mt-6 rounded-2xl bg-[#F2F3F5] px-5 py-4">
            <div className="h-3 w-24 rounded bg-[#D5DAE0]" />
            <div className="mt-3 h-3 w-full rounded bg-[#D5DAE0]" />
            <div className="mt-2 h-3 w-4/5 rounded bg-[#D5DAE0]" />
            <div className="mt-2 h-3 w-2/3 rounded bg-[#D5DAE0]" />
          </div>
          <div className="h-24 rounded-2xl border border-[#E7EAEE] bg-[#FAFBFC]" />
        </div>
      </div>
    </div>
  );
}

function GuidePreview() {
  return (
    <div className="min-h-[520px] bg-[#F2F3F5] p-5 lg:min-h-[640px] lg:p-6">
      <div className="rounded-[24px] border border-[#E7EAEE] bg-white px-5 py-5 sm:px-8">
        <div className="h-3 w-28 rounded bg-[#E1251B]/25" />
        <div className="mt-4 flex items-center gap-3">
          <div className="h-11 w-11 rounded-[12px] bg-[#FFF1F0]" />
          <div className="h-7 w-72 rounded bg-[#D5DAE0]" />
        </div>
        <div className="mt-3 h-3 w-full max-w-[420px] rounded bg-[#E7EAEE]" />
        <div className="mt-4 flex gap-2">
          <div className="h-7 w-20 rounded-full bg-[#F8F9FB]" />
          <div className="h-7 w-16 rounded-full bg-[#F8F9FB]" />
          <div className="h-7 w-36 rounded-full bg-[#F8F9FB]" />
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-[24px] border border-[#E7EAEE] bg-white lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#E7EAEE] px-6 pt-10 pb-8 lg:block">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-[#D5DAE0]" />
            <div className="h-3 w-32 rounded bg-[#E7EAEE]" />
            <div className="h-3 w-28 rounded bg-[#E7EAEE]" />
            <div className="h-3 w-36 rounded bg-[#E7EAEE]" />
          </div>
        </aside>
        <div className="space-y-4 px-5 py-10 sm:px-8">
          <div className="h-4 w-full max-w-[520px] rounded bg-[#D5DAE0]" />
          <div className="h-3 w-full max-w-[480px] rounded bg-[#E7EAEE]" />
          <div className="h-3 w-full max-w-[440px] rounded bg-[#E7EAEE]" />
          <div className="border-l-2 border-[#E1251B] pl-4">
            <div className="h-3 w-full max-w-[360px] rounded bg-[#E7EAEE]" />
          </div>
          <div className="mt-6 flex items-baseline gap-4">
            <div className="h-3 w-6 rounded bg-[#C9CED4]" />
            <div className="h-5 w-48 rounded bg-[#D5DAE0]" />
          </div>
          <div className="h-3 w-full max-w-[500px] rounded bg-[#E7EAEE]" />
          <div className="h-3 w-full max-w-[420px] rounded bg-[#E7EAEE]" />
        </div>
      </div>
    </div>
  );
}

function TechnicalPreview() {
  return (
    <div className="min-h-[520px] space-y-6 bg-white px-6 py-6 lg:min-h-[640px] sm:px-8 sm:py-8">
      <div className="h-5 w-40 rounded bg-[#D5DAE0]" />
      <div className="h-3 w-full max-w-[520px] rounded bg-[#E7EAEE]" />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="h-12 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
        <div className="h-12 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
      </div>
      <div className="h-6 w-36 rounded bg-[#D5DAE0]" />
      <div className="flex items-center gap-3 rounded-2xl border border-[#E7EAEE] bg-[#F2F3F5] px-4 py-4">
        <div className="h-6 w-14 rounded-full bg-[#E1251B]" />
        <div className="h-3 w-48 rounded bg-[#D5DAE0]" />
      </div>
      <div className="h-32 rounded-2xl bg-[#F2F3F5]" />
    </div>
  );
}

function AppsPreview() {
  return (
    <div className="min-h-[520px] space-y-6 bg-[#F2F3F5] p-6 lg:min-h-[640px]">
      <div>
        <div className="h-8 w-48 rounded bg-[#D5DAE0]" />
        <div className="mt-3 h-3 w-full max-w-[360px] rounded bg-[#E7EAEE]" />
      </div>
      <div className="rounded-2xl bg-white px-6 py-5">
        <div className="h-3 w-36 rounded bg-[#E7EAEE]" />
        <div className="mt-6 flex h-32 items-end gap-3">
          <div className="h-16 flex-1 rounded-sm bg-[#D5DAE0]" />
          <div className="h-24 flex-1 rounded-sm bg-[#E1251B]" />
          <div className="h-3 flex-1 rounded-sm bg-[#D5DAE0]" />
          <div className="h-3 flex-1 rounded-sm bg-[#D5DAE0]" />
          <div className="h-3 flex-1 rounded-sm bg-[#D5DAE0]" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-36 rounded-2xl border border-[#E7EAEE] bg-white" />
        <div className="h-36 rounded-2xl border border-[#E7EAEE] bg-white" />
      </div>
    </div>
  );
}

function ProfilePreview() {
  return (
    <div className="min-h-[520px] bg-white px-6 py-6 lg:min-h-[640px] sm:px-8">
      <div className="h-8 w-40 rounded bg-[#D5DAE0]" />
      <div className="mt-6 flex gap-4 border-b border-[#E7EAEE] pb-3">
        <div className="h-3 w-24 rounded bg-[#E1251B]/40" />
        <div className="h-3 w-20 rounded bg-[#E7EAEE]" />
        <div className="h-3 w-24 rounded bg-[#E7EAEE]" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="h-14 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
        <div className="h-14 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
        <div className="h-14 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
        <div className="h-14 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
      </div>
      <div className="mt-6 h-11 w-40 rounded-[30px] bg-[#E1251B]" />
    </div>
  );
}

function FormPreview() {
  return (
    <div className="min-h-[420px] space-y-4 bg-white px-5 py-6 lg:min-h-[480px] sm:px-8">
      <div className="h-7 w-56 rounded bg-[#D5DAE0]" />
      <div className="h-3 w-full max-w-[360px] rounded bg-[#E7EAEE]" />
      <div className="h-14 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
      <div className="h-14 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
      <div className="h-24 rounded-[14px] border border-[#E7EAEE] bg-[#F8F9FB]" />
      <div className="h-11 w-44 rounded-[30px] bg-[#E1251B]" />
    </div>
  );
}
