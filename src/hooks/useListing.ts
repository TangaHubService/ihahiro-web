"use client";

import { fetchListingById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListingById(id!),
    enabled: Boolean(id),
  });
}
