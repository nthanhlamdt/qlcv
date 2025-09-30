"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { socketService } from '@/lib/socket'
import { Socket } from 'socket.io-client'

export function useSocket() {
  const { user, loading } = useAuth()

  const getCookie = (name: string): string => {
    if (typeof document === 'undefined') return ''
    return document.cookie
      .split('; ')
      .find((c) => c.startsWith(name + '='))
      ?.split('=')[1] || ''
  }

  useEffect(() => {
    if (!loading && user) {
      const cookieToken = getCookie('token')
      const lsToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
      const token = cookieToken || lsToken
      if (token) {
        socketService.connect(token)
      } else {
        // No token available; avoid connecting to prevent server error spam
        socketService.disconnect()
      }
    } else if (!user) {
      socketService.disconnect()
    }

    return () => {
      if (!user) {
        socketService.disconnect()
      }
    }
  }, [user, loading])

  return { socket: socketService }
}