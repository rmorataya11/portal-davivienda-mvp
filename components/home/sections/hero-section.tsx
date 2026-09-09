import Link from "next/link";

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="hero-frame">
        <div className="hero-scene" aria-hidden="true">
          <div className="hero-scene-photo">
            <div className="hero-scene-glass hero-scene-glass--lg" />
            <div className="hero-scene-glass hero-scene-glass--sm" />
            <div className="hero-scene-tag hero-scene-tag--q3">Q3</div>
            <div className="hero-scene-tag hero-scene-tag--leads">Nuevos leads</div>
            <div className="hero-scene-figure hero-scene-figure--left" />
            <div className="hero-scene-figure hero-scene-figure--center" />
            <div className="hero-scene-figure hero-scene-figure--right" />
          </div>
        </div>

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
