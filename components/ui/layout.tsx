import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className = "" }: LayoutProps) {
  return <div className={`mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-[56px] ${className}`}>{children}</div>;
}

export function FullBleedContainer({ children, className = "" }: LayoutProps) {
  return <div className={`mx-auto max-w-[1366px] ${className}`}>{children}</div>;
}

export function SurfaceCard({ children, className = "" }: LayoutProps) {
  return (
    <section className={`rounded-[24px] border border-[#E7EAEE] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.06)] ${className}`}>
      {children}
    </section>
  );
}
