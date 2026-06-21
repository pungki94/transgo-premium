import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authApi } from '../api/authApi';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setErrorMessage('');

        try {
            const result = await authApi.login(email, password);
            if (result.status === 'success' && result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('isAuth', 'true');
                onLogin();
                navigate('/');
            } else {
                setErrorMessage(result.error || 'Login failed. Please check your email and password.');
            }
        } catch {
            setErrorMessage('An error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] relative overflow-hidden px-4">
            {/* Ambient glow effects */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Decorative lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[40%] h-[80%] border border-white/[0.03] rounded-sm" />
                <div className="absolute top-[20%] left-[8%] w-[30%] h-[60%] border border-white/[0.02]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Card */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header accent bar */}
                    <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

                    <div className="p-8 sm:p-10">
                        {/* Logo Area */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="bg-amber-500/10 p-3 rounded-xl mb-3 border border-amber-500/20">
                                <Bus size={28} className="text-amber-500" />
                            </div>
                            <h1 className="text-xl font-black italic text-white tracking-wide">
                                TRANS<span className="text-amber-500">ELITE</span>
                            </h1>
                        </div>

                        <h2 className="text-center text-slate-400 text-sm mb-6">
                            Welcome back,<br />please login to your account
                        </h2>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
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

                            {/* Password */}
                            <div>
                                <label className="text-xs text-slate-400 ml-1 mb-1 block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-[#1F2937] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none transition-colors placeholder-slate-500 text-sm pr-11"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Extras */}
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <label className="flex items-center cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="mr-2 rounded bg-[#1F2937] border-slate-600 text-amber-500 focus:ring-0 w-3.5 h-3.5" />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="hover:text-amber-500 transition-colors">Forgot password?</Link>
                            </div>

                            {/* Submit */}
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
                                        Signing In...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-xs text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                                Sign up now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
