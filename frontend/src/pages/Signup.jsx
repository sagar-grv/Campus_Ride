import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, User, Car } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Signup() {
    const [role, setRole] = useState(null); // 'student' or 'driver'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signup(email, password, role);
            navigate(role === 'driver' ? '/driver-dashboard' : '/student-dashboard');
        } catch (error) {
            console.error(error);
            setError(error.message || 'Failed to create account');
        }
        setLoading(false);
    }

    const SelectionCard = ({ value, label, icon: Icon }) => (
        <div
            onClick={() => setRole(value)}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group ${role === value
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
        >
            <div className={`p-4 rounded-full ${role === value ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                <Icon className={`w-8 h-8 ${role === value ? 'text-white' : 'text-black'}`} />
            </div>
            <span className="font-bold text-lg">{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-lg">
                <Link to="/" className="inline-block mb-10">
                    <span className="text-xl font-bold tracking-tight">CampusRide</span>
                </Link>

                <h2 className="text-3xl font-medium mb-2">
                    {role ? `Sign up as ${role === 'student' ? 'Student' : 'Driver'}` : 'Create your account'}
                </h2>
                <p className="text-gray-500 mb-8">Move around campus with ease.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-3 text-sm">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                {!role ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <SelectionCard value="student" label="Student" icon={User} />
                        <SelectionCard value="driver" label="Driver" icon={Car} />
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-gray-100 border-none text-base px-4 focus:ring-2 focus:ring-black focus:bg-white transition-all"
                            />
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-gray-100 border-none text-base px-4 focus:ring-2 focus:ring-black focus:bg-white transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-2 px-1">Must be at least 6 characters</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRole(null)}
                                className="h-12 px-6 border-gray-200 text-gray-600 hover:text-black hover:border-black"
                            >
                                Back
                            </Button>
                            <Button
                                disabled={loading}
                                type="submit"
                                className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-bold text-lg rounded-lg shadow-lg shadow-black/10 flex items-center justify-center gap-2 group"
                            >
                                {loading ? 'Creating...' : 'Continue'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.form>
                )}

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?
                    <Link to="/login" className="ml-1 font-semibold text-black hover:underline cursor-pointer">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
