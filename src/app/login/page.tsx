"use client";

import { LoginForm } from "@/components/loginForm/page"
import loginImage from "../../../public/images/loginImage.png"
import { useEffect, useState } from "react";
import Header from "@/components/uheader/page";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Admin email from your withAuth.tsx
    const ADMIN_EMAIL = 'admin.halwai@gmail.com';

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Check if user is admin based on email
    const isAdminUser = (email: string): boolean => {
        const result = email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
        console.log(`Email comparison: "${email.toLowerCase().trim()}" === "${ADMIN_EMAIL.toLowerCase().trim()}" = ${result}`);
        return result;
    };

    const handleLogin = async (credentials: { email: string; password: string }) => {
        try {
            setLoading(true);
            setError("");

            console.log("Starting login process...");

            // Use Firebase authentication
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email.trim(),
                credentials.password
            );

            const user = userCredential.user;
            console.log("Firebase login successful:", user);

            // Check if user is admin
            if (user.email && isAdminUser(user.email)) {
                console.log("Admin user detected, redirecting to admin panel");
                // Use window.location for immediate navigation
                window.location.href = '/admin';
            } else {
                console.log("Regular user, redirecting to user dashboard");
                // Use window.location for immediate navigation
                window.location.href = '/';
            }

        } catch (err: any) {
            console.error("Firebase login error:", err);

            // Handle specific Firebase auth errors
            let errorMessage = "Login failed. Please check your credentials.";

            if (err.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email address.";
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
            } else if (err.code === 'auth/user-disabled') {
                errorMessage = "This account has been disabled.";
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Please try again later.";
            }

            setError(errorMessage);
            setLoading(false);
        }
        // Don't set loading to false here if navigation is successful
        // because we're redirecting anyway
    };

    return (
        <div className="min-h-screen bg-foreground text-[black] flex-column">
            <Header />
            <main className="min-h-screen bg-foreground flex items-center justify-center p-4 mt-[70px]">
                <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-xl flex">
                    <div className="w-1/2 relative hidden md:block">
                        <img
                            src={loginImage.src}
                            alt="Indian thali"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-8 md:p-12">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <LoginForm onSubmit={handleLogin} isLoading={loading} />
                    </div>
                </div>
            </main>
        </div>
    );
}