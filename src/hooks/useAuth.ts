'use client'

import {
  authApi,
  getStoredToken,
  getStoredRefreshToken,
  getStoredUser,
  setAuthSession,
  clearAuthSession,
  STORAGE_KEYS,
  type AuthUser,
} from '@/lib/api/auth'
import { apiClient } from '@/lib/api/client'
import { queryKeys } from '@/lib/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, useCallback } from 'react'

export function useAuth() {
  const queryClient = useQueryClient()
  const [initializing, setInitializing] = useState(true)
  const [token, setToken] = useState<string | null>(() => {
    const stored = getStoredToken()
    if (stored) {
      apiClient.setToken(stored)
    }
    return stored
  })

  const [cachedUser, setCachedUser] = useState<AuthUser | null>(() => {
    return getStoredUser()
  })

  useEffect(() => {
    apiClient.setToken(token)
  }, [token])

  const { data: user, isLoading, isError } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.me,
    retry: 1,
    enabled: Boolean(token),
    initialData: cachedUser,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (user) {
      setCachedUser(user)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    if (isError && token) {
      clearAuthSession()
      setToken(null)
      setCachedUser(null)
      apiClient.setToken(null)
    }
  }, [isError, token])

  useEffect(() => {
    if (!isLoading) {
      setInitializing(false)
    }
  }, [isLoading])

  const actualUser = user ?? cachedUser

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthSession(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.user
      )
      setToken(data.tokens.accessToken)
      setCachedUser(data.user)
      apiClient.setToken(data.tokens.accessToken)
      queryClient.setQueryData(queryKeys.auth.user, data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuthSession(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.user
      )
      setToken(data.tokens.accessToken)
      setCachedUser(data.user)
      apiClient.setToken(data.tokens.accessToken)
      queryClient.setQueryData(queryKeys.auth.user, data.user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthSession()
      setToken(null)
      setCachedUser(null)
      apiClient.setToken(null)
      queryClient.clear()
    },
    onError: () => {
      clearAuthSession()
      setToken(null)
      setCachedUser(null)
      apiClient.setToken(null)
      queryClient.clear()
    },
  })

  const login = useCallback(
    (data: { identifier: string; password: string }) => {
      loginMutation.mutate(data)
    },
    [loginMutation]
  )

  const loginAsync = useCallback(
    (data: { identifier: string; password: string }) => {
      return loginMutation.mutateAsync(data)
    },
    [loginMutation]
  )

  const logout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  const logoutAsync = useCallback(() => {
    return logoutMutation.mutateAsync()
  }, [logoutMutation])

  return {
    user: actualUser,
    isLoading: initializing || isLoading,
    isAuthenticated: initializing ? false : !!actualUser,
    login,
    loginAsync,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    logout,
    logoutAsync,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}