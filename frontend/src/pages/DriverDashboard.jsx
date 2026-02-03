import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, MapPin, User, DollarSign, Bell, Shield, CheckCircle, Navigation, Phone, Lock } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function DriverDashboard() {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(false);

    // Ride State
    const [incomingRequest, setIncomingRequest] = useState(null);
    const [activeRide, setActiveRide] = useState(null);

    // Logout
    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }

    // LISTENER: Incoming Requests (Only when Online)
    useEffect(() => {
        if (!isOnline) {
            setIncomingRequest(null);
            return;
        }

        const q = query(
            collection(db, "rides"),
            where("status", "==", "waiting_for_driver")
            // In real app, verify driverId matches or is broadcast
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Just take the first one for the prototype
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                setIncomingRequest({ id: doc.id, ...doc.data() });
            } else {
                setIncomingRequest(null);
            }
        });

        return () => unsubscribe();
    }, [isOnline]);

    // LISTENER: Active Ride Updates
    useEffect(() => {
        if (!activeRide) return;

        const unsubscribe = onSnapshot(doc(db, "rides", activeRide.id), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Handle external cancellations
                if (data.status === 'cancelled') {
                    setActiveRide(null);
                    alert("Ride was cancelled by student.");
                    return;
                }

                setActiveRide({ id: docSnap.id, ...data });

                // Logic to lock ride if both confirmed
                if (data.studentConfirmed && data.driverConfirmed && data.status === 'negotiating') {
                    updateDoc(doc(db, "rides", activeRide.id), { status: 'locked' });
                }

                // Logic to complete ride if both reached
                if (data.studentReached && data.driverReached && data.status === 'locked') {
                    updateDoc(doc(db, "rides", activeRide.id), { status: 'completed' });
                }
            }
        });
        return () => unsubscribe();
    }, [activeRide?.id]);


    // Action: Accept Call
    async function acceptCall() {
        if (!incomingRequest) return;
        await updateDoc(doc(db, "rides", incomingRequest.id), {
            status: 'negotiating',
            driverId: currentUser.uid,
            // driverName: userProfile.name // Assuming profile has name
        });
        setActiveRide(incomingRequest);
        setIncomingRequest(null);
    }

    // Action: Confirm Deal
    async function confirmDeal() {
        if (!activeRide) return;
        await updateDoc(doc(db, "rides", activeRide.id), {
            driverConfirmed: true
        });
    }

    // Action: Mark Reached
    async function markReached() {
        if (!activeRide) return;
        await updateDoc(doc(db, "rides", activeRide.id), {
            driverReached: true
        });
    }

    // Action: Close Completed
    function closeRide() {
        setActiveRide(null);
    }

    // Action: Reject Call
    async function rejectRide() {
        if (!activeRide) return;
        await updateDoc(doc(db, "rides", activeRide.id), {
            status: 'cancelled'
        });
        setActiveRide(null);
    }

    // --- VERIFICATION GATE ---
    // If profile is not verified, show blocking screen
    if (userProfile && !userProfile.isVerified) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Verification Pending</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Your driver account is currently under review. Admin approval is required before you can access the dashboard.
                    </p>
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium mb-8">
                        Status: <span className="font-bold">Pending Review</span>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                        Sign Out
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            {/* Header */}
            <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <div className="text-xl font-bold">Driver Portal</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isOnline ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-black' : 'bg-gray-500'}`} />
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">{isOnline ? 'Accepting Rides' : 'Go Online'}</span>
                        <Switch
                            checked={isOnline}
                            onCheckedChange={setIsOnline}
                            className="data-[state=checked]:bg-green-500"
                        />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-800 mx-2" />
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-white">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <main className="p-6 max-w-xl mx-auto">

                {/* IDLE STATE */}
                {!activeRide && !incomingRequest && (
                    <div className="text-center py-20 opacity-50">
                        <div className="w-24 h-24 bg-gray-900 rounded-full mx-auto flex items-center justify-center mb-6">
                            <Navigation className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {isOnline ? "Searching for riders..." : "You are offline"}
                        </h3>
                        <p className="text-gray-500">
                            {isOnline ? "Stay on this screen to receive requests." : "Go online to start earning."}
                        </p>
                    </div>
                )}

                {/* INCOMING REQUEST */}
                {incomingRequest && !activeRide && (
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl animate-in slide-in-from-bottom-4 shadow-2xl shadow-green-900/20">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">New Request</h3>
                                <p className="text-green-400 font-medium">Est. Earnings: ₹40-60</p>
                            </div>
                            <div className="px-3 py-1 bg-gray-800 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400">
                                4 mins away
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">A</div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Pickup</div>
                                    <div className="text-lg font-bold">{incomingRequest.pickup}</div>
                                </div>
                            </div>
                            <div className="w-0.5 h-6 bg-gray-800 ml-4"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">B</div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Dropoff</div>
                                    <div className="text-lg font-bold">{incomingRequest.drop}</div>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={acceptCall}
                            className="w-full h-16 bg-green-500 hover:bg-green-400 text-black text-xl font-bold rounded-2xl shadow-lg shadow-green-500/20"
                        >
                            Accept Request
                        </Button>
                    </div>
                )}    {/* ACTIVE RIDE: NEGOTIATING */}
                {
                    activeRide?.status === 'negotiating' && (
                        <div className="bg-white text-black p-6 rounded-3xl shadow-xl animate-in fade-in">
                            {/* In-Call Header */}
                            <div className="bg-green-50 p-6 rounded-2xl mb-6 border border-green-100 flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center z-10 relative">
                                        <Phone className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full animate-ping opacity-20"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-900">On Call with {activeRide.studentName || 'Student'}</h3>
                                    <p className="text-green-700 text-sm font-medium">Negotiating details...</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-3 border border-gray-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Pickup</span>
                                    <span className="font-bold text-right max-w-[200px] truncate">{activeRide.pickup}</span>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Dropoff</span>
                                    <span className="font-bold text-right max-w-[200px] truncate">{activeRide.drop}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={rejectRide}
                                    className="h-14 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-2xl font-bold text-base transition-colors border border-red-100"
                                >
                                    End Call
                                </Button>
                                <Button
                                    onClick={confirmDeal}
                                    disabled={activeRide.driverConfirmed}
                                    className={`h-14 rounded-2xl font-bold text-base transition-all ${activeRide.driverConfirmed ? 'bg-gray-100 text-gray-400 border border-gray-200' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'
                                        }`}
                                >
                                    {activeRide.driverConfirmed ? 'Waiting...' : 'Confirm Deal'}
                                </Button>
                            </div>
                        </div>
                    )
                }

                {/* ACTIVE RIDE: LOCKED */}
                {
                    activeRide?.status === 'locked' && (
                        <div className="bg-green-500 text-black p-6 rounded-3xl shadow-xl animate-in zoom-in-95">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold mb-2">Ride Active</h3>
                                <p className="text-black/60 font-medium">Head to the destination.</p>
                            </div>

                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-black/5">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                        {activeRide.studentName?.[0] || 'S'}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-lg">{activeRide.studentName || 'Student'}</div>
                                        <div className="text-xs font-bold uppercase opacity-60">Rider</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-black/10 pb-2">
                                        <span className="opacity-60">To</span>
                                        <span className="font-bold">{activeRide.drop}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={markReached}
                                disabled={activeRide.driverReached}
                                className="w-full h-16 bg-black text-white hover:bg-gray-900 rounded-2xl text-xl font-bold border-2 border-transparent"
                            >
                                {activeRide.driverReached ? 'Waiting for confirmation...' : 'Arrived at Dropoff'}
                            </Button>
                        </div>
                    )
                }

                {/* COMPLETED */}
                {
                    activeRide?.status === 'completed' && (
                        <div className="bg-white text-black p-8 rounded-3xl text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full mx-auto flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Ride Complete!</h2>
                            <p className="text-gray-500 mb-8">Payment collected.</p>
                            <Button onClick={closeRide} className="w-full h-14 bg-black text-white rounded-full font-bold">
                                Back to Online
                            </Button>
                        </div>
                    )
                }

            </main >
        </div >
    );
}
