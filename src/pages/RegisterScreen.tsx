import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Key, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import "./LoginScreen.css"; // Reuse login styles

export function RegisterScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [hospitalName, setHospitalName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});



  const validateForm = () => {
    let newErrors: any = {};

    // Hospital Name validation (required)
    if (!hospitalName.trim()) {
      newErrors.hospitalName = "Hospital name is required";
    }

    // HM Name validation: Only alphabets and spaces
    if (!/^[A-Za-z ]+$/.test(adminName)) {
      newErrors.adminName = "Name should contain only letters";
    }

    // Email validation: Only Gmail addresses
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email = "Only Gmail addresses are allowed";
    }

    // Password validation: 8+ chars, uppercase, lowercase, number, special char
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      newErrors.password = "Password must be 8+ chars with uppercase, lowercase, number, and special character";
    }

    // Confirm Password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    console.log("Typed Email:", email);

    const payload = {
      hospital_name: hospitalName.trim(),
      hm_name: adminName.trim(),
      hm_email: email.trim(),
      password: password
    };

    console.log("Final Payload:", payload);

    setLoading(true);
    try {
      const response = await api.post('/api/register', payload);

      if (response.data.status) {
        toast.success(response.data.message || "Registration Successful!");
        navigate('/'); // Navigate back to sign in page
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.message || "An error occurred during registration";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least one number", met: /[0-9]/.test(password) },
    { label: "At least 8 characters", met: password.length >= 8 }
  ];

  return (
    <div className="login-wrapper">
      {/* LEFT PANEL (FIXED) */}
      <div className="login-left">
        <div style={{ position: 'sticky', top: '50%', transform: 'translateY(-50%)' }}>
          <h1>Anaesthesia Management System</h1>
          <p>Smart OT monitoring & checklist platform</p>
        </div>
      </div>

      {/* RIGHT PANEL (SCROLLABLE) */}
      <div className="login-right no-scrollbar" style={{ overflowY: 'auto', display: 'block', height: '100vh', padding: '60px 0' }}>
        <div className="login-box" style={{
          height: 'auto',
          width: '480px',
          padding: '45px 50px',
          margin: '0 auto', // Centering horizontally
          minHeight: 'min-content' // Ensuring regular flow
        }}>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ marginBottom: '35px' }}
          >
            <h2 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>Create Account</h2>
            <p className="subtitle" style={{ margin: 0 }}>Register your hospital to get started</p>
          </motion.div>

          <form onSubmit={handleRegister} className="space-y-1">
            {/* Hospital Name */}
            <div className="relative group" style={{ marginBottom: '15px' }}>
              <div className="absolute left-0 h-[56px] w-12 flex items-center justify-center text-slate-400 group-focus-within:text-[#14b8a6] transition-colors pointer-events-none">
                <Building2 size={18} />
              </div>
              <input
                type="text"
                name="hospitalName"
                placeholder="Hospital Name"
                value={hospitalName}
                onChange={(e) => {
                  setHospitalName(e.target.value);
                  setErrors({ ...errors, hospitalName: undefined });
                }}
                required
                className="login-input"
                style={{ paddingLeft: '56px', marginBottom: 0, height: '56px', borderColor: errors.hospitalName ? '#ef4444' : undefined }}
              />
              {errors.hospitalName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.hospitalName}</p>}
            </div>

            {/* Admin Full Name */}
            <div className="relative group" style={{ marginBottom: '15px' }}>
              <div className="absolute left-0 h-[56px] w-12 flex items-center justify-center text-slate-400 group-focus-within:text-[#14b8a6] transition-colors pointer-events-none">
                <User size={18} />
              </div>
              <input
                type="text"
                name="adminName"
                placeholder="Admin Full Name"
                value={adminName}
                onChange={(e) => {
                  setAdminName(e.target.value);
                  setErrors({ ...errors, adminName: undefined });
                }}
                required
                className="login-input"
                style={{ paddingLeft: '56px', marginBottom: 0, height: '56px', borderColor: errors.adminName ? '#ef4444' : undefined }}
              />
              {errors.adminName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.adminName}</p>}
            </div>

            {/* Email Address */}
            <div className="relative group" style={{ marginBottom: '15px' }}>
              <div className="absolute left-0 h-[56px] w-12 flex items-center justify-center text-slate-400 group-focus-within:text-[#14b8a6] transition-colors pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: undefined });
                }}
                required
                className="login-input"
                style={{ paddingLeft: '56px', marginBottom: 0, height: '56px', borderColor: errors.email ? '#ef4444' : undefined }}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative group" style={{ marginBottom: '15px' }}>
              <div className="absolute left-0 h-[56px] w-12 flex items-center justify-center text-slate-400 group-focus-within:text-[#14b8a6] transition-colors pointer-events-none">
                <Key size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined });
                }}
                required
                className="login-input"
                style={{ paddingLeft: '56px', paddingRight: '48px', marginBottom: 0, height: '56px', borderColor: errors.password ? '#ef4444' : undefined }}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#14b8a6]"
                style={{ zIndex: 10 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative group" style={{ marginBottom: '15px' }}>
              <div className="absolute left-0 h-[56px] w-12 flex items-center justify-center text-slate-400 group-focus-within:text-[#14b8a6] transition-colors pointer-events-none">
                <Key size={18} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                required
                className="login-input"
                style={{ paddingLeft: '56px', paddingRight: '48px', marginBottom: 0, height: '56px', borderColor: errors.confirmPassword ? '#ef4444' : undefined }}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#14b8a6]"
                style={{ zIndex: 10 }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Requirements */}
            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', marginBottom: '25px' }}>
              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password Requirements
              </p>
              <div className="space-y-1.5">
                {passwordRequirements.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${c.met ? 'bg-teal-500' : 'bg-slate-300'}`} />
                    <span style={{ fontSize: '10.5px', color: c.met ? '#0d9488' : '#64748b', fontWeight: c.met ? '600' : '500' }}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !hospitalName || !adminName || !email || !password || !confirmPassword}
              className="login-button"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '18px' }}
            >
              {loading ? "Registering..." : <>Register <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="register-text" style={{ marginTop: '25px' }}>
            Already have an account? <span onClick={() => navigate("/")}>Sign In</span>
          </div>
        </div>
      </div>
    </div>
  );
}

