"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { BreakablePath } from "@/components/ui/breakable-path";
import type { ApiDetail, ApiError } from "../content/apis";
import { CompactEndpointPlayground } from "./compact-endpoint-playground";
import { CredentialsPanel } from "./credentials-panel";

type TechnicalTabsProps = {
  description: string;
  authentication: ApiDetail["authentication"];
  endpoints: ApiDetail["endpoints"];
  errors: ApiError[];
  slug?: string;
  apiName?: string;
};

function commonErrors(errors: ApiError[]) {
  const preferredCodes = ["401", "400", "429"];
  const highlighted = preferredCodes
    .map((code) => errors.find((error) => error.code === code))
    .filter((error): error is ApiError => Boolean(error));

  return (highlighted.length > 0 ? highlighted : errors).slice(0, 2);
}

export function TechnicalTabs({
  description,
  authentication,
  endpoints,
  errors,
  slug,
  apiName,
}: TechnicalTabsProps) {
  const t = useTranslations("Catalog.technical");
  const summaryErrors = commonErrors(errors);
  const docsHref = slug ? `/documentacion?api=${slug}` : "/documentacion";

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-[18px] font-bold tracking-[0.24px] text-[#30383F]">{apiName ?? t("thisApi")}</h3>
        <p className="mt-2 max-w-[720px] text-[15px] leading-6 text-[#6A7178]">{description}</p>

        <h4 className="mt-5 text-[12px] font-medium uppercase tracking-[0.18em] text-[#8E8E8E]">{t("keyHeaders")}</h4>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {authentication.headers.map((header) => (
            <li
              key={header}
              className="rounded-[14px] border border-[#E3E7EC] bg-[#F8F9FB] px-4 py-3 font-mono text-[13px] text-[#404040]"
            >
              <BreakablePath value={header} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-[22px] font-bold tracking-[0.24px] text-[#30383F]">{t("endpoint")}</h3>
        <p className="mt-2 text-[14px] leading-6 text-[#8E8E8E]">{t("endpointHelp")}</p>
        <div className="mt-4">
          <CompactEndpointPlayground endpoints={endpoints} />
        </div>
      </section>

      <section>
        <h3 className="text-[16px] font-bold tracking-[0.24px] text-[#30383F]">{t("commonErrors")}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {summaryErrors.map((error) => (
            <div key={error.code} className="rounded-[16px] border border-[#E3E7EC] bg-[#F8F9FB] px-4 py-3">
              <p className="text-[14px] font-bold text-[#30383F]">
                {error.code} · {error.title}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#6A7178]">{error.description}</p>
            </div>
          ))}
        </div>
      </section>

      {slug ? (
        <section>
          <h3 className="text-[16px] font-bold tracking-[0.24px] text-[#30383F]">{t("sandboxCredentials")}</h3>
          <div className="mt-3">
            <CredentialsPanel slug={slug} apiName={apiName ?? t("thisApiLower")} />
          </div>
        </section>
      ) : null}

      <div className="border-t border-[#E7EAEE] pt-5">
        <Link
          href={docsHref}
          className="inline-flex items-center text-[15px] font-semibold text-[#E1251B] transition-colors hover:text-[#C01F16]"
        >
          {t("viewFullDocs")}
        </Link>
      </div>
    </div>
  );
}
