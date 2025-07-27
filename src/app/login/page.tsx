"use client";

import { LoginForm } from "@/components/loginForm/page"
import loginImage from "../../../public/images/loginImage.png"
import { useEffect, useState } from "react";
import Header from "@/components/uheader/page";
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { storageService } from "@/utils/storage";
import { motion } from "framer-motion";
import { Star, ChefHat, Sparkles } from "lucide-react";

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
            }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.4
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col overflow-hidden relative overflow-y-hidden ">
            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-10 w-4 h-4 bg-amber-300/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-orange-300/40 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-yellow-300/50 rounded-full animate-pulse"></div>

            <Header />

            <motion.main
                className="flex-1 flex items-center justify-center p-3 sm:p-4 pt-0 pt-[70px]  md:pt-[80px] overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="w-full max-w-[350px] sm:max-w-sm md:max-w-[900px] lg:max-w-6xl bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-y-hidden shadow-2xl flex max-h-[calc(100vh-100px)] border border-white/50"
                    variants={cardVariants}
                >
                    {/* Left Side - Image Section - Hidden on mobile, visible on larger screens */}
                    <motion.div
                        className="w-1/2 relative hidden md:block overflow-hidden"
                        variants={imageVariants}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20 z-10"></div>
                        <img
                            src={loginImage.src}
                            alt="Traditional Indian Thali"
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay Content */}
                        <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                            >
                                <h3 className="text-2xl lg:text-3xl font-bold font-poorStory mb-2">
                                    Welcome to Halwaai
                                </h3>
                                <p className="text-lg opacity-90 font-poppins">
                                    Authentic Indian thalis crafted with love and tradition
                                </p>

                                {/* Feature Points */}
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <ChefHat className="w-5 h-5 text-yellow-300" />
                                        <span className="text-sm">Chef-curated recipes</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-5 h-5 text-yellow-300 fill-current" />
                                        <span className="text-sm">Premium quality ingredients</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-5 h-5 text-yellow-300" />
                                        <span className="text-sm">Delivered fresh to your door</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side - Form Section */}
                    <motion.div
                        className="w-full md:w-1/2 flex flex-col"
                        variants={formVariants}
                    >
                        {/* Scrollable content area */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="py-4 sm:py-6 md:py-8 lg:py-12 min-h-full flex items-center">
                                <div className="w-full">
                                    {error && (
                                        <motion.div
                                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                    <LoginForm isLoading={loading} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.main>
        </div>
    );
}