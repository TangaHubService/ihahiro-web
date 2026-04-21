"use client";

import { fetchListings } from "@/lib/api";
import type { ListingFilters } from "@/lib/types/listing";
import { useQuery } from "@tanstack/react-query";

export function useListings(filters: ListingFilters) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => fetchListings(filters),
  });
}
