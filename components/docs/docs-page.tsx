"use client";

import { useEffect, useMemo, useState } from "react";

import { DocsRequestCode, DocsStatusCode } from "@/components/docs/docs-code-block";
import { SectionContainer } from "@/components/ui/layout";
import {
  defaultDocsEndpointId,
  docsApis,
  docsBreadcrumbLabel,
  findDocsEndpoint,
  type DocsEndpoint,
  type DocsHttpMethod,
} from "@/lib/mock/mockDocs";

function methodIconClass(method: DocsHttpMethod) {
  if (method === "POST") {
    return "text-[#1B2833]";
  }

  if (method === "PUT") {
    return "text-[#8A4B00]";
  }

  if (method === "DELETE") {
    return "text-[#A11B1B]";
  }

  return "text-[#347659]";
}

function methodBadgeClass(method: DocsHttpMethod) {
  if (method === "POST") {
    return "bg-[#141F25] text-white";
  }

  if (method === "PUT") {
    return "bg-[#FFF4E8] text-[#8A4B00]";
  }

  if (method === "DELETE") {
    return "bg-[#FFE9E9] text-[#A11B1B]";
  }

  return "bg-[#EFFCF5] text-[#347659]";
}

export function DocsPage() {
  const [query, setQuery] = useState("");
  const [openTabIds, setOpenTabIds] = useState<string[]>(() => (defaultDocsEndpointId ? [defaultDocsEndpointId] : []));
  const [activeTabId, setActiveTabId] = useState(defaultDocsEndpointId);
  const [expandedApis, setExpandedApis] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(docsApis.map((api) => [api.apiId, true])),
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const filteredApis = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return docsApis;
    }

    return docsApis
      .map((api) => ({
        ...api,
        endpoints: api.endpoints.filter((endpoint) =>
          [api.apiName, endpoint.name, endpoint.path, endpoint.method, endpoint.description]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
        ),
      }))
      .filter((api) => api.endpoints.length > 0);
  }, [query]);

  const activeMatch = activeTabId ? findDocsEndpoint(activeTabId) : undefined;

  function openEndpoint(endpointId: string) {
    setOpenTabIds((current) => (current.includes(endpointId) ? current : [...current, endpointId]));
    setActiveTabId(endpointId);
    setMobileSidebarOpen(false);
  }

  function closeTab(endpointId: string) {
    setOpenTabIds((current) => {
      const next = current.filter((id) => id !== endpointId);

      if (endpointId === activeTabId) {
        const closedIndex = current.indexOf(endpointId);
        const fallback = next[closedIndex] ?? next[closedIndex - 1] ?? "";
        setActiveTabId(fallback);
      }

      return next;
    });
  }

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSidebarOpen]);

  return (
    <>
      <section className="bg-white pt-6 pb-8 sm:pt-8 sm:pb-10">
        <SectionContainer>
          <h1 className="max-w-[720px] text-[28px] font-bold leading-[1.15] tracking-[0.3px] text-[#141F25] sm:text-[36px] lg:text-[40px]">
            Explore endpoints como en su editor
          </h1>
          <p className="mt-4 max-w-[680px] text-[16px] leading-7 tracking-[0.24px] text-[#6A7178] sm:text-[18px] sm:leading-8">
            Consulte rutas, parámetros y ejemplos de las APIs del catálogo. El árbol de la izquierda abre cada endpoint
            en una pestaña, con ejemplos tomados del playground técnico.
          </p>
        </SectionContainer>
      </section>

      <section className="bg-[#F2F3F5] pb-16 pt-2 sm:pb-20">
        <SectionContainer>
          <div className="flex min-h-[640px] overflow-hidden rounded-[24px] border border-[#E7EAEE] bg-white shadow-[0_18px_50px_rgba(20,31,37,0.06)] lg:h-[calc(100dvh-220px)] lg:min-h-[680px]">
            <aside
              className={`hidden shrink-0 overflow-hidden border-[#E7EAEE] bg-[#FAFBFC] transition-[width] duration-300 lg:flex ${
                desktopSidebarOpen ? "w-[280px] border-r" : "w-0 border-r-0"
              }`}
            >
              <div className="flex h-full w-[280px] flex-col">
                <ExplorerTree
                  query={query}
                  onQueryChange={setQuery}
                  filteredApis={filteredApis}
                  expandedApis={expandedApis}
                  onToggleApi={(apiId) =>
                    setExpandedApis((current) => ({ ...current, [apiId]: !(current[apiId] ?? true) }))
                  }
                  forceExpanded={Boolean(query.trim())}
                  activeTabId={activeTabId}
                  onOpenEndpoint={openEndpoint}
                />
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-11 shrink-0 items-center border-b border-[#E7EAEE] bg-[#F7F8FA]">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center text-[#404040] transition-colors hover:bg-[#EEF1F4] lg:hidden"
                  aria-label="Abrir explorador de endpoints"
                >
                  <MenuIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopSidebarOpen((current) => !current)}
                  className="hidden h-11 w-11 items-center justify-center text-[#404040] transition-colors hover:bg-[#EEF1F4] lg:inline-flex"
                  aria-label={desktopSidebarOpen ? "Ocultar explorador" : "Mostrar explorador"}
                >
                  <MenuIcon />
                </button>

                <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto">
                  {openTabIds.map((tabId) => {
                    const match = findDocsEndpoint(tabId);
                    if (!match) {
                      return null;
                    }

                    const isActive = tabId === activeTabId;

                    return (
                      <div
                        key={tabId}
                        className={`group flex shrink-0 items-center border-r border-[#E7EAEE] ${
                          isActive ? "border-b-2 border-b-[#E1251B] bg-white" : "border-b-2 border-b-transparent bg-transparent"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveTabId(tabId)}
                          className={`flex items-center gap-2 px-3 py-2 text-left ${isActive ? "text-[#141F25]" : "text-[#6A7178]"}`}
                        >
                          <MethodFileIcon method={match.endpoint.method} />
                          <span className="font-mono text-[12px]">{match.endpoint.name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => closeTab(tabId)}
                          className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-[6px] text-[#8E8E8E] transition-colors hover:bg-[#EEF1F4] hover:text-[#141F25]"
                          aria-label={`Cerrar ${match.endpoint.name}`}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-white">
                {activeMatch ? (
                  <EndpointPanel
                    key={activeMatch.endpoint.id}
                    apiName={activeMatch.api.apiName}
                    endpoint={activeMatch.endpoint}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#141F25]/45"
            aria-label="Cerrar explorador"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative flex h-full w-[min(280px,86vw)] flex-col bg-[#FAFBFC] shadow-[0_18px_50px_rgba(20,31,37,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E7EAEE] px-3 py-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#6A7178]">Explorador</p>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[#6A7178] hover:bg-[#EEF1F4]"
                aria-label="Cerrar explorador"
              >
                <CloseIcon />
              </button>
            </div>
            <ExplorerTree
              query={query}
              onQueryChange={setQuery}
              filteredApis={filteredApis}
              expandedApis={expandedApis}
              onToggleApi={(apiId) =>
                setExpandedApis((current) => ({ ...current, [apiId]: !(current[apiId] ?? true) }))
              }
              forceExpanded={Boolean(query.trim())}
              activeTabId={activeTabId}
              onOpenEndpoint={openEndpoint}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function ExplorerTree({
  query,
  onQueryChange,
  filteredApis,
  expandedApis,
  onToggleApi,
  forceExpanded,
  activeTabId,
  onOpenEndpoint,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  filteredApis: typeof docsApis;
  expandedApis: Record<string, boolean>;
  onToggleApi: (apiId: string) => void;
  forceExpanded: boolean;
  activeTabId: string;
  onOpenEndpoint: (endpointId: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[#E7EAEE] px-3 py-3">
        <p className="hidden text-[12px] font-medium uppercase tracking-[0.22em] text-[#6A7178] lg:block">Explorador</p>
        <label className="mt-3 flex h-10 items-center rounded-[12px] border border-[#E3E7EC] bg-white px-3 text-[#8E8E8E] transition-colors focus-within:border-[#CBD2D9]">
          <SearchIcon />
          <span className="sr-only">Buscar endpoints</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar endpoint..."
            className="ml-2 h-full w-full bg-transparent text-[13px] text-[#30383F] outline-none placeholder:text-[#8E8E8E]"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {filteredApis.length === 0 ? (
          <p className="px-3 py-6 text-[13px] leading-6 text-[#6A7178]">No se encontraron endpoints con esa búsqueda.</p>
        ) : (
          <ul className="space-y-1">
            {filteredApis.map((api) => {
              const expanded = forceExpanded || (expandedApis[api.apiId] ?? true);

              return (
                <li key={api.apiId}>
                  <button
                    type="button"
                    onClick={() => onToggleApi(api.apiId)}
                    className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left text-[13px] font-medium text-[#202A31] transition-colors hover:bg-[#F1F4F7]"
                    aria-expanded={expanded}
                  >
                    <ChevronIcon open={expanded} />
                    <FolderIcon />
                    <span className="truncate">{api.apiName}</span>
                  </button>
                  {expanded ? (
                    <ul className="mt-0.5 ml-2 space-y-0.5 border-l border-[#E7EAEE] pl-3">
                      {api.endpoints.map((endpoint) => {
                        const isActive = endpoint.id === activeTabId;

                        return (
                          <li key={endpoint.id}>
                            <button
                              type="button"
                              onClick={() => onOpenEndpoint(endpoint.id)}
                              className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left transition-colors ${
                                isActive
                                  ? "bg-[#FFF1F0] text-[#141F25]"
                                  : "text-[#30383F] hover:bg-[#F1F4F7]"
                              }`}
                            >
                              <MethodFileIcon method={endpoint.method} />
                              <span className="truncate font-mono text-[12px]">{endpoint.name}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function EndpointPanel({ apiName, endpoint }: { apiName: string; endpoint: DocsEndpoint }) {
  const [responseOpen, setResponseOpen] = useState(true);

  return (
    <div className="px-5 py-6 sm:px-7 sm:py-8">
      <p className="font-mono text-[12px] tracking-[0.2px] text-[#8E8E8E] sm:text-[13px]">
        {docsBreadcrumbLabel(apiName)}
        <span className="px-2">/</span>
        {endpoint.name.replace(/\.(get|post|put|delete)$/i, "")}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className={`inline-flex min-w-[76px] items-center justify-center rounded-full px-4 py-2 text-[13px] font-bold ${methodBadgeClass(endpoint.method)}`}>
          {endpoint.method}
        </span>
        <code className="min-w-0 break-all text-[16px] font-medium tracking-[0.1px] text-[#202A31] sm:text-[20px]">
          {endpoint.httpUrl}
        </code>
      </div>

      <p className="mt-5 max-w-[760px] text-[15px] leading-7 text-[#6A7178]">{endpoint.description}</p>

      <div className="mt-8">
        <h2 className="text-[18px] font-medium text-[#202A31] sm:text-[20px]">Parámetros</h2>
        <div className="mt-3 overflow-hidden rounded-[18px] border border-[#E7EAEE]">
          <div className="hidden grid-cols-[1.1fr_0.7fr_0.8fr_1.8fr] bg-[#F7F8FA] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8E8E8E] md:grid">
            <span>Nombre</span>
            <span>Tipo</span>
            <span>Uso</span>
            <span>Descripción</span>
          </div>
          {endpoint.parameters.map((parameter, index) => (
            <div
              key={`${parameter.name}-${index}`}
              className={`grid gap-2 px-4 py-4 md:grid-cols-[1.1fr_0.7fr_0.8fr_1.8fr] ${index !== 0 ? "border-t border-[#EEF1F4]" : ""}`}
            >
              <p className="font-mono text-[13px] font-semibold text-[#202A31]">{parameter.name}</p>
              <span className="w-fit rounded-full bg-[#F2F3F5] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6A7178]">
                {parameter.type}
              </span>
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${
                  parameter.required ? "bg-[#FFEAEA] text-[#A11B1B]" : "bg-[#F2F3F5] text-[#6A7178]"
                }`}
              >
                {parameter.required ? "Requerido" : "Opcional"}
              </span>
              <p className="text-[13px] leading-6 text-[#6A7178]">{parameter.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-[18px] font-medium text-[#202A31] sm:text-[20px]">Ejemplo de solicitud</h2>
        <div className="mt-3">
          <DocsRequestCode examples={endpoint.requestExamples} />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setResponseOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-3 rounded-[14px] border border-[#E7EAEE] bg-[#F7F8FA] px-4 py-3 text-left"
          aria-expanded={responseOpen}
        >
          <span className="text-[16px] font-medium text-[#202A31]">Ejemplo de respuesta</span>
          <ChevronIcon open={responseOpen} />
        </button>
        {responseOpen ? (
          <div className="mt-3">
            <DocsStatusCode key={endpoint.id} examples={endpoint.responseExamples} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#FFF1F0] text-[#E1251B]">
        <CodeIcon />
      </div>
      <h2 className="mt-5 text-[20px] font-bold tracking-[0.2px] text-[#141F25]">Seleccione un endpoint</h2>
      <p className="mt-3 max-w-[420px] text-[15px] leading-7 text-[#6A7178]">
        Seleccione un endpoint para ver su documentación. Use el explorador de la izquierda para abrir las rutas de
        Tesorería, Pay Davivienda y Validación de Cuenta.
      </p>
    </div>
  );
}

function MethodFileIcon({ method }: { method: DocsHttpMethod }) {
  return (
    <span className={`inline-flex shrink-0 ${methodIconClass(method)}`} aria-hidden="true">
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
        <path
          d="M4.2 2.5h5.1L12 5.3v8.2H4.2V2.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M9.2 2.6V5.4H12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M6 8.2h4.2M6 10.6h3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[#8A4B00]" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.2h4.1l1.2 1.5h5.7v6.6H2.5V4.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 text-[#8E8E8E] transition-transform duration-300 ${open ? "rotate-90" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 3.5 11 8l-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 10.2 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M3 4.5h10M3 8h10M3 11.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M4 4 12 12M12 4 4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M6 3.5 2.8 8 6 12.5M10 3.5 13.2 8 10 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
