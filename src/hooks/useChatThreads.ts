'use client'

import { chatApi } from '@/lib/api/chat'
import { queryKeys } from '@/lib/queryKeys'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'

export function useChatThreads() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.chat.threads,
    queryFn: chatApi.listThreads,
    enabled: isAuthenticated,
    refetchInterval: 15000,
  })
}
