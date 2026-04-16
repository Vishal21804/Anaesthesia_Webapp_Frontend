import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "../constants"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import "./LoginScreen.css"

export default function LoginScreen() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        `${API_BASE_URL}/login`,
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
      localStorage.setItem("user_id", user.id)

      // ✅ FORCE PASSWORD CHANGE CHECK (ONLY FOR AT & BMET)
      if (user.force_password_change && (user.role === "AT" || user.role === "BMET")) {
        navigate("/first-login-onboarding")
        return
      }

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

          <div className="relative group" style={{ marginBottom: '22px' }}>
            <div className="absolute left-0 h-[56px] w-12 flex items-center justify-center text-slate-400 group-focus-within:text-[#14b8a6] transition-colors pointer-events-none">
              <Mail size={18} />
            </div>
            <input
              className="login-input"
              style={{ paddingLeft: '56px', marginBottom: 0 }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group" style={{ marginBottom: '22px' }}>
            <div className="absolute left-0 h-[56px] w-12 flex items-center justify-center text-slate-400 group-focus-within:text-[#14b8a6] transition-colors pointer-events-none">
              <Lock size={18} />
            </div>
            <input
              className="login-input"
              style={{ paddingLeft: '56px', paddingRight: '48px', marginBottom: 0 }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#14b8a6] transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="forgot-password" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Sign In →
          </button>

          <div className="register-text">
            Not registered? <span onClick={() => navigate("/register")} style={{ cursor: 'pointer' }}>Register</span>
          </div>

        </div>

      </div>

    </div>

  )

}
