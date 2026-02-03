import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Shield, Zap, Car, Sparkles, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { db } from '../services/firebase';
import { getDoc, doc } from 'firebase/firestore';

export default function Home() {
    const [isConnected, setIsConnected] = useState(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    useEffect(() => {
        // Quick connectivity check
        const checkConnection = async () => {
            try {
                // Try to read a non-existent doc just to check connection/auth config validity
                // If it fails with "permission-denied" or "not-found", we are likely connected to the service
                // If it fails with "offline" or network error, we are not.
                await getDoc(doc(db, "health_check", "ping"));
                setIsConnected(true);
            } catch (error) {
                console.log("Connection check result:", error.code);
                // Firestore is reachable even if we get permission denied
                if (error.code === 'permission-denied' || error.code === 'unavailable') {
                    setIsConnected(true);
                } else {
                    setIsConnected(false);
                }
            }
        };
        checkConnection();
    }, []);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">

            {/* Connection Status Toast (Dev/Prototype Mode) */}
            <div className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${isConnected === null ? 'bg-gray-100 text-gray-500' : isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isConnected === null ? (
                    <>Connecting...</>
                ) : isConnected ? (
                    <><Wifi className="w-3 h-3" /> System Online</>
                ) : (
                    <><WifiOff className="w-3 h-3" /> Offline Mode</>
                )}
            </div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-sm text-white h-16 transition-all duration-300 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-xl">C</div>
                        <span className="text-xl font-bold tracking-tight">CampusRide</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full h-9 px-6 text-sm font-medium transition-colors">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-white text-black hover:bg-gray-200 rounded-full h-9 px-6 text-sm font-bold transition-transform hover:scale-105">
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 3D Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-black text-white min-h-screen flex items-center overflow-hidden perspective-1000">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-60 z-0"
                />

                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* Left Content */}
                    <motion.div style={{ y: y1 }} className="space-y-8 z-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9]"
                        >
                            Move <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Fast.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-2xl text-gray-400 max-w-lg leading-relaxed font-light"
                        >
                            The smartest way to get around campus.
                            Reliable rides, verified drivers, minute-by-minute tracking.
                        </motion.p>

                        {/* Interactive Search Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-2 rounded-2xl flex items-center gap-3 max-w-md shadow-2xl shadow-indigo-500/20 group cursor-pointer hover:shadow-indigo-500/40 transition-all duration-300"
                        >
                            <div className="bg-black w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:bg-gray-900 transition-colors">
                                <Search className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Where to?</div>
                                <div className="text-black font-bold text-lg">Library Complex</div>
                            </div>
                            <Link to="/signup">
                                <div className="bg-gray-100 hover:bg-black hover:text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right 3D Visual */}
                    <div className="relative h-[600px] w-full flex items-center justify-center perspective-[2000px]">
                        <motion.div
                            style={{ y: y2, rotateX: 20, rotateY: -20, rotateZ: 5 }}
                            initial={{ opacity: 0, rotateX: 40, rotateY: 0, scale: 0.8 }}
                            animate={{ opacity: 1, rotateX: 20, rotateY: -20, rotateZ: 5, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-[340px] h-[700px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden"
                        >
                            {/* Phone Screen Content */}
                            <div className="absolute inset-0 bg-white flex flex-col">
                                {/* Map Layer */}
                                <div className="flex-1 bg-gray-100 relative">
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                    {/* Route Line SVG */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                        <path d="M100 200 Q 150 400 250 500" stroke="black" strokeWidth="4" fill="none" strokeDasharray="8 8" />
                                        <circle cx="100" cy="200" r="8" fill="black" />
                                        <circle cx="250" cy="500" r="8" fill="black" />
                                    </svg>

                                    {/* Floating 3D Elements using CSS */}
                                    <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 p-3 bg-black text-white rounded-xl shadow-xl z-10 animate-bounce">
                                        <div className="text-xs font-bold">Driver Arriving</div>
                                        <div className="text-[10px] text-gray-400">2 mins away</div>
                                    </div>

                                    <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 p-2 bg-white text-black rounded-lg shadow-lg z-10 border border-gray-100">
                                        <div className="text-xs font-bold">You</div>
                                    </div>
                                </div>

                                {/* Bottom Sheet UI */}
                                <div className="bg-white p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20">
                                    <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                                                    <Car className="w-5 h-5 text-black" />
                                                </div>
                                                <div>
                                                    <div className="font-bold">Campus Basic</div>
                                                    <div className="text-xs text-gray-500">4 seats</div>
                                                </div>
                                            </div>
                                            <div className="font-bold">₹40</div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-black text-white rounded-xl shadow-lg transform scale-105 border border-black cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                                    <Zap className="w-5 h-5 text-yellow-400" />
                                                </div>
                                                <div>
                                                    <div className="font-bold">Campus Fast</div>
                                                    <div className="text-xs text-gray-300">Priority</div>
                                                </div>
                                            </div>
                                            <div className="font-bold">₹60</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 w-full bg-black text-white py-4 rounded-xl font-bold text-center">
                                        Confirm Ride
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Ride Tiers Section */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Ride your way</h2>
                        <p className="text-gray-500 text-lg">Choose the perfect ride for your needs and budget.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Campus Saver", price: "Best Value", Icon: Car, desc: "Affordable everyday rides for students.", iconColor: "text-green-500" },
                            { title: "Campus Auto", price: "Fastest", Icon: Zap, desc: "Quick hops between campus blocks.", iconColor: "text-yellow-500" },
                            { title: "Campus Plus", price: "Premium", Icon: Sparkles, desc: "Comfortable rides for groups.", iconColor: "text-purple-500" }
                        ].map((tier, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6">
                                    <tier.Icon className={`w-8 h-8 ${tier.iconColor}`} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
                                <div className="text-sm font-bold text-black bg-gray-100 inline-block px-3 py-1 rounded-full mb-4">
                                    {tier.price}
                                </div>
                                <p className="text-gray-500 leading-relaxed">
                                    {tier.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safety/Tech Section - Dark */}
            <section className="bg-black text-white py-32 px-6 overflow-hidden relative">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <motion.div
                            whileInView={{ scale: [0.9, 1] }}
                            transition={{ duration: 1 }}
                            className="bg-gray-900 rounded-[2.5rem] p-12 relative z-10 border border-gray-800"
                        >
                            <Shield className="w-20 h-20 text-white mb-8" />
                            <h3 className="text-3xl font-bold mb-6">Standard of Safety</h3>
                            <ul className="space-y-6">
                                {[
                                    "Verified student & driver profiles",
                                    "Real-time ride tracking",
                                    "Emergency SOS button",
                                    "24/7 Support line"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-lg text-gray-300">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        {/* Decorative */}
                        <div className="absolute -top-10 -left-10 w-full h-full bg-gray-800/50 rounded-[2.5rem] -z-10 transform -rotate-3" />
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                            Tech that <br /> protects you.
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            We use advanced geolocation and background checks to ensure every ride is safe. Our platform is built specifically for the university ecosystem.
                        </p>
                        <Button className="bg-white text-black hover:bg-gray-200 h-14 px-8 rounded-full text-lg font-bold">
                            Read our safety guidelines
                        </Button>
                    </div>
                </div>
            </section>

            {/* Driver CTA Section */}
            <section className="py-24 px-6 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-bold tracking-tight mb-6 text-black">Sign up to drive</h2>
                        <p className="text-xl text-gray-500 mb-8">
                            Join our community of verified drivers. Set your own schedule, earn competitive rates, and help fellow students get around safely.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/driver/signup">
                                <Button className="h-14 px-8 bg-black text-white hover:bg-gray-800 rounded-full text-lg font-bold">
                                    Become a Driver
                                </Button>
                            </Link>
                            <Link to="/driver/login">
                                <Button variant="outline" className="h-14 px-8 border-2 border-black text-black hover:bg-black hover:text-white rounded-full text-lg font-bold">
                                    Driver Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-gray-400 py-12 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
                    <div>© 2024 CampusRide Inc.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Accessibility</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
