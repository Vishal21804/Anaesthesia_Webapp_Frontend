import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./LoginScreen.css"

export default function LoginScreen() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:8000/login",
        {
          email,
          password
        }
      )

      if (!res.data.status) {
        setError(res.data.message)
        return
      }

      const user = res.data.user

      localStorage.setItem("user", JSON.stringify(user))

      if (user.role === "HM") {
        navigate("/hm-dashboard")
      }

      if (user.role === "AT") {
        navigate("/technician-dashboard")
      }

      if (user.role === "BMET") {
        navigate("/bmet-dashboard")
      }

    } catch (err) {
      setError("Login failed")
    }

  }

  return (

    <div className="login-wrapper">

      {/* LEFT PANEL */}
      <div className="login-left">

        <h1>Anaesthesia Management System</h1>
        <p>Smart OT monitoring & checklist platform</p>

      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">

        <div className="login-box">

          <h2>Sign-in</h2>
          <p className="subtitle">Sign in to access your dashboard</p>

          {error && <p className="error-text">{error}</p>}

          <input
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password">
            Forgot Password?
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Sign In →
          </button>

          <div className="register-text">
            Not registered? <span>Register</span>
          </div>

        </div>

      </div>

    </div>

  )

}