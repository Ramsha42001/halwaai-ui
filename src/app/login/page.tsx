"use client";

import { LoginForm } from "@/components/loginForm/page"
import loginImage from "../../../public/images/loginImage.png"
import { useEffect, useState } from "react";
import Header from "@/components/uheader/page";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api/authService";

export default function Home() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogin = async (credentials: { email: string; password: string }) => {
        try {
            setLoading(true);
            setError("");
            const response = await authService.login(credentials.email, credentials.password);
            console.log("Login successful:", response);
            if(localStorage.getItem('userId')==='682c2913c87c02f49a6165cd'){
                router.push('/admin'); // Redirect to admin page after successful login
            }else{
                router.push('/user'); // Redirect to admin page after successful login
            }
        } catch (err) {
            setError("Login failed. Please check your credentials.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
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
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <LoginForm onSubmit={handleLogin} isLoading={loading} />
                    </div>
                </div>
            </main>
        </div>
    );
}
