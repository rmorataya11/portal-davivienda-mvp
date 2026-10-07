"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { DocsRequestCode, DocsStatusCode } from "@/components/docs/docs-code-block";
import { DocsThemeProvider, DocsThemeToggle, useDocsTheme } from "@/components/docs/docs-theme";
import { useCatalogViews } from "@/components/catalog/catalog-provider";
import {
  findLocalizedDocsEndpoint,
  localizeDocsEndpoint,
  type DocsApi,
  type DocsEndpoint,
  type DocsHttpMethod,
} from "@/components/docs/localize-docs";
import { BreakablePath } from "@/components/ui/breakable-path";
import { SectionContainer } from "@/components/ui/layout";
import type { CatalogEndpoint } from "@/lib/catalog/queries";

function methodIconClass(method: DocsHttpMethod) {
  if (method === "POST") {
    return "text-[var(--docs-method-post)]";
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
    return "bg-[#E1251B] text-white";
  }

  if (method === "PUT") {
    return "bg-[#FFF4E8] text-[#8A4B00]";
  }

  if (method === "DELETE") {
    return "bg-[#FFE9E9] text-[#A11B1B]";
  }

  return "bg-[#EFFCF5] text-[#347659]";
}

function docsStateFromApis(apiParam: string | null, apis: DocsApi[]) {
  const matchedApi = apiParam ? apis.find((api) => api.apiId === apiParam) : undefined;
  const firstEndpoint = matchedApi?.endpoints[0] ?? apis[0]?.endpoints[0];

  return {
    query: matchedApi?.apiName ?? "",
    openTabIds: firstEndpoint ? [firstEndpoint.id] : [],
    activeTabId: firstEndpoint?.id ?? "",
  };
}

export function DocsPage({ endpoint }: { endpoint: CatalogEndpoint | null }) {
  return (
    <DocsThemeProvider>
      <DocsExplorer endpoint={endpoint} />
    </DocsThemeProvider>
  );
}

