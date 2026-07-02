"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            router.push('/');
        } catch (err) {
            const code = err.code;
            if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (code === 'auth/too-many-requests') {
                setError('Too many attempts. Please try again later.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -ml-64 -mt-16 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-lg p-8">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-14 h-14 rounded-xl bg-cyan-600/10 border border-cyan-600/20 flex items-center justify-center mb-4">
                            <Hexagon className="w-7 h-7 text-cyan-600" strokeWidth={1.75} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Skills Mirage</h1>
                        <p className="text-slate-600 text-sm mt-1.5">Sign in to your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/70 text-white font-medium py-2.5 rounded-lg shadow-md transition-all active:scale-[0.99]"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-cyan-700 hover:text-cyan-800 font-medium transition-colors">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
