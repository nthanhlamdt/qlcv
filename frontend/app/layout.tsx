import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow - Quản lý công việc nhóm",
  description: "Ứng dụng quản lý công việc nhóm chuyên nghiệp",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <SonnerToaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
