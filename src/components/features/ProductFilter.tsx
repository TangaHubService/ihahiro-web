"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LISTING_CATEGORIES } from "@/lib/constants/categories";
import type { ListingCategory, ListingFilters, SortOption } from "@/lib/types/listing";
import { useTranslations } from "next-intl";

export type ProductFilterProps = {
  value: ListingFilters;
  onChange: (next: ListingFilters) => void;
};

export function ProductFilter({ value, onChange }: ProductFilterProps) {
  const tFilters = useTranslations("filters");
  const tCategories = useTranslations("categories");
  const tListings = useTranslations("listings");
  const tCommon = useTranslations("common");

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
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-sm font-semibold text-primary">{tFilters("title")}</h2>

      <Input
        label={tCommon("search")}
        value={value.q}
        onChange={(e) => patch({ q: e.target.value })}
        placeholder={tListings("searchPlaceholder")}
      />

      <Input
        label={tFilters("location")}
        value={value.location}
        onChange={(e) => patch({ location: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          label={tFilters("priceMin")}
          type="number"
          min={0}
          value={value.minPrice ?? ""}
          onChange={(e) =>
            patch({
              minPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <Input
          label={tFilters("priceMax")}
          type="number"
          min={0}
          value={value.maxPrice ?? ""}
          onChange={(e) =>
            patch({
              maxPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
      <p className="text-xs text-muted">{tFilters("priceRange")}</p>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium text-foreground">
          {tFilters("category")}
        </legend>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={value.category === "all"}
              onChange={() => patch({ category: "all" })}
            />
            {tFilters("all")}
          </label>
          {LISTING_CATEGORIES.map((cat: ListingCategory) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
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
      >
        <option value="newest">{tListings("sortNewest")}</option>
        <option value="price_asc">{tListings("sortPriceAsc")}</option>
        <option value="price_desc">{tListings("sortPriceDesc")}</option>
      </Select>

      <Button type="button" variant="outline" className="w-full" onClick={clear}>
        {tFilters("clear")}
      </Button>
    </div>
  );
}
