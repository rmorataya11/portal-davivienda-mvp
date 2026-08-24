import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SurfaceCard } from "@/components/ui/layout";

import { ContractingAccessGate } from "./contracting-access-gate";
import { ContractingRequestForm } from "./contracting-request-form";

export function ContractingRequestPage({
  productName = "",
  productSlug = "",
}: {
  productName?: string;
  productSlug?: string;
}) {
  const returnTo = productSlug
    ? `/solicitud-contratacion?producto=${productSlug}`
    : "/solicitud-contratacion";

  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader activeHref="/catalogo-apis" />

      <section className="pt-[132px] pb-16">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <SurfaceCard className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <ContractingAccessGate returnTo={returnTo}>
              <ContractingRequestForm productName={productName} />
            </ContractingAccessGate>
          </SurfaceCard>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
