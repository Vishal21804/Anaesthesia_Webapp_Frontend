import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, XCircle, Eye, EyeOff, Lock, ShieldCheck, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendForgotPasswordOTP, verifyForgotPasswordOTP, resetForgotPassword } from '../services/auth';
import toast from 'react-hot-toast';

type Step = 'EMAIL' | 'OTP' | 'PASSWORD';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const requirements = [
    { label: 'At least 8 characters long', met: password.length >= 8 },
    { label: 'Contains an uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains a number or symbol', met: /[0-9!@#$%^&*]/.test(password) }
  ];

  const allRequirementsMet = requirements.every(req => req.met);

  // Handle Resend Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await sendForgotPasswordOTP(email);
      if (res.status) {
        toast.success(res.message);
        setStep('OTP');
        setResendTimer(30);
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyForgotPasswordOTP(email, otpValue);
      if (res.status) {
        toast.success(res.message);
        setStep('PASSWORD');
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!allRequirementsMet) return;

    setLoading(true);
    try {
      const res = await resetForgotPassword({
        email,
        otp: otp.join(''),
        new_password: password,
        confirm_password: confirmPassword
      });
      if (res.status) {
        toast.success(res.message);
        navigate('/');
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeydown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors">
      <div className="max-w-md w-full">
        <button
          onClick={() => step === 'EMAIL' ? navigate(-1) : setStep(step === 'OTP' ? 'EMAIL' : 'OTP')}
          className="mb-6 p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors inline-flex">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <AnimatePresence mode='wait'>
          {step === 'EMAIL' && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div>
                <div className="w-12 h-12 bg-[#ecfdf5] dark:bg-emerald-950/30 rounded-xl flex items-center justify-center mb-6">
                  <Key className="w-6 h-6 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Reset Password
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Choose how you want to reset your password and verify your identity.
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 focus:border-health-primary focus:ring-4 focus:ring-health-primary/5 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#14b8a6] text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? <span className="animate-pulse">Sending...</span> : <>Send Reset Code <ArrowLeft className="w-5 h-5 rotate-180" /></>}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'OTP' && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 text-center"
            >
              <div className="text-left">
                <div className="w-12 h-12 bg-[#ecfdf5] dark:bg-emerald-950/30 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Verify OTP
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Enter the 6-digit code sent to your registered address.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeydown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:border-health-primary focus:ring-4 focus:ring-health-primary/5 outline-none transition-all text-slate-800 dark:text-slate-100"
                    />
                  ))}
                </div>

                <div>
                  {resendTimer > 0 ? (
                    <p className="text-sm text-slate-400">Resend in {resendTimer}s</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOTP()}
                      className="text-sm font-bold text-health-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#14b8a6] text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? <span className="animate-pulse">Verifying...</span> : <>Verify & Continue <ArrowLeft className="w-5 h-5 rotate-180" /></>}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'PASSWORD' && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div>
                <div className="w-12 h-12 bg-[#ecfdf5] dark:bg-emerald-950/30 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  New Password
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Set a strong password to protect your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 focus:border-health-primary focus:ring-4 focus:ring-health-primary/5 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 focus:border-health-primary focus:ring-4 focus:ring-health-primary/5 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>

                <div className="bg-[#f8fafc] dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
                    Password Requirements
                  </h3>
                  <div className="space-y-3">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        {req.met ? (
                          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <XCircle className="w-3 h-3 text-slate-400" />
                          </div>
                        )}
                        <span className={req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !allRequirementsMet}
                  className="w-full bg-[#14b8a6] text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <span className="animate-pulse">Updating...</span> : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}