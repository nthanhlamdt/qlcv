"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { postJson } from "@/lib/api"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
})

export type LoginValues = z.infer<typeof loginSchema>

type LoginFormProps = { isLoading?: boolean }

export default function LoginForm({ isLoading }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = async (values: LoginValues) => {
    try {
      setSubmitting(true)
      const res = await postJson('/auth/login', values)
      if (res.success) {
        login(res.user)
        toast.success("Đăng nhập thành công!")
        router.push("/")
        router.refresh()
      } else {
        toast.error(res.message || "Đăng nhập thất bại")
      }
    } catch (e: any) {
      toast.error(e.message || "Đăng nhập thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  const disabled = isLoading || submitting

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>Chào mừng bạn quay trở lại TaskFlow</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={disabled}>
                {disabled ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Chưa có tài khoản?{" "}
                <Link className="underline hover:text-primary" href="/auth/register">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}


