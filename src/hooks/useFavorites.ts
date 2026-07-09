'use client'

import { favoritesApi } from '@/lib/api/favorites'
import { queryKeys } from '@/lib/queryKeys'
import { useAuth } from '@/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export function useFavorites() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKeys.favorites.all,
    queryFn: favoritesApi.list,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  })

  const favoriteIds = new Set((data ?? []).map((listing) => listing.id))

  const toggleMutation = useMutation({
    mutationFn: favoritesApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all })
    },
  })

  const isFavorited = useCallback((listingId: string) => favoriteIds.has(listingId), [favoriteIds])

  return {
    favorites: data ?? [],
    isFavorited,
    toggle: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  }
}
