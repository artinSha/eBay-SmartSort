import './App.css'
import LoginPage from './app/login/login-page'
import SignupPage from './app/login/signup-page'
import Dashboard from './app/login/dashboard'
import SavedPage from './app/login/saved-page'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Toaster } from './components/ui/toaster'

function App() {

  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  function getSessionId() {
    const cookies = document.cookie.split(';')
 
    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.startsWith('sessionId=')) {
        const sessionId = cookie.split('=')[1]
        return sessionId
      }
    }
    return null
  }

  useEffect( () => {
    async function checkSession() {
      //if no session id
      const sessionId = getSessionId()
      if (sessionId === null) {
        setIsValidSession(false)
        return
      }

      //if session id was found
      try {
        let response = await axios.post("http://127.0.0.1:5000/validatesession", {
        sessionId: sessionId
        })
        console.log(response)
        setIsValidSession(true)
      }
      catch (error) {
        console.log(error)
        setIsValidSession(false)
      }
    }

    checkSession()
  }, [])

  return (
    <>
    <Router>
      <Routes>
        <Route path = "/" element = {<LoginPage />}></Route>
        <Route path = "/signup" element = {<SignupPage />}></Route>
        {/* If session is not yet defined, show null. 
            If session is defined, show dashboard or loginPage depending on its value */}
        <Route 
        path = "/dashboard" element = {isValidSession===null ? null :
                                            isValidSession ? <Dashboard /> : <LoginPage />}>
        </Route>
        <Route path = "/saved" element = {isValidSession===null ? null:
                                            isValidSession ? <SavedPage /> : <LoginPage />}></Route>
      </Routes>
    </Router>
    <Toaster />
    </>
  )
}

export default App