function DocsExplorer({ endpoint }: { endpoint: CatalogEndpoint | null }) {
  const t = useTranslations("Documentacion.explorer");
  const { theme } = useDocsTheme();
  const products = useCatalogViews();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const apiFromQuery = searchParams.get("api");
  const localizedApis = useMemo(() => {
    if (!endpoint) {
      return [];
    }

    const product = products.find((item) => item.slug === "api-tesoreria");

    return [
      {
        apiId: "api-tesoreria",
        apiName: product?.name ?? "API Tesorería",
        endpoints: [localizeDocsEndpoint(endpoint, locale, "api-tesoreria")],
      },
    ];
  }, [endpoint, locale, products]);
  const initialDocsState = docsStateFromApis(apiFromQuery, localizedApis);
  const [query, setQuery] = useState(initialDocsState.query);
  const [openTabIds, setOpenTabIds] = useState<string[]>(initialDocsState.openTabIds);
  const [activeTabId, setActiveTabId] = useState(initialDocsState.activeTabId);
  const [expandedApis, setExpandedApis] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(localizedApis.map((api) => [api.apiId, true])),
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const filteredApis = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return localizedApis;
    }

    return localizedApis
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
  }, [localizedApis, query]);

  const activeMatch = activeTabId ? findLocalizedDocsEndpoint(localizedApis, activeTabId) : undefined;

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
    if (!apiFromQuery) {
      return;
    }

    const matchedApi = localizedApis.find((api) => api.apiId === apiFromQuery);
    if (!matchedApi) {
      return;
    }

    const next = docsStateFromApis(apiFromQuery, localizedApis);
    setQuery(next.query);
    setExpandedApis((current) => ({ ...current, [matchedApi.apiId]: true }));
    setOpenTabIds(next.openTabIds);
    setActiveTabId(next.activeTabId);
  }, [apiFromQuery, localizedApis]);

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
      <section className="pt-6 pb-16 sm:pb-20">
        <SectionContainer>
          <h1 className="mb-4 text-[22px] font-bold tracking-[0.2px] text-[#404040]">
            {t("title")}
          </h1>
          <div
            data-theme={theme}
            className="docs-ide flex min-h-[520px] overflow-hidden rounded-[24px] border border-[var(--docs-border)] bg-[var(--docs-shell)] transition-colors duration-300 sm:min-h-[640px] lg:h-[calc(100dvh-168px)] lg:min-h-[680px]"
          >
            <aside
              className={`hidden shrink-0 overflow-hidden border-[var(--docs-border)] bg-[var(--docs-sidebar)] transition-[width,background-color,border-color] duration-300 lg:flex ${
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
              <div className="flex h-11 shrink-0 items-center border-b border-[var(--docs-border)] bg-[var(--docs-tabbar)]">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--docs-border)] bg-[var(--docs-input)] text-[var(--docs-text)] transition-colors hover:bg-[var(--docs-hover)] lg:hidden"
                  aria-label={t("openExplorer")}
                >
                  <ExplorerIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopSidebarOpen((current) => !current)}
                  className="hidden h-11 w-11 items-center justify-center text-[var(--docs-text)] transition-colors hover:bg-[var(--docs-hover)] lg:inline-flex"
                  aria-label={desktopSidebarOpen ? t("hideExplorer") : t("showExplorer")}
                >
                  <ExplorerIcon />
                </button>

                <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto">
                  {openTabIds.map((tabId) => {
                    const match = findLocalizedDocsEndpoint(localizedApis, tabId);
                    if (!match) {
                      return null;
                    }

                    const isActive = tabId === activeTabId;

                    return (
                      <div
                        key={tabId}
                        className={`group flex shrink-0 items-center border-r border-[var(--docs-border)] ${
                          isActive
                            ? "border-b-2 border-b-[#E1251B] bg-[var(--docs-tab-active)]"
                            : "border-b-2 border-b-transparent bg-transparent"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveTabId(tabId)}
                          className={`flex items-center gap-2 px-3 py-2 text-left ${isActive ? "text-[var(--docs-heading)]" : "text-[var(--docs-muted)]"}`}
                        >
                          <MethodFileIcon method={match.endpoint.method} />
                          <span className="font-mono text-[12px]">{match.endpoint.name}</span>
                        </button>
                        {openTabIds.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => closeTab(tabId)}
                            className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-[6px] text-[var(--docs-soft)] transition-colors hover:bg-[var(--docs-hover)] hover:text-[var(--docs-heading)]"
                            aria-label={t("closeTab", { name: match.endpoint.name })}
                          >
                            <CloseIcon />
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <DocsThemeToggle className="border-l border-[var(--docs-border)]" />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--docs-panel)]">
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
        <div data-theme={theme} className="docs-ide fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#141F25]/45"
            aria-label={t("closeExplorer")}
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative flex h-full w-[min(280px,86vw)] flex-col bg-[var(--docs-sidebar)] shadow-[0_18px_50px_rgba(20,31,37,0.18)]">
            <div className="flex items-center justify-end border-b border-[var(--docs-border)] px-3 py-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--docs-muted)] hover:bg-[var(--docs-hover)]"
                aria-label={t("closeExplorer")}
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
  filteredApis: DocsApi[];
  expandedApis: Record<string, boolean>;
  onToggleApi: (apiId: string) => void;
  forceExpanded: boolean;
  activeTabId: string;
  onOpenEndpoint: (endpointId: string) => void;
}) {
  const t = useTranslations("Documentacion.explorer");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[var(--docs-border)] px-3 py-3">
        <label className="flex h-10 items-center rounded-[12px] border border-[var(--docs-input-border)] bg-[var(--docs-input)] px-3 text-[var(--docs-soft)] transition-colors focus-within:border-[var(--docs-muted)]">
          <SearchIcon />
          <span className="sr-only">{t("searchLabel")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="ml-2 h-full w-full bg-transparent text-[13px] text-[var(--docs-text)] outline-none placeholder:text-[var(--docs-soft)]"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {filteredApis.length === 0 ? (
          <p className="px-3 py-6 text-[13px] leading-6 text-[var(--docs-muted)]">{t("noResults")}</p>
        ) : (
          <ul className="space-y-1">
            {filteredApis.map((api) => {
              const expanded = forceExpanded || (expandedApis[api.apiId] ?? true);

              return (
                <li key={api.apiId}>
                  <button
                    type="button"
                    onClick={() => onToggleApi(api.apiId)}
                    className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left text-[13px] font-medium text-[var(--docs-text)] transition-colors hover:bg-[var(--docs-tree-hover)]"
                    aria-expanded={expanded}
                  >
                    <ChevronIcon open={expanded} />
                    <FolderIcon />
                    <span className="truncate">{api.apiName}</span>
                  </button>
                  {expanded ? (
                    <ul className="mt-0.5 ml-2 space-y-0.5 border-l border-[var(--docs-border)] pl-3">
                      {api.endpoints.map((endpoint) => {
                        const isActive = endpoint.id === activeTabId;

                        return (
                          <li key={endpoint.id}>
                            <button
                              type="button"
                              onClick={() => onOpenEndpoint(endpoint.id)}
                              className={`flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left transition-colors ${
                                isActive
                                  ? "bg-[var(--docs-active)] text-[var(--docs-heading)]"
                                  : "text-[var(--docs-text)] hover:bg-[var(--docs-tree-hover)]"
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
  const t = useTranslations("Documentacion.explorer");
  const [responseOpen, setResponseOpen] = useState(true);

  return (
    <div className="px-5 py-6 sm:px-7 sm:py-8">
      <p className="font-mono text-[12px] tracking-[0.2px] text-[var(--docs-soft)] sm:text-[13px]">
        {apiName}
        <span className="px-2">/</span>
        {endpoint.name.replace(/\.(get|post|put|delete)$/i, "")}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className={`inline-flex h-9 w-fit shrink-0 items-center justify-center rounded-full px-4 text-[13px] font-bold ${methodBadgeClass(endpoint.method)}`}>
          {endpoint.method}
        </span>
        <code className="min-w-0 text-[14px] font-medium leading-6 tracking-[0.1px] text-[var(--docs-text)] sm:text-[18px]">
          <BreakablePath value={endpoint.httpUrl} />
        </code>
      </div>

      <p className="mt-5 text-[15px] leading-7 text-[var(--docs-desc)]">{endpoint.description}</p>

      <div className="mt-10">
        <h2 className="text-[18px] font-medium text-[var(--docs-title)] sm:text-[20px]">{t("parameters")}</h2>
        <ul className="mt-3 divide-y divide-[var(--docs-border-soft)] overflow-hidden rounded-[18px] border border-[var(--docs-border)] md:hidden">
          {endpoint.parameters.map((parameter, index) => (
            <li key={`${parameter.name}-${index}`} className="px-4 py-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="min-w-0 font-mono text-[13px] font-semibold text-[var(--docs-text)]">
                  <BreakablePath value={parameter.name} />
                </p>
                <span
                  className={`inline-flex min-h-7 items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${
                    parameter.required
                      ? "bg-[var(--docs-required)] text-[var(--docs-required-text)]"
                      : "bg-[var(--docs-chip)] text-[var(--docs-chip-text)]"
                  }`}
                >
                  {parameter.required ? t("required") : t("optional")}
                </span>
              </div>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--docs-chip-text)]">
                {parameter.type}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-[var(--docs-muted)]">{parameter.description}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 hidden overflow-x-auto rounded-[18px] border border-[var(--docs-border)] md:block">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[26%]" />
              <col className="w-[16%]" />
              <col className="w-[36%]" />
            </colgroup>
            <thead>
              <tr className="bg-[var(--docs-tabbar)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--docs-soft)]">
                <th className="px-4 py-3 font-medium">{t("name")}</th>
                <th className="px-4 py-3 font-medium">{t("type")}</th>
                <th className="px-4 py-3 font-medium">{t("usage")}</th>
                <th className="px-4 py-3 font-medium">{t("description")}</th>
              </tr>
            </thead>
            <tbody>
              {endpoint.parameters.map((parameter, index) => (
                <tr key={`${parameter.name}-${index}`} className="border-t border-[var(--docs-border-soft)]">
                  <td className="min-w-0 px-4 py-3.5 align-middle font-mono text-[13px] font-semibold text-[var(--docs-text)]">
                    <BreakablePath value={parameter.name} />
                  </td>
                  <td className="min-w-0 px-4 py-3.5 align-middle">
                    <span className="inline-flex min-h-7 max-w-full items-center whitespace-normal rounded-full bg-[var(--docs-chip)] px-2.5 py-1 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--docs-chip-text)]">
                      {parameter.type}
                    </span>
                  </td>
                  <td className="min-w-0 px-4 py-3.5 align-middle">
                    <span
                      className={`inline-flex min-h-7 max-w-full items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${
                        parameter.required
                          ? "bg-[var(--docs-required)] text-[var(--docs-required-text)]"
                          : "bg-[var(--docs-chip)] text-[var(--docs-chip-text)]"
                      }`}
                    >
                      {parameter.required ? t("required") : t("optional")}
                    </span>
                  </td>
                  <td className="min-w-0 px-4 py-3.5 align-middle text-[13px] leading-6 [overflow-wrap:normal] [word-break:normal] text-[var(--docs-muted)]">
                    {parameter.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-[18px] font-medium text-[var(--docs-title)] sm:text-[20px]">{t("requestExample")}</h2>
        <div className="mt-3">
          <DocsRequestCode examples={endpoint.requestExamples} />
        </div>
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => setResponseOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-3 rounded-[14px] border border-[var(--docs-border)] bg-[var(--docs-code)] px-4 py-3 text-left"
          aria-expanded={responseOpen}
        >
          <span className="text-[16px] font-medium text-[var(--docs-title)]">{t("responseExample")}</span>
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
  const t = useTranslations("Documentacion.explorer");

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[var(--docs-empty-icon)] text-[#E1251B]">
        <CodeIcon />
      </div>
      <h2 className="mt-5 text-[20px] font-bold tracking-[0.2px] text-[var(--docs-heading)]">{t("emptyTitle")}</h2>
      <p className="mt-3 max-w-[420px] text-[15px] leading-7 text-[var(--docs-muted)]">
        {t("emptyDescription", { endpoint: "consulta-movimientos" })}
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
      className={`h-3.5 w-3.5 shrink-0 text-[var(--docs-soft)] transition-transform duration-300 ${open ? "rotate-90" : ""}`}
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

function ExplorerIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="2.25" y="2.75" width="4.25" height="10.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.5 4.5h5.25M8.5 8h5.25M8.5 11.5h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
