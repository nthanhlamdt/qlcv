"use client"

import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { socketService } from '@/lib/socket'

export function useSocket() {
  const { user } = useAuth()
  const connectedRef = useRef(false)

  useEffect(() => {
    if (user && !connectedRef.current) {
      // Get token from cookies or localStorage
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1]

      if (token) {
        socketService.connect(token)
        connectedRef.current = true
      }
    }

    return () => {
      if (connectedRef.current) {
        socketService.disconnect()
        connectedRef.current = false
      }
    }
  }, [user])

  return {
    socket: socketService,
    isConnected: socketService.isConnected()
  }
}
