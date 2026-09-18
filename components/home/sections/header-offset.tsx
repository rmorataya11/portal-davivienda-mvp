"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { SectionContainer } from "@/components/ui/layout";

export function HeaderOffset() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="header-offset">
      <SectionContainer>
        <Suspense fallback={null}>
          <PageBreadcrumb />
        </Suspense>
      </SectionContainer>
    </div>
  );
}
