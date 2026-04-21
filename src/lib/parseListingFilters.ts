import { defaultListingFilters } from "@/lib/defaultFilters";
import type { ListingCategory, ListingFilters, SortOption } from "@/lib/types/listing";
import { LISTING_CATEGORIES } from "@/lib/constants/categories";

const SORTS: SortOption[] = ["newest", "price_asc", "price_desc"];

function first(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0];
  return param;
}

function isCategory(value: string): value is ListingCategory {
  return (LISTING_CATEGORIES as string[]).includes(value);
}

export function listingFiltersFromSearchParams(
  sp: Record<string, string | string[] | undefined>,
): ListingFilters {
  const q = first(sp.q) ?? defaultListingFilters.q;
  const location = first(sp.location) ?? defaultListingFilters.location;
  const categoryRaw = first(sp.category) ?? defaultListingFilters.category;
  const category: ListingFilters["category"] =
    categoryRaw === "all"
      ? "all"
      : isCategory(categoryRaw)
        ? categoryRaw
        : "all";

  const minRaw = first(sp.minPrice);
  const maxRaw = first(sp.maxPrice);
  const sortRaw = first(sp.sort) ?? defaultListingFilters.sort;
  const sort: SortOption = SORTS.includes(sortRaw as SortOption)
    ? (sortRaw as SortOption)
    : "newest";

  const pageRaw = first(sp.page);
  const page = pageRaw ? Math.max(1, Number(pageRaw) || 1) : 1;
  const pageSizeRaw = first(sp.pageSize);
  const pageSize = pageSizeRaw
    ? Math.min(48, Math.max(4, Number(pageSizeRaw) || defaultListingFilters.pageSize))
    : defaultListingFilters.pageSize;

  return {
    q,
    location,
    category,
    minPrice: minRaw ? Number(minRaw) : undefined,
    maxPrice: maxRaw ? Number(maxRaw) : undefined,
    sort,
    page,
    pageSize,
  };
}
