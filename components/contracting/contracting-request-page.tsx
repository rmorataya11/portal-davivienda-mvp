import { Suspense } from "react";

import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SurfaceCard } from "@/components/ui/layout";

import { ContractingAccessGate } from "./contracting-access-gate";
import { ContractingRequestForm } from "./contracting-request-form";

export function ContractingRequestPage({
  productName = "",
  productSlug = "",
  appId = "",
}: {
  productName?: string;
  productSlug?: string;
  appId?: string;
}) {
  const params = new URLSearchParams();
  if (productSlug) {
    params.set("producto", productSlug);
  }
  if (appId) {
    params.set("app", appId);
  }
  const query = params.toString();
  const returnTo = query ? `/solicitud-contratacion?${query}` : "/solicitud-contratacion";

  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[104px] pb-16 sm:pt-[120px] lg:pt-[132px]">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <SurfaceCard className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <ContractingAccessGate returnTo={returnTo}>
              <Suspense fallback={<div className="h-64 animate-pulse rounded-[18px] bg-[#F2F3F5]" />}>
                <ContractingRequestForm productName={productName} />
              </Suspense>
            </ContractingAccessGate>
          </SurfaceCard>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
