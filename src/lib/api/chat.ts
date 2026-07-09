import { apiClient, API_ENDPOINTS } from './client'

export interface ChatThreadListItem {
  id: string
  listing: { id: string; title: string } | null
  otherUser: { id: string; firstName: string; lastName: string } | null
  lastMessageAt: string | null
  createdAt: string
}

export interface ChatMessage {
  id: string
  body: string
  senderId: string
  readAt: string | null
  createdAt: string
}

export interface CreateThreadInput {
  recipientId: string
  listingId?: string
}

export interface PaginatedChatMessages {
  items: ChatMessage[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const chatApi = {
  listThreads: async (): Promise<ChatThreadListItem[]> => {
    return apiClient.get(API_ENDPOINTS.CHAT.THREADS)
  },

  createThread: async (data: CreateThreadInput): Promise<ChatThreadListItem> => {
    return apiClient.post(API_ENDPOINTS.CHAT.THREADS, data)
  },

  listMessages: async (
    threadId: string,
    page = 1,
    limit = 30
  ): Promise<PaginatedChatMessages> => {
    return apiClient.get(API_ENDPOINTS.CHAT.THREAD_MESSAGES(threadId), {
      page: String(page),
      limit: String(limit),
    })
  },

  sendMessage: async (threadId: string, body: string): Promise<ChatMessage> => {
    return apiClient.post(API_ENDPOINTS.CHAT.THREAD_MESSAGES(threadId), { body })
  },

  markRead: async (threadId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.CHAT.MARK_READ(threadId))
  },
}
