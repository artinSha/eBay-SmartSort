import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import { AlertCircle } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState(false)
  const navigate = useNavigate()

  const fetchUserInfo = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    axios.post(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/login`, {
      email: email,
      password: password,
    }, {
      withCredentials: true
    })
    .then( (response) => {
      console.log(response)
      let date = new Date()
      //Set time to 30 min from now
      date.setTime(date.getTime() + 30 * 1000 * 60)
      //Set the cookie with session id
      document.cookie = "sessionId=" + response.data.sessionId + "; expires=" + date.toUTCString() + "; path=/"

      

      //Send user to dashboard, navigate(0) just refreshes for edge cases
      navigate("/dashboard")
      navigate(0)
    })
    .catch( (error) => {
      console.log(error)
      setAlert(true)
    })
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={fetchUserInfo} {...props}>
      {alert ? 
      <> <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4"></AlertCircle>
          <AlertTitle>Incorrect User Information</AlertTitle>
          <AlertDescription>Please try again</AlertDescription>
        </Alert> 
      </> : null}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className = "flex items-center">           
            <Label htmlFor="email">Email</Label> 
          </div>
          <Input id="email" type="email" placeholder="email@example.com" required 
            onChange = {(e) => setEmail(e.target.value)}/>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required onChange = {(e) => setPassword(e.target.value)}/>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
