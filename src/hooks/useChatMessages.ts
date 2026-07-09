'use client'

import { useEffect } from 'react'
import { chatApi } from '@/lib/api/chat'
import { queryKeys } from '@/lib/queryKeys'
import { useAuth } from '@/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useChatMessages(threadId: string | undefined) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const messagesQuery = useQuery({
    queryKey: queryKeys.chat.messages(threadId ?? ''),
    queryFn: () => chatApi.listMessages(threadId!, 1, 50),
    enabled: isAuthenticated && Boolean(threadId),
    refetchInterval: 5000,
  })

  const sendMutation = useMutation({
    mutationFn: (body: string) => chatApi.sendMessage(threadId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(threadId ?? '') })
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.threads })
    },
  })

  const markReadMutation = useMutation({
    mutationFn: () => chatApi.markRead(threadId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.threads })
    },
  })

  useEffect(() => {
    if (isAuthenticated && threadId) {
      markReadMutation.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, threadId])

  return {
    messages: messagesQuery.data?.items ?? [],
    isLoading: messagesQuery.isPending,
    isError: messagesQuery.isError,
    sendMessage: sendMutation.mutate,
    isSending: sendMutation.isPending,
  }
}
