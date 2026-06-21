import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { authApi } from '../api/authApi';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (!email || !token) {
            setStatus('error');
            setMessage('Link verifikasi tidak valid.');
            return;
        }

        const verify = async () => {
            try {
                const result = await authApi.verifyEmail(email, token);
                if (result.status === 'success') {
                    setStatus('success');
                    setMessage(result.message || 'Verification Successful!');
                } else {
                    setStatus('error');
                    setMessage(result.error || 'Verification failed.');
                }
            } catch {
                setStatus('error');
                setMessage('An error occurred during verification.');
            }
        };

        verify();
    }, [searchParams]);

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

                        <h2 className="text-lg font-bold text-white text-center mb-6">Verifikasi Email</h2>

                        {/* Verifying */}
                        {status === 'verifying' && (
                            <div className="flex flex-col items-center space-y-4 py-4">
                                <svg className="animate-spin h-10 w-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <p className="text-slate-400 text-sm">Memverifikasi email Anda...</p>
                            </div>
                        )}

                        {/* Success */}
                        {status === 'success' && (
                            <div className="flex flex-col items-center text-center space-y-4 py-4">
                                <div className="bg-green-500/10 p-4 rounded-full text-green-400 ring-1 ring-green-500/30">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <p className="text-green-400 font-medium">{message}</p>
                                <p className="text-slate-400 text-xs">Akun Anda telah diaktifkan.</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="mt-4 bg-amber-500 text-[#0B0F19] font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    Login
                                </button>
                            </div>
                        )}

                        {/* Error */}
                        {status === 'error' && (
                            <div className="flex flex-col items-center text-center space-y-4 py-4">
                                <div className="bg-red-500/10 p-4 rounded-full text-red-400 ring-1 ring-red-500/30">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <p className="text-red-400 font-medium">Verification Failed</p>
                                <p className="text-slate-400 text-xs">{message}</p>
                                <Link to="/contact" className="text-xs text-amber-500 hover:text-amber-400 underline mt-2 transition-colors">
                                    Contact Support
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
