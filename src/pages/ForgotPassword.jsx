import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Loader2 } from 'lucide-react';
import { authApi } from '../api/authApi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setErrorMessage('');

        try {
            const result = await authApi.forgotPassword(email);
            if (result.status === 'success') {
                setIsSubmitted(true);
            } else {
                setErrorMessage(result.error || 'Failed to send reset email.');
            }
        } catch {
            setErrorMessage('An error occurred. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] relative overflow-hidden px-4">
            {/* Ambient glow */}
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
                                <h2 className="text-center text-slate-400 text-sm mb-2">
                                    Forgot Password?
                                </h2>
                                <p className="text-center text-slate-500 text-xs mb-6">
                                    Enter your email to receive a password reset link.
                                </p>

                                {errorMessage && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errorMessage}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-400 ml-1 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                                            required
                                            placeholder="email@example.com"
                                            className="w-full bg-[#1F2937] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500 text-sm"
                                        />
                                    </div>

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
                                                Sending...
                                            </span>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-5 text-center text-xs text-slate-500">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="bg-amber-500/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-500/30">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-white mb-2">Check Your Email</h2>
                                <p className="text-slate-400 text-sm mb-6">
                                    Password reset link has been sent to <span className="font-semibold text-amber-500">{email}</span>.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-block bg-amber-500 text-[#0B0F19] font-bold text-sm py-2.5 px-6 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
