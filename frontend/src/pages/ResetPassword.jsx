import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Loader, PartyPopper, AlertCircle, ArrowRight } from 'lucide-react';
import { AppLogo } from '@/components/ui/logo';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { confirmPasswordReset } = useContext(AuthContext);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!token) {
            setErrorMsg("Invalid or missing reset token.");
            setStatus('error');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            setStatus('error');
            return;
        }
        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            setStatus('error');
            return;
        }
        setStatus('loading');
        try {
            await confirmPasswordReset(token, password);
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setErrorMsg(err.response?.data?.error || "Failed to reset password.");
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-8 left-8"><AppLogo className="h-10 w-auto" /></div>
            <div className="z-10 bg-zinc-900/50 p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl backdrop-blur-md">
                <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Reset Password</h2>
                <p className="text-white/60 text-center mb-8">Enter your new password below.</p>
                
                {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{errorMsg}</p>
                    </div>
                )}
                {status === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg mb-6 flex items-center gap-3">
                        <PartyPopper className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">Password reset successful! Redirecting to login...</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/80 mb-2">New Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={status === 'loading' || status === 'success' || !token}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-2">Confirm New Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={status === 'loading' || status === 'success' || !token}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={status === 'loading' || status === 'success' || !token}
                        className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 mt-4 flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                        {status === 'loading' ? <Loader className="w-5 h-5 animate-spin" /> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
