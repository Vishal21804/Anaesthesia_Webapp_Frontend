import { Routes, Route } from "react-router-dom"

import LoginScreen from "./pages/LoginScreen"
import { HMDashboard } from "./pages/HMDashboard"
import { TechnicianDashboard } from "./pages/TechnicianDashboard"
import { BMETDashboard } from "./pages/BMETDashboard"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (

    <Routes>

      <Route path="/" element={<LoginScreen />} />

      <Route
        path="/hm-dashboard"
        element={
          <ProtectedRoute>
            <HMDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/technician-dashboard"
        element={
          <ProtectedRoute>
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bmet-dashboard"
        element={
          <ProtectedRoute>
            <BMETDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>

  )

}

export default App