"use client";

import { useMemo, useState } from "react";

import { ApiCard } from "./api-card";
import { CatalogGlyph } from "./catalog-glyph";
import { apiCatalogItems, apiCategories, getApiDetailBySlug } from "./content/apis";

export function CatalogBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apiCatalogItems.filter((item) => {
      if (category !== "Todas" && item.category !== category) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const detail = getApiDetailBySlug(item.slug);
      const haystack = [
        item.name,
        item.description,
        item.category,
        item.status,
        ...(detail?.endpoints.flatMap((endpoint) => [endpoint.method, endpoint.path, endpoint.description]) ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [category, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 text-[16px] leading-7 font-medium tracking-[0.32px] text-[#404040]">
        <img
          src="/catag/main/catalog.svg"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          aria-hidden="true"
        />
        <span>Catálogo de APIs</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex h-10 w-full items-center gap-2 rounded-full border border-[#707070] bg-white px-4 text-[#8E8E8E] sm:w-[408px]">
          <span className="sr-only">Filtrar catálogo</span>
          <CatalogGlyph src="/catag/main/lupa.svg" className="h-6 w-6" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtre por nombre, etiqueta o endpoint..."
            className="h-full w-full bg-transparent text-sm text-[#404040] outline-none placeholder:text-[#8E8E8E] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
          />
        </label>
        <CatalogGlyph src="/catag/main/filter.svg" className="h-7 w-7" />
        {apiCategories.map((item) => {
          const isActive = item === category;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`inline-flex h-10 items-center justify-center rounded-[32px] border px-5 text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? "border-[#707070] bg-[#404040] text-white"
                  : "border-[#707070] bg-white text-[#404040] hover:bg-[#404040] hover:text-white"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid gap-[15px] md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((api) => (
            <ApiCard key={api.slug || api.name} api={api} />
          ))}
        </div>
      ) : (
        <p className="rounded-[16px] border border-dashed border-[#D5DAE0] px-5 py-8 text-[15px] leading-7 text-[#6A7178]">
          No encontramos APIs para esos filtros. Pruebe otra categoría o borre el texto de búsqueda.
        </p>
      )}
    </div>
  );
}
