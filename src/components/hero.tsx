'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Percent, Truck, Sparkles, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { storageService } from "@/utils/storage";
import { CartPopup } from './cartPopup/page';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Changed to boolean
    const router = useRouter();

    // Declare function first
    const handlePredefinedScroll = () => {
        const predefinedSection = document.getElementById("predefined");
        if (predefinedSection) {
            predefinedSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        setIsClient(true);
        setIsMounted(true);
        const token = storageService.getAuthToken();
        setAuthToken(token);

        // Fix the admin check - assuming you have a method to check if user is admin
        if (token === 'VJDnf0of5QfpDXNgeOXtXYiCC3G3')
            setIsAdmin(true);
    }, []);

    // Enhanced Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const featureVariants = {
        hidden: { y: 40, opacity: 0, scale: 0.9 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className={`relative w-full min-h-screen overflow-hidden ${isAdmin ? 'mt-[150px] lg:mt-[70px]' : 'mt-[70px] lg:mt-0'}`}>

            {/* Floating Decorative Elements */}
            {/* <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-orange-300/40 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-amber-300/50 rounded-full animate-pulse"></div> */}

            <motion.div
                className="relative w-full min-h-screen bg-background text-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Only show admin dashboard if user is admin */}
                {isAdmin && (
                    <div className="flex justify-end items-center p-4 mt-[80px] bg-yellow-300 fixed top-0 left-0 w-[100%] z-50">
                        <Button onClick={() => router.push('/admin/menuItems')} className="w-auto h-[40px] bg-[white] text-black border border-black rounded-md p-2 mr-[10px]">
                            <span>Go to dashboard</span>
                        </Button>
                    </div>
                )}

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">

                    {/* Main Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">

                        {/* Left Section - Content */}
                        <motion.div
                            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1"
                            variants={itemVariants}
                        >
                            {/* Enhanced Title Section */}
                            <div className="space-y-4">
                                <motion.div
                                    className="flex items-center justify-center lg:justify-start space-x-2 mb-4"
                                    variants={itemVariants}
                                >
                                    {/* <Star className="w-6 h-6 text-yellow-300 fill-current animate-pulse" />
                                    <Star className="w-6 h-6 text-yellow-300 fill-current animate-pulse" /> */}
                                </motion.div>

                                <motion.h1
                                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide font-poorStory leading-none"
                                    variants={itemVariants}
                                >
                                    <span className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                                        Halwaai
                                    </span>
                                </motion.h1>

                                <motion.p
                                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-yellow-300 leading-tight"
                                    variants={itemVariants}
                                >
                                    A Thali Experience Like Never Before!
                                </motion.p>

                                <motion.p
                                    className="text-base sm:text-lg text-gray-300 max-w-2xl font-poppins leading-relaxed"
                                    variants={itemVariants}
                                >
                                    Discover authentic flavors, traditional recipes, and modern convenience all in one perfect thali experience.
                                </motion.p>
                            </div>

                            {/* Enhanced Mobile Image */}
                            <motion.div
                                className="lg:hidden relative group"
                                variants={itemVariants}
                            >
                                <div className=" rounded-full "></div>
                                <Image
                                    src="/images/combined3.png"
                                    alt="Traditional Indian Thali"
                                    width={350}
                                    height={350}
                                    className="object-contain drop-shadow-2xl relative z-10"
                                />
                            </motion.div>

                            {/* Enhanced Action Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                                variants={itemVariants}
                            >
                                <Link href={authToken ? '/user' : '/login'}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto group"
                                    >
                                        <Button
                                            className="bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold px-8 py-4 w-full sm:w-auto rounded-3xl text-base shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 group-hover:border-gray-600"
                                            size="lg"
                                        >
                                            <Utensils className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                            Customize Your Thali
                                        </Button>
                                    </motion.div>
                                </Link>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full sm:w-auto group"
                                >
                                    <Button
                                        className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold px-8 py-4 w-full sm:w-auto rounded-3xl text-base shadow-xl hover:shadow-2xl transition-all duration-300 border border-yellow-400 group-hover:border-orange-400"
                                        variant="secondary"
                                        size="lg"
                                        onClick={handlePredefinedScroll}
                                    >
                                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                        Order Special Thali
                                    </Button>
                                </motion.div>
                            </motion.div>

                            {/* Social Proof */}
                            <motion.div
                                className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-400"
                                variants={itemVariants}
                            >

                            </motion.div>
                        </motion.div>

                        {/* Right Section - Enhanced Thali Image */}
                        <motion.div
                            className="md:block hidden flex items-center justify-center order-1 lg:order-2"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {/* Decorative Background Circles */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-orange-200/10 to-red-200/20 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/10 via-transparent to-orange-300/10 rounded-full blur-2xl transform group-hover:rotate-12 transition-transform duration-1000"></div>

                                {/* Main Image */}
                                <div className="relative z-10">
                                    <Image
                                        src="/images/combined3.png"
                                        alt="Traditional Indian Thali"
                                        width={600}
                                        height={600}
                                        className="object-contain drop-shadow-2xl group-hover:drop-shadow-3xl transition-all duration-500"
                                        priority
                                    />
                                </div>

                                {/* Floating Accent Elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300/70 rounded-full animate-bounce delay-300 group-hover:bg-yellow-400"></div>
                                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-orange-300/60 rounded-full animate-pulse delay-700 group-hover:bg-orange-400"></div>
                                <div className="absolute top-1/4 -left-8 w-4 h-4 bg-amber-300/50 rounded-full animate-ping delay-1000"></div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Enhanced About Section */}
                    <motion.div
                        className="text-center py-16 lg:py-24"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Decorative Line */}
                            <motion.div
                                className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent mx-auto"
                                initial={{ width: 0 }}
                                whileInView={{ width: 96 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />

                            <motion.h3
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poorStory"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                About Halwaai
                            </motion.h3>

                            <motion.p
                                className="text-xl sm:text-2xl lg:text-3xl italic font-poppins text-yellow-300"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                Crafting Flavors, Creating Memories—One Thali at a Time.
                            </motion.p>

                            <motion.p
                                className="text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            >
                                From traditional recipes passed down through generations to innovative culinary experiences,
                                we bring the authentic taste of India directly to your doorstep.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Enhanced Feature Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-16 lg:pb-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        {/* Customize Card */}
                        <motion.div
                            className="group relative overflow-hidden"
                            variants={featureVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        >
                            <div className="bg-gradient-to-br from-[#997864] to-[#8B6F47] p-8 rounded-2xl text-center text-white relative z-10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                                {/* Background Pattern */}
                                <div className="absolute rounded-2xl"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                            <Utensils className="w-8 h-8 group-hover:text-yellow-300 transition-colors duration-300" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-xl lg:text-2xl mb-4 group-hover:text-yellow-100 transition-colors duration-300">
                                        Customize Your Thali, Your Way
                                    </h4>
                                    <p className="text-sm lg:text-base leading-relaxed text-white/90">
                                        Choose from thoughtfully curated categories to build a thali that's uniquely yours. Perfect for special occasions, gatherings, or everyday meals!
                                    </p>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>

                        {/* Savings Card */}
                        <motion.div
                            className="group relative overflow-hidden"
                            variants={featureVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        >
                            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] p-8 rounded-2xl text-center text-black relative z-10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                            <Percent className="w-8 h-8 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-xl lg:text-2xl mb-4 group-hover:text-white transition-colors duration-300">
                                        More Thalis, More Savings
                                    </h4>
                                    <p className="text-sm lg:text-base leading-relaxed text-black/80">
                                        Truly satisfying meals that give you more value—ideal for meal gatherings with family, friends, or for yourself!
                                    </p>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>

                        {/* Delivery Card */}
                        <motion.div
                            className="group relative overflow-hidden"
                            variants={featureVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        >
                            <div className="bg-gradient-to-br from-[#997864] to-[#8B6F47] p-8 rounded-2xl text-center text-white relative z-10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                            <Truck className="w-8 h-8 group-hover:text-yellow-300 transition-colors duration-300" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-xl lg:text-2xl mb-4 group-hover:text-yellow-100 transition-colors duration-300">
                                        Delivered to Your Door
                                    </h4>
                                    <p className="text-sm lg:text-base leading-relaxed text-white/90">
                                        Regional delicacies made fresh, delivering authentic flavors to your doorstep exactly when you need them!
                                    </p>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                <CartPopup />
            </motion.div>
        </div>
    );
}