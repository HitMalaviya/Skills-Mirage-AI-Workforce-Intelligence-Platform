"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            setLoading(true);
            await register(email, password, fullName);
            setSuccess('Registration successful! Redirecting to dashboard...');
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err) {
            const code = err.code;
            if (code === 'auth/email-already-in-use') {
                setError('This email is already registered. Try signing in.');
            } else if (code === 'auth/weak-password') {
                setError('Password is too weak. Use at least 6 characters.');
            } else if (code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -ml-64 -mt-16 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[28rem] h-[28rem] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[28rem] h-[28rem] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-lg p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-600/20 flex items-center justify-center mb-3">
                            <Hexagon className="w-6 h-6 text-cyan-600" strokeWidth={1.75} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create account</h1>
                        <p className="text-slate-600 text-sm mt-1">Join Skills Mirage dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm text-center">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                            <input
                                id="reg-name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                id="reg-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                id="reg-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
                            <input
                                id="reg-confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/70 text-white font-medium py-2.5 rounded-lg shadow-md transition-all active:scale-[0.99] mt-1"
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-cyan-700 hover:text-cyan-800 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
