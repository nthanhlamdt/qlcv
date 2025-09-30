import LoginForm from "@/components/auth/LoginForm"

export default function Page() {
  return (
    <div className="flex items-center justify-center px-4 w-full min-h-[60vh]">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}


