import { apiClient, API_ENDPOINTS } from './client'

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  isBuyer?: boolean
  isSeller?: boolean
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  isBuyer: boolean
  isSeller: boolean
  role: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginResponse {
  user: AuthUser
  tokens: TokenResponse
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data)
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data)
  },

  logout: async (): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  me: async (): Promise<AuthUser> => {
    return apiClient.get(API_ENDPOINTS.AUTH.ME)
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
  },
}

const isBrowser = typeof window !== 'undefined'

export function getStoredToken(): string | null {
  if (!isBrowser) return null
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export function getStoredRefreshToken(): string | null {
  if (!isBrowser) return null
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export function getStoredUser(): AuthUser | null {
  if (!isBrowser) return null
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as AuthUser
  } catch {
    return null
  }
}

export function setAuthSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser
): void {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function clearAuthSession(): void {
  if (!isBrowser) return
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}