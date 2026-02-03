import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/student-dashboard');
        } catch {
            setError('Failed to log in');
        }
        setLoading(false);
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/student-dashboard');
        } catch (e) {
            console.error(e);
            setError(e.message || 'Failed to log in with Google');
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center sm:text-left">
                    <Link to="/" className="inline-block mb-8">
                        <span className="text-2xl font-bold tracking-tight">CampusRide</span>
                    </Link>
                    <h2 className="text-3xl font-medium mb-2">Welcome back</h2>
                    <p className="text-gray-500">Please enter your details to sign in.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-3 text-sm">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-gray-100 border-none text-base px-4 focus:ring-2 focus:ring-black focus:bg-white transition-all"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-gray-100 border-none text-base px-4 focus:ring-2 focus:ring-black focus:bg-white transition-all"
                        />
                    </div>

                    <Button
                        disabled={loading}
                        type="submit"
                        className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold text-lg rounded-lg transition-transform active:scale-[0.99] shadow-lg shadow-black/10"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-gray-400 font-medium tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        variant="outline"
                        className="w-full mt-6 h-12 border-gray-200 hover:bg-gray-50 text-black font-medium text-base gap-3 rounded-lg"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </Button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account?
                    <Link to="/signup" className="ml-1 font-semibold text-black hover:underline cursor-pointer">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
