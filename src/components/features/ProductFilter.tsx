"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LISTING_CATEGORIES } from "@/lib/constants/categories";
import type { ListingCategory, ListingFilters, SortOption } from "@/lib/types/listing";
import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

export type ProductFilterProps = {
  value: ListingFilters;
  onChange: (next: ListingFilters) => void;
};

export function ProductFilter({ value, onChange }: ProductFilterProps) {
  const tFilters = useTranslations("filters");
  const tCategories = useTranslations("categories");
  const tListings = useTranslations("listings");

  function patch(partial: Partial<ListingFilters>) {
    onChange({ ...value, ...partial, page: 1 });
  }

  function clear() {
    onChange({
      q: "",
      location: "",
      category: "all",
      sort: "newest",
      page: 1,
      pageSize: value.pageSize,
      minPrice: undefined,
      maxPrice: undefined,
    });
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <SlidersHorizontal className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-bold text-[#17251a]">{tFilters("title")}</h2>
      </div>

      <Input
        label={tFilters("location")}
        value={value.location}
        onChange={(e) => patch({ location: e.target.value })}
        placeholder={tListings("locationPlaceholder")}
        className="h-11 rounded-md border-[#dfe4df] bg-white"
      />

      <div>
        <p className="mb-2 text-sm font-semibold text-[#17251a]">
          {tFilters("priceRange")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label={tFilters("priceMin")}
            placeholder={tFilters("priceMin")}
            type="number"
            min={0}
            value={value.minPrice ?? ""}
            onChange={(e) =>
              patch({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-11 rounded-md border-[#dfe4df] bg-white"
          />
          <Input
            aria-label={tFilters("priceMax")}
            placeholder={tFilters("priceMax")}
            type="number"
            min={0}
            value={value.maxPrice ?? ""}
            onChange={(e) =>
              patch({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-11 rounded-md border-[#dfe4df] bg-white"
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-3 text-sm font-semibold text-[#17251a]">
          {tFilters("category")}
        </legend>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm font-medium text-[#2f3c32]">
            <input
              className="size-4 accent-primary"
              type="radio"
              name="category"
              checked={value.category === "all"}
              onChange={() => patch({ category: "all" })}
            />
            {tFilters("all")}
          </label>
          {LISTING_CATEGORIES.map((cat: ListingCategory) => (
            <label key={cat} className="flex items-center gap-3 text-sm font-medium text-[#2f3c32]">
              <input
                className="size-4 accent-primary"
                type="radio"
                name="category"
                checked={value.category === cat}
                onChange={() => patch({ category: cat })}
              />
              {tCategories(cat)}
            </label>
          ))}
        </div>
      </fieldset>

      <Select
        label={tFilters("sortBy")}
        value={value.sort}
        onChange={(e) => patch({ sort: e.target.value as SortOption })}
        className="h-11 rounded-md border-[#dfe4df] bg-white"
      >
        <option value="newest">{tListings("sortNewest")}</option>
        <option value="price_asc">{tListings("sortPriceAsc")}</option>
        <option value="price_desc">{tListings("sortPriceDesc")}</option>
      </Select>

      <Button
        type="button"
        variant="outline"
        className="mt-2 h-11 w-full gap-2 rounded-md border-transparent bg-[#e9f1e6] font-bold text-primary hover:bg-[#deead9]"
        onClick={clear}
      >
        <RefreshCw className="size-4" aria-hidden />
        {tFilters("clear")}
      </Button>
    </div>
  );
}
