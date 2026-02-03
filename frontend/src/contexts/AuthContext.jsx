import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../services/firebase';
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sign up with Email/Password and set role
    async function signup(email, password, role, name) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        const profileData = {
            email,
            role,
            name,
            isVerified: role === 'student', // Students auto-verified, Drivers need approval
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", user.uid), profileData);

        setUserRole(role);
        setUserProfile(profileData);
        return user;
    }

    // Login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Google Login
    async function loginWithGoogle(role) {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            const profileData = {
                email: user.email,
                role: role || 'student',
                name: user.displayName,
                isVerified: (role || 'student') === 'student',
                createdAt: new Date().toISOString()
            };
            await setDoc(docRef, profileData);
            setUserRole(role || 'student');
            setUserProfile(profileData);
        } else {
            const data = docSnap.data();
            setUserRole(data.role);
            setUserProfile(data);
        }

        return user;
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserRole(data.role);
                        setUserProfile(data);
                    }
                } else {
                    setUserRole(null);
                    setUserProfile(null);
                }
                setCurrentUser(user);
            } catch (error) {
                console.error("Auth State Change Error:", error);
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        userProfile,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-black text-white">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}
