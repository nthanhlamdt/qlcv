"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getJson } from '@/lib/api'

interface User {
  id: string
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
      // Kiểm tra xem có token trong cookie không
      const response = await getJson('/auth/me')
      if (response.success && response.user) {
        setUser(response.user)
      }
    } catch (error) {
      // Không có token hoặc token không hợp lệ
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
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
