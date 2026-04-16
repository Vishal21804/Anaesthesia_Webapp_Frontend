import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    Eye,
    EyeOff,
    Lock,
    Check,
    X,
    ArrowRight,
    Smartphone,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { toast } from "react-hot-toast";
import "./FirstLoginOnboarding.css";

export default function FirstLoginOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);

    // Step 1: Password
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Step 2: Mobile
    const [mobile, setMobile] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser.id) {
            navigate("/");
        }
        setUser(storedUser);
    }, [navigate]);

    const passwordRequirements = [
        { label: "At least 8 characters", met: newPassword.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
        { label: "Contains number", met: /[0-9]/.test(newPassword) },
        { label: "Passwords match", met: newPassword === confirmPassword && newPassword !== "" }
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);

    const handlePasswordChange = async () => {
        if (!allRequirementsMet) return;
        setIsLoading(true);
        try {
            const res = await api.put("/api/user/force-change-password", null, {
                params: {
                    user_id: user.id,
                    new_password: newPassword
                }
            });

            if (res.data.status) {
                toast.success("Password changed successfully");
                setStep(2);
            } else {
                toast.error(res.data.message || "Failed to change password");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMobileSubmit = async () => {
        if (!mobile || mobile.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }
        setIsLoading(true);
        try {
            // Assuming update-profile or update works for mobile
            const res = await api.put(`/api/user/update-profile/${user.id}`, null, {
                params: { mobile: mobile }
            });

            if (res.data.status) {
                toast.success("Mobile number updated");
                completeOnboarding();
            } else {
                toast.error(res.data.message || "Failed to update mobile number");
            }
        } catch (err: any) {
            // fallback if query params not supported or different endpoint
            try {
                const formData = new FormData();
                formData.append('mobile', mobile);
                await api.put(`/api/user/update-profile/${user.id}`, formData);
                toast.success("Mobile number updated");
                completeOnboarding();
                return;
            } catch (innerErr) { }

            toast.error("Failed to update mobile number");
        } finally {
            setIsLoading(false);
        }
    };

    const completeOnboarding = () => {
        // Update local user state
        const updatedUser = { ...user, force_password_change: false };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (user.role === "AT") navigate("/technician-dashboard");
        else if (user.role === "BMET") navigate("/bmet-dashboard");
        else navigate("/");
    };

    return (
        <div className="onboarding-wrapper">
            <div className="onboarding-left">
                <div className="brand-content">
                    <div className="onboarding-illustration">
                        {step === 1 ? <ShieldCheck size={120} /> : <Smartphone size={120} />}
                    </div>
                    <h1>Security Handshake</h1>
                    <p>Protecting hospital infrastructure with smart OT monitoring & maintenance.</p>
                </div>
            </div>

            <div className="onboarding-right">
                <div className="onboarding-box">
                    {/* Step Indicator */}
                    <div className="step-indicator">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            {step > 1 ? <Check size={14} /> : 1}
                        </div>
                        <div className={`step-line ${step > 1 ? 'active' : ''}`} />
                        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="step-content"
                            >
                                <h2 className="title">Change Your Password</h2>
                                <p className="description">
                                    For security, you must change your default password before continuing.
                                </p>

                                <div className="input-group">
                                    <label>NEW PASSWORD</label>
                                    <div className="input-field">
                                        <Lock className="field-icon" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Minimum 8 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="eye-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>CONFIRM PASSWORD</label>
                                    <div className="input-field">
                                        <Lock className="field-icon" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Re-enter password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="eye-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="requirements-box">
                                    <h3>Password Requirements</h3>
                                    <div className="requirements-grid">
                                        {passwordRequirements.map((req, i) => (
                                            <div key={i} className={`requirement-item ${req.met ? 'met' : ''}`}>
                                                {req.met ? <CheckCircle2 size={16} /> : <X size={16} />}
                                                <span>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="action-button primary"
                                    disabled={!allRequirementsMet || isLoading}
                                    onClick={handlePasswordChange}
                                >
                                    {isLoading ? "Saving..." : "Continue"}
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="step-content"
                            >
                                <h2 className="title">Add Mobile Number</h2>
                                <p className="description">
                                    Add your mobile number for account recovery. You can skip this step.
                                </p>

                                <div className="input-group">
                                    <label>MOBILE NUMBER</label>
                                    <div className="input-field">
                                        <Smartphone className="field-icon" size={18} />
                                        <input
                                            type="tel"
                                            placeholder="Enter mobile number"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
                                        />
                                    </div>
                                </div>

                                <div className="button-stack">
                                    <button
                                        className="action-button primary"
                                        disabled={isLoading}
                                        onClick={handleMobileSubmit}
                                    >
                                        {isLoading ? "Verifying..." : "Verify Number"}
                                        {!isLoading && <ArrowRight size={18} />}
                                    </button>

                                    <button
                                        className="action-button ghost"
                                        onClick={completeOnboarding}
                                    >
                                        Skip for now
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
