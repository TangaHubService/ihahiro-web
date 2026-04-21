import type { ListingFilters } from "@/lib/types/listing";

export const defaultListingFilters: ListingFilters = {
  q: "",
  location: "",
  category: "all",
  sort: "newest",
  page: 1,
  pageSize: 8,
};
