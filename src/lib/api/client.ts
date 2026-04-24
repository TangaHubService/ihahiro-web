const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.accessToken = token
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    return headers
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      method,
      headers: {
        ...this.getHeaders(),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || `HTTP error ${response.status}`)
    }

    const json = await response.json()
    if (json && typeof json === 'object' && 'data' in json) {
      if (Array.isArray(json.data) && json.meta) {
        return { items: json.data, meta: json.meta } as T
      }

      return json.data as T
    }

    return json as T
  }

  requestRaw<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const url = `${this.baseUrl}${endpoint}`

    return fetch(url, {
      method,
      headers: {
        ...this.getHeaders(),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }
      return response.json()
    }).then(data => data as T)
  }

  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let queryString = ''
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value)
        }
      })
      queryString = '?' + searchParams.toString()
    }
    return this.request<T>(`${endpoint}${queryString}`)
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh-token',
  },
  USERS: {
    PROFILE: '/users/profile',
    ADDRESSES: '/users/addresses',
    ADDRESS: (id: string) => `/users/addresses/${id}`,
  },
  LOCATIONS: {
    PROVINCES: '/locations/provinces',
    DISTRICTS: '/locations/districts',
    SECTORS: '/locations/sectors',
    CELLS: '/locations/cells',
    VILLAGES: '/locations/villages',
    SEARCH: '/locations/search',
  },
  CATEGORIES: '/categories',
  UNITS: '/units',
  PRODUCTS: '/products',
  LISTINGS: {
    LIST: '/listings',
    MY: '/listings/my',
    DETAIL: (id: string) => `/listings/${id}`,
    SUBMIT: (id: string) => `/listings/${id}/submit`,
    ARCHIVE: (id: string) => `/listings/${id}/archive`,
    HISTORY: (id: string) => `/listings/${id}/history`,
  },
  MEDIA: {
    LIST: (listingId: string) => `/media/listing/${listingId}`,
    UPLOAD: '/media',
    DELETE: (id: string, listingId: string) => `/media/${id}/listing/${listingId}`,
  },
  SAVED_SEARCHES: '/saved-searches',
  LEADS: {
    LIST: '/leads',
    BUYER: '/leads/buyer',
    SELLER: '/leads/seller',
    DETAIL: (id: string) => `/leads/${id}`,
  },
  DELIVERIES: {
    LIST: '/deliveries',
    BUYER: '/deliveries/buyer',
    SELLER: '/deliveries/seller',
    STATUS: (id: string) => `/deliveries/${id}/status`,
    CANCEL: (id: string) => `/deliveries/${id}/cancel`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    READ: (id: string) => `/notifications/read/${id}`,
    READ_ALL: '/notifications/read-all',
  },
  REVIEWS: {
    LIST: '/reviews',
    USER: (userId: string) => `/reviews/user/${userId}`,
    USER_STATS: (userId: string) => `/reviews/user/${userId}/stats`,
  },
  CHAT: {
    THREADS: '/chat/threads',
    THREAD_MESSAGES: (id: string) => `/chat/threads/${id}/messages`,
    MESSAGES: '/chat/messages',
    MARK_READ: (id: string) => `/chat/threads/${id}/read`,
  },
  MODERATION: {
    PENDING: '/moderation/pending',
    STATS: '/moderation/stats',
    APPROVE: (id: string) => `/moderation/listing/${id}/approve`,
    REJECT: (id: string) => `/moderation/listing/${id}/reject`,
  },
  PRICE_HISTORY: '/price-history',
} as const
