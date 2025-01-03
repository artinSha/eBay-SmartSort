import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            SmartSort
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
        <div className="
        max-w-xs bg-card text-card-foreground p-6 border rounded-lg border-foreground">
          <LoginForm />
        </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/img/SmartSortlogo.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
        />
      </div>
    </div>
  )
}
