import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import { AlertCircle } from "lucide-react"


export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const createNewUser = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    axios.post(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/signup`, {
      email: email,
      password: password
    })
    .then ( (response) => {
      console.log(response)
      alert("Account created!")
      navigate("/")
    })
    .catch( (error) => {
      console.log(error)
      setError(true)
    })

  }
  return (
    <>
    <div>
      {error ? 
      <> <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4"></AlertCircle>
          <AlertTitle>Account Exists</AlertTitle>
          <AlertDescription>An account already exists with this email</AlertDescription>
        </Alert> 
      </> : null}
    </div>
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createNewUser}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required onChange = {(e) => setPassword(e.target.value)}/>
                </div>
                <Button type="submit" className="w-full" >
                  Sign Up
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
