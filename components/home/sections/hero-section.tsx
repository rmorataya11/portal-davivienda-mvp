import Link from "next/link";

export function HeroSection() {
  return (
    <section id="inicio" className="scroll-anchor relative overflow-hidden">
      <div className="hero-frame">
        <div className="hero-scene" aria-hidden="true" />

        <div className="hero-card">
          <p className="hero-badge">Open Banking Davivienda</p>
          <h1 className="hero-title">
            Conecte su negocio al ecosistema financiero y escale sus operaciones.
          </h1>
          <p className="hero-lead">
            Las APIs Davivienda le permiten procesar ventas, pagar a proveedores y conciliar saldos
            en tiempo real. Cree experiencias financieras únicas para sus clientes.
          </p>
          <div className="hero-actions">
            <Link href="/crear-cuenta" className="hero-cta hero-cta-primary">
              Crear cuenta gratuita
            </Link>
            <Link href="#catalogo" className="hero-cta hero-cta-secondary">
              Explorar catálogo de APIs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
