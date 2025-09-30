"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getJson } from "@/lib/api"
import { getAllCookies } from "@/lib/cookies"

export function DebugCookies() {
  const [cookies, setCookies] = useState<Record<string, string>>({})
  const [serverResponse, setServerResponse] = useState<any>(null)

  const refreshCookies = () => {
    setCookies(getAllCookies())
  }

  const testServerCookies = async () => {
    try {
      const response = await getJson('/auth/test-cookies')
      setServerResponse(response)
    } catch (error) {
      console.error('Error testing server cookies:', error)
      setServerResponse({ error: error.message })
    }
  }

  useEffect(() => {
    refreshCookies()
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug Cookies</CardTitle>
          <CardDescription>Kiểm tra cookies hiện tại</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={refreshCookies}>Refresh Cookies</Button>
            <Button onClick={testServerCookies} variant="outline">Test Server</Button>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Client-side Cookies:</h4>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
              {JSON.stringify(cookies, null, 2)}
            </pre>
          </div>

          {serverResponse && (
            <div>
              <h4 className="font-semibold mb-2">Server Response:</h4>
              <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                {JSON.stringify(serverResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
