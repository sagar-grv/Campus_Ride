import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Clock, Phone, CheckCircle, Car } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';

const MOCK_DRIVERS = [
    { id: 'd1', name: 'Rajesh Kumar', vehicle: 'Swift Dzire (White)', phone: '+91 98765 43210', rating: 4.8 },
    { id: 'd2', name: 'Amit Singh', vehicle: 'Honda Activa (Blue)', phone: '+91 98765 43211', rating: 4.5 },
    { id: 'd3', name: 'Suresh Verma', vehicle: 'Auto Rickshaw', phone: '+91 98765 43212', rating: 4.9 },
];

export default function StudentDashboard() {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();

    // UI States: 'search' | 'list' | 'waiting' | 'negotiating' | 'locked' | 'completed'
    const [uiState, setUiState] = useState('search');

    // Form Data
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [time, setTime] = useState('');

    // Ride State
    const [currentRideId, setCurrentRideId] = useState(null);
    const [rideData, setRideData] = useState(null);

    // Logout
    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    // Step 1: Create Ride Request
    async function callDriver(driver) {
        setUiState('waiting');
        try {
            const docRef = await addDoc(collection(db, "rides"), {
                studentId: currentUser.uid,
                studentName: userProfile?.name || 'Student',
                pickup,
                drop,
                time,
                mockDriverId: driver.id, // In real app, this would target a specific driver
                driverName: driver.name,
                vehicle: driver.vehicle,
                status: 'waiting_for_driver',
                createdAt: new Date().toISOString(),
                studentConfirmed: false,
                driverConfirmed: false,
                studentReached: false,
                driverReached: false
            });
            setCurrentRideId(docRef.id);
        } catch (e) {
            console.error("Error creating ride:", e);
            setUiState('list');
            alert("Failed to call driver");
        }
    }

    // Real-time Ride Status Listener
    useEffect(() => {
        if (!currentRideId) return;

        const unsubscribe = onSnapshot(doc(db, "rides", currentRideId), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setRideData(data);

                // State Transitions based on Firestore data
                if (data.status === 'negotiating') setUiState('negotiating');
                if (data.status === 'locked') setUiState('locked');
                if (data.status === 'completed') setUiState('completed');
                if (data.status === 'cancelled') {
                    setUiState('search');
                    setCurrentRideId(null);
                    alert("Ride was cancelled");
                }
            }
        });

        return () => unsubscribe();
    }, [currentRideId]);


    // Step 2: Confirm Deal
    async function confirmDeal() {
        if (!currentRideId) return;
        await updateDoc(doc(db, "rides", currentRideId), {
            studentConfirmed: true
        });
        // Check if both confirmed is handled by Backend (or simulated by Driver side update)
    }

    // Step 3: Cancel/Reject
    async function cancelRide() {
        if (!currentRideId) return;
        await updateDoc(doc(db, "rides", currentRideId), {
            status: 'cancelled'
        });
        setUiState('search');
        setCurrentRideId(null);
    }

    // Step 4: Reached Destination
    async function markReached() {
        if (!currentRideId) return;
        await updateDoc(doc(db, "rides", currentRideId), {
            studentReached: true
        });
        // If both reached, status -> completed (Logic in Driver or Cloud Function)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-black">
            {/* Minimal Header */}
            <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="font-bold text-xl tracking-tight">CampusRide</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-sm font-medium text-gray-600">
                        {userProfile?.name}
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-black">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6">

                    {/* SEARCH STATE */}
                    {uiState === 'search' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-3xl font-bold mb-8">Where to?</h2>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                    <Input
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                        placeholder="Pickup location"
                                        className="bg-transparent border-none text-lg font-medium focus-visible:ring-0 px-0 placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="w-0.5 h-4 bg-gray-200 ml-8 my-[-8px] relative z-10" />
                                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-none" />
                                    </div>
                                    <Input
                                        value={drop}
                                        onChange={(e) => setDrop(e.target.value)}
                                        placeholder="Drop location"
                                        className="bg-transparent border-none text-lg font-medium focus-visible:ring-0 px-0 placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                                    <Clock className="w-6 h-6 ml-1 text-gray-500" />
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-transparent border-none text-lg font-medium focus-visible:ring-0 px-0"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={() => setUiState('list')}
                                disabled={!pickup || !drop || !time}
                                className="w-full mt-8 bg-black text-white h-14 rounded-full text-lg font-bold hover:bg-gray-900 transition-transform active:scale-95"
                            >
                                Find Driver
                            </Button>
                        </div>
                    )}

                    {/* LIST STATE */}
                    {uiState === 'list' && (
                        <div className="bg-white p-6 rounded-3xl shadow-xl animate-in fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Available Drivers</h3>
                                <Button variant="ghost" onClick={() => setUiState('search')}>Back</Button>
                            </div>
                            <div className="space-y-4">
                                {MOCK_DRIVERS.map(driver => (
                                    <div key={driver.id} className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                                                <Car className="w-6 h-6 text-black" />
                                            </div>
                                            <div>
                                                <div className="font-bold">{driver.name}</div>
                                                <div className="text-sm text-gray-500">{driver.vehicle}</div>
                                                <div className="text-xs text-yellow-600 font-bold">★ {driver.rating}</div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => callDriver(driver)}
                                            className="bg-black text-white rounded-full px-6 font-bold"
                                        >
                                            Call
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* WAITING STATE */}
                    {uiState === 'waiting' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl text-center animate-in zoom-in-95">
                            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full mx-auto flex items-center justify-center mb-6 animate-pulse">
                                <Phone className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Calling {rideData?.driverName}...</h3>
                            <p className="text-gray-500 mb-8">Waiting for them to accept the connection.</p>
                            <Button variant="outline" onClick={cancelRide} className="rounded-full border-red-200 text-red-600 hover:bg-red-50">
                                Cancel Request
                            </Button>
                        </div>
                    )}

                    {/* NEGOTIATING STATE */}
                    {uiState === 'negotiating' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl animate-in fade-in">
                            {/* In-Call Header */}
                            <div className="bg-green-50 p-6 rounded-2xl mb-6 border border-green-100 flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center z-10 relative">
                                        <Phone className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full animate-ping opacity-20"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-900">On Call with {rideData?.driverName}</h3>
                                    <p className="text-green-700 text-sm font-medium">discussing ride details...</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-3 border border-gray-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Pick up</span>
                                    <span className="font-bold text-right max-w-[200px] truncate">{rideData?.pickup}</span>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Drop off</span>
                                    <span className="font-bold text-right max-w-[200px] truncate">{rideData?.drop}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={cancelRide}
                                    className="h-14 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-2xl font-bold text-base transition-colors border border-red-100"
                                >
                                    End Call
                                </Button>
                                <Button
                                    onClick={confirmDeal}
                                    disabled={rideData?.studentConfirmed}
                                    className={`h-14 rounded-2xl font-bold text-base transition-all ${rideData?.studentConfirmed
                                        ? 'bg-gray-100 text-gray-400 border border-gray-200'
                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'
                                        }`}
                                >
                                    {rideData?.studentConfirmed ? 'Waiting...' : 'Confirm Ride'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* LOCKED / IN PROGRESS STATE */}
                    {uiState === 'locked' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl animate-in zoom-in-95 border-2 border-green-500 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-green-500 animate-pulse" />

                            <div className="text-center mb-8 pt-4">
                                <h3 className="text-3xl font-bold mb-2">Ride in Progress</h3>
                                <p className="text-green-600 font-medium">Safe Journey!</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-center flex flex-col items-center justify-center">
                                <div className="text-4xl mb-4">
                                    <Car className="w-12 h-12 text-black" />
                                </div>
                                <div className="font-bold text-xl">{rideData?.driverName}</div>
                                <div className="text-gray-500">{rideData?.vehicle}</div>
                            </div>

                            <Button
                                onClick={markReached}
                                disabled={rideData?.studentReached}
                                className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl text-xl font-bold"
                            >
                                {rideData?.studentReached ? 'Waiting for Driver...' : 'Reached Destination'}
                            </Button>
                        </div>
                    )}

                    {/* COMPLETED STATE */}
                    {uiState === 'completed' && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl text-center animate-in fade-in">
                            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full mx-auto flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Ride Completed</h3>
                            <p className="text-gray-500 mb-8">Thank you for riding with CampusRide.</p>
                            <Button
                                onClick={() => { setUiState('search'); setCurrentRideId(null); setPickup(''); setDrop(''); setTime(''); }}
                                className="w-full h-14 bg-black text-white rounded-full font-bold"
                            >
                                Book New Ride
                            </Button>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
