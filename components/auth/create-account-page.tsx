import { MarketplaceFooter } from "@/components/home/sections/marketplace-footer";
import { MarketplaceHeader } from "@/components/home/sections/marketplace-header";
import { SurfaceCard } from "@/components/ui/layout";

import { CreateAccountForm } from "./create-account-form";

export function CreateAccountPage({
  initialProduct = "",
  nextPath,
}: {
  initialProduct?: string;
  nextPath?: string;
}) {
  return (
    <main className="min-h-screen bg-[#F2F3F5]">
      <MarketplaceHeader />

      <section className="pt-[132px] pb-16">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <SurfaceCard className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <CreateAccountForm initialProduct={initialProduct} nextPath={nextPath} />
          </SurfaceCard>
        </div>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
