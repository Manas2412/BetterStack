'use client'
import { useState } from 'react';
import { UserPlus, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/utils';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Placeholder signup logic
        let response = await axios.post(`${BACKEND_URL}/user/signin`, {
            username: username,
            password: password
        })

        localStorage.setItem("token", response.data.jwt)

        setLoading(false);
        router.push("/dashboard")
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left Side - Text */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-12 bg-slate-900 text-white">
                <div className="max-w-md">
                    <div className="flex items-center space-x-2 mb-8">
                        <Activity className="h-8 w-8 text-emerald-500" />
                        <span className="text-2xl font-bold">UpMonitor</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Get Started
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                        Join thousands of developers monitoring their infrastructure. Create an account to start tracking your services today.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                        <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-xl mb-6">
                            <UserPlus className="w-6 h-6 text-emerald-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-600 mb-8">Sign up to get started with your new account</p>

                        <form onSubmit={handleSignUp} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    placeholder="Choose a username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Password must be at least 6 characters long
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/signin')}
                                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
