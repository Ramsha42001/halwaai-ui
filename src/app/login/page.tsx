"use client";

import { LoginForm } from "@/components/loginForm/page"
import loginImage from "../../../public/images/loginImage.png"
import { useEffect, useState } from "react";
import Header from "@/components/uheader/page";
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { storageService } from "@/utils/storage";

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-foreground text-[black]  flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 bg-foreground flex items-center p-4 pt-0 md:pt-[70px] justify-center overflow-hidden">
                <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-xl flex max-h-[calc(100vh-100px)]">
                    <div className="w-1/2 relative hidden md:block overflow-hidden">
                        <img
                            src={loginImage.src}
                            alt="Indian thali"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-3 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <LoginForm isLoading={loading} />
                    </div>
                </div>
            </main>
        </div>
    );
}