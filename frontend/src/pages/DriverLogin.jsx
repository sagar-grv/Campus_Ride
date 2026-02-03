import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function DriverLogin() {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/driver-dashboard');
        } catch (err) {
            setError('Failed to log in: ' + (err.message || err));
        }
        setLoading(false);
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle('driver'); // Pass role preference if needed, though login usually just checks existing
            navigate('/driver-dashboard');
        } catch (err) {
            setError('Failed to log in with Google: ' + (err.message || err));
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Driver Portal</h2>
                    <p className="text-gray-400 mt-2">Sign in to manage your rides</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        variant="outline"
                        className="w-full h-12 bg-white text-black hover:bg-gray-200 border-0 font-bold text-base rounded-xl"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.53-6.033-5.652c0-3.122,2.701-5.652,6.033-5.652c1.489,0,2.83,0.512,3.882,1.353v0.003h0.002l2.768-2.616C17.436,3.873,15.109,2.802,12.545,2.802c-5.451,0-9.871,4.42-9.871,9.871s4.42,9.871,9.871,9.871c4.839,0,9.08-3.048,9.871-7.468H12.545z" />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 rounded-xl focus:ring-white focus:border-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 rounded-xl focus:ring-white focus:border-white"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold text-base rounded-xl"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <Link to="/" className="text-gray-500 hover:text-white transition-colors">
                            Back to Home
                        </Link>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        Don't have a driver account?{' '}
                        <Link to="/driver/signup" className="text-white hover:underline font-bold">
                            Sign up here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
