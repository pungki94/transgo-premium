import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bus, Loader2 } from 'lucide-react';
import { authApi } from '../api/authApi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const [strengthScore, setStrengthScore] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState('');

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

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

    const validatePassword = (pwd) => {
        if (pwd.length < 6) return 'Password must be at least 6 characters';
        if (!/[a-z]/.test(pwd)) return 'Must contain a lowercase letter';
        if (!/[A-Z]/.test(pwd)) return 'Must contain an uppercase letter';
        if (!/[0-9]/.test(pwd)) return 'Must contain a number';
        if (!/[^A-Za-z0-9]/.test(pwd)) return 'Must contain a special character';
        return '';
    };

    const handlePasswordChange = (e) => {
        const v = e.target.value;
        setPassword(v);
        calcStrength(v);
        const passErr = validatePassword(v);
        setErrors((prev) => ({ ...prev, password: passErr }));
        if (confirmPassword) {
            setErrors((prev) => ({ ...prev, password: passErr, confirmPassword: v !== confirmPassword ? 'Passwords do not match' : '' }));
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
        setIsLoading(true);
        setError('');

        const passErr = validatePassword(password);
        const confirmErr = password !== confirmPassword ? 'Passwords do not match' : '';
        if (passErr || confirmErr) {
            setErrors({ password: passErr, confirmPassword: confirmErr });
            setIsLoading(false);
            return;
        }

        const token = searchParams.get('token');
        if (!token) {
            setError('Reset token is invalid or missing.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await authApi.resetPassword(email, password, token);
            if (result.status === 'success') {
                setIsSubmitted(true);
            } else {
                setError(result.error || 'Failed to reset password.');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const strengthColor = strengthScore <= 2 ? 'bg-red-500' : strengthScore <= 4 ? 'bg-yellow-500' : 'bg-green-500';
    const strengthWidth = strengthScore <= 2 ? 'w-1/3' : strengthScore <= 4 ? 'w-2/3' : 'w-full';
    const strengthTextColor = strengthScore <= 2 ? 'text-red-400' : strengthScore <= 4 ? 'text-yellow-400' : 'text-green-400';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] relative overflow-hidden px-4">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

                    <div className="p-8 sm:p-10">
                        {/* Logo */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="bg-amber-500/10 p-3 rounded-xl mb-3 border border-amber-500/20">
                                <Bus size={28} className="text-amber-500" />
                            </div>
                            <h1 className="text-xl font-black italic text-white tracking-wide">
                                TRANS<span className="text-amber-500">ELITE</span>
                            </h1>
                        </div>

                        {!isSubmitted ? (
                            <div className="w-full">
                                <h2 className="text-center text-slate-400 text-sm mb-1">Reset Password</h2>
                                <p className="text-center text-slate-500 text-xs mb-5">Enter your new password.</p>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    {/* Email (readonly) */}
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="w-full bg-[#1F2937] text-slate-500 px-4 py-2.5 rounded-xl border border-white/5 cursor-not-allowed text-sm"
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">New Password <span className="text-red-500">*</span></label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="New password"
                                            className={`w-full bg-[#1F2937] text-white px-4 py-2.5 rounded-xl text-sm border ${errors.password ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500`}
                                        />
                                        {password && (
                                            <div className="mt-2 ml-1">
                                                <div className="flex h-1 bg-slate-700/50 rounded-full overflow-hidden w-24 mb-1">
                                                    <div className={`h-full transition-all duration-300 ${strengthColor} ${strengthWidth}`} />
                                                </div>
                                                <p className={`text-[10px] font-medium ${strengthTextColor}`}>
                                                    {strengthLabel === 'Strong' ? 'Strong password!' : strengthLabel}
                                                </p>
                                            </div>
                                        )}
                                        {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Confirm Password <span className="text-red-500">*</span></label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={handleConfirmChange}
                                            required
                                            placeholder="Repeat new password"
                                            className={`w-full bg-[#1F2937] text-white px-4 py-2.5 rounded-xl text-sm border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500`}
                                        />
                                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                                    </div>

                                    {/* Show Password */}
                                    <div className="flex items-center gap-2 ml-1">
                                        <input
                                            type="checkbox"
                                            id="showPwdReset"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="w-3.5 h-3.5 rounded border-slate-600 bg-[#1F2937] text-amber-500 focus:ring-0"
                                        />
                                        <label htmlFor="showPwdReset" className="text-xs text-slate-400 cursor-pointer select-none">
                                            Show Password
                                        </label>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full font-bold text-sm py-3 rounded-xl transition-all duration-300 active:scale-[0.98] ${isLoading
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : 'bg-amber-500 text-[#0B0F19] hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 size={18} className="animate-spin" />
                                                Resetting...
                                            </span>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-5 text-center text-xs text-slate-500">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">Sign In</Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="bg-green-500/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-green-500/30">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-white mb-2">Password Reset Successful!</h2>
                                <p className="text-slate-400 text-sm mb-6">
                                    You can now login with your new password.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-block bg-amber-500 text-[#0B0F19] font-bold text-sm py-2.5 px-6 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
