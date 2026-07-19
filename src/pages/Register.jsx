import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Loader2, Check, X } from 'lucide-react';
import { authApi } from '../api/authApi';

const Register = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [strengthScore, setStrengthScore] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const navigate = useNavigate();

    const calcStrength = (pwd) => {
        let s = 0;
        if (pwd.length > 5) s++;
        if (pwd.length > 7) s++;
        if (/[a-z]/.test(pwd)) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        setStrengthScore(s);
        setStrengthLabel(s <= 2 ? 'Weak' : s <= 4 ? 'Medium' : 'Strong');
    };

    const validateField = (field, value) => {
        let error = '';
        switch (field) {
            case 'name':
                if (!value.trim()) error = 'Name is required';
                break;
            case 'email':
                if (!value.trim()) error = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
                break;
            case 'password':
                if (value.length < 6) error = 'Password must be at least 6 characters';
                else if (!/[a-z]/.test(value)) error = 'Must contain a lowercase letter';
                else if (!/[A-Z]/.test(value)) error = 'Must contain an uppercase letter';
                else if (!/[0-9]/.test(value)) error = 'Must contain a number';
                else if (!/[^A-Za-z0-9]/.test(value)) error = 'Must contain a special character';
                break;
            case 'confirmPassword':
                if (value !== password) error = 'Passwords do not match';
                break;
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handlePasswordChange = (e) => {
        const v = e.target.value;
        setPassword(v);
        validateField('password', v);
        calcStrength(v);
        if (confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: v !== confirmPassword ? 'Passwords do not match' : '' }));
        }
    };

    const handleConfirmChange = (e) => {
        const v = e.target.value;
        setConfirmPassword(v);
        setErrors((prev) => ({ ...prev, confirmPassword: v !== password ? 'Passwords do not match' : '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        const nameErr = !name.trim() ? 'Name is required' : '';
        const emailErr = !email.trim() ? 'Email is required' : !/\S+@\S+\.\S+/.test(email) ? 'Invalid email format' : '';
        let passErr = '';
        if (password.length < 6) passErr = 'Password must be at least 6 characters';
        else if (!/[a-z]/.test(password)) passErr = 'Must contain a lowercase letter';
        else if (!/[A-Z]/.test(password)) passErr = 'Must contain an uppercase letter';
        else if (!/[0-9]/.test(password)) passErr = 'Must contain a number';
        else if (!/[^A-Za-z0-9]/.test(password)) passErr = 'Must contain a special character';
        const confirmErr = password !== confirmPassword ? 'Passwords do not match' : '';
        if (nameErr || emailErr || passErr || confirmErr) {
            setErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confirmErr });
            return;
        }

        setIsLoading(true);
        try {
            const result = await authApi.register(name, email, password);
            if (result.status === 'success') {
                setVerificationSent(true);
            } else {
                alert(`Registration failed: ${result.error}`);
            }
        } catch {
            alert('An error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    const strengthColor = strengthScore <= 2 ? 'bg-red-500' : strengthScore <= 4 ? 'bg-yellow-500' : 'bg-green-500';
    const strengthWidth = strengthScore <= 2 ? 'w-1/3' : strengthScore <= 4 ? 'w-2/3' : 'w-full';
    const strengthTextColor = strengthScore <= 2 ? 'text-red-400' : strengthScore <= 4 ? 'text-yellow-400' : 'text-green-400';
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] relative overflow-hidden px-4 py-8">
            {/* Ambient glow */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

                    <div className="p-8 sm:p-10">
                        {/* Logo */}
                        <div className="flex flex-col items-center mb-5">
                            <div className="bg-amber-500/10 p-3 rounded-xl mb-3 border border-amber-500/20">
                                <Bus size={28} className="text-amber-500" />
                            </div>
                            <h1 className="text-xl font-black italic text-white tracking-wide">
                                TRANS<span className="text-amber-500">ELITE</span>
                            </h1>
                        </div>

                        {!verificationSent ? (
                            <>
                                <h2 className="text-center text-slate-400 text-sm mb-5">
                                    Create your new account
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    {/* Name */}
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); validateField('name', e.target.value); }}
                                            required
                                            placeholder="John Doe"
                                            className={`w-full bg-[#1F2937] text-white px-4 py-2.5 rounded-xl text-sm border ${errors.name ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500`}
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); validateField('email', e.target.value); }}
                                            required
                                            placeholder="email@example.com"
                                            className={`w-full bg-[#1F2937] text-white px-4 py-2.5 rounded-xl text-sm border ${errors.email ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500`}
                                        />
                                        {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Password <span className="text-red-500">*</span></label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Minimum 6 characters"
                                            className={`w-full bg-[#1F2937] text-white px-4 py-2.5 rounded-xl text-sm border ${errors.password ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500`}
                                        />
                                        <div className="mt-2 ml-1 space-y-1">
                                            {[
                                                { id: 'length', text: 'At least 6 characters', isValid: password.length >= 6 },
                                                { id: 'lowercase', text: 'One lowercase letter', isValid: /[a-z]/.test(password) },
                                                { id: 'uppercase', text: 'One uppercase letter', isValid: /[A-Z]/.test(password) },
                                                { id: 'number', text: 'One number', isValid: /[0-9]/.test(password) },
                                                { id: 'special', text: 'One special character', isValid: /[^A-Za-z0-9]/.test(password) },
                                            ].map((req) => (
                                                <div key={req.id} className={`flex items-center gap-1.5 text-xs ${req.isValid ? 'text-green-500' : 'text-red-500'}`}>
                                                    {req.isValid ? <Check size={14} /> : <X size={14} />}
                                                    <span>{req.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Confirm Password <span className="text-red-500">*</span></label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={handleConfirmChange}
                                            required
                                            placeholder="Repeat password"
                                            className={`w-full bg-[#1F2937] text-white px-4 py-2.5 rounded-xl text-sm border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500`}
                                        />
                                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                                    </div>

                                    {/* Show Password Toggle */}
                                    <div className="flex items-center gap-2 ml-1">
                                        <input
                                            type="checkbox"
                                            id="showPwd"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="w-3.5 h-3.5 rounded border-slate-600 bg-[#1F2937] text-amber-500 focus:ring-0"
                                        />
                                        <label htmlFor="showPwd" className="text-xs text-slate-400 cursor-pointer select-none">
                                            Show Password
                                        </label>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full font-bold text-sm py-3 rounded-xl transition-all duration-300 active:scale-[0.98] mt-1 ${isLoading
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : 'bg-amber-500 text-[#0B0F19] hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 size={18} className="animate-spin" />
                                                Signing up...
                                            </span>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-4 text-center text-xs text-slate-500">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                                        Sign In
                                    </Link>
                                </div>
                            </>
                        ) : (
                            /* Verification Sent Screen */
                            <div className="py-4 flex flex-col items-center text-center space-y-4">
                                <div className="bg-amber-500/10 p-4 rounded-full text-amber-400 ring-1 ring-amber-500/30">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Verify Your Email</h3>
                                    <p className="text-xs text-slate-400">
                                        Verification link has been sent to <span className="text-amber-500 font-medium">{email}</span>.
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Please check your inbox and click the link to activate your account.
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/10 w-full">
                                    <p className="text-xs text-slate-500 mb-2">Already verified?</p>
                                    <Link to="/login" className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 py-2 px-6 rounded-xl text-sm transition-colors block w-full border border-amber-500/20">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
