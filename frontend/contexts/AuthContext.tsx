"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getJson, postJson } from '@/lib/api'
import { getAllCookies } from '@/lib/cookies'

interface User {
  _id: string
  name: string
  email: string
  avatar?: {
    public_id: string
    url: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Debug: Log cookies before checking auth
      console.log('Cookies before auth check:', getAllCookies())

      // Kiểm tra xem có token trong cookie không
      const response = await getJson('/auth/me')
      if (response.success && response.user) {
        setUser(response.user)
        scheduleRefresh()
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // Không có token hoặc token không hợp lệ
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Auto refresh access token ~5 minutes before expiry
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  const scheduleRefresh = (msUntilExpiry: number = 60 * 60 * 1000) => {
    // Default assumes 1h expiry; refresh 5 minutes before
    const refreshIn = Math.max(msUntilExpiry - 5 * 60 * 1000, 30 * 1000)
    clearRefreshTimer()
    refreshTimerRef.current = setTimeout(async () => {
      try {
        await postJson('/auth/refresh-token', {})
        // After refreshing, schedule the next one again
        scheduleRefresh(60 * 60 * 1000)
      } catch (e) {
        console.error('Auto refresh failed:', e)
        setUser(null)
        clearRefreshTimer()
      }
    }, refreshIn)
  }

  const login = (userData: User) => {
    setUser(userData)
    scheduleRefresh()
  }

  const logout = () => {
    setUser(null)
    clearRefreshTimer()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
