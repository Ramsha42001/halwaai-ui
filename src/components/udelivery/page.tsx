'use client'
import { useEffect, useState } from 'react';
import { MapPin, Clock, Truck, Star, Shield, Timer, Target } from 'lucide-react';
import Image from "next/image";
import { Button } from "../ui/button";
import Link from 'next/link';
import { storageService } from "@/utils/storage";
import { motion } from "framer-motion";

export default function Home() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(storageService.getAuthToken());
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const deliveryFeatures = [
    {
      icon: MapPin,
      title: "Wide Coverage Area",
      description: "We deliver to all areas within and near Bhilwara, Rajasthan",
      color: "text-blue-600",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Clock,
      title: "Daily Delivery",
      description: "Delivery schedule: 7 times a week for your convenience",
      color: "text-green-600",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Truck,
      title: "Affordable Pricing",
      description: "Delivery at very reasonable price with premium service",
      color: "text-orange-600",
      bgColor: "from-orange-50 to-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-orange-100/10 to-red-100/20" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-amber-300/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-orange-300/40 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-yellow-300/50 rounded-full animate-pulse"></div>

      <motion.div
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">

            {/* Left Section - Content */}
            <motion.div
              className="flex flex-col items-center xl:items-start text-center xl:text-left space-y-8"
              variants={itemVariants}
            >
              {/* Header Section */}
              <motion.div
                className="w-full space-y-6"
                variants={itemVariants}
              >
                {/* Premium Badge */}
                <motion.div
                  className="flex items-center justify-center xl:justify-start space-x-2"
                  variants={itemVariants}
                >
                </motion.div>

                <motion.h2
                  className="font-poorStory font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-6xl text-gray-800 leading-tight"
                  variants={itemVariants}
                >
                  <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Delivery
                  </span>{" "}
                  Information
                </motion.h2>

                <motion.p
                  className="text-lg sm:text-xl lg:text-xl text-gray-600 font-poppins leading-relaxed max-w-2xl mx-auto xl:mx-0"
                  variants={itemVariants}
                >
                  Experience the convenience of authentic thali delivery right to your doorstep with our reliable and affordable service.
                </motion.p>

                {/* Decorative Line */}
                <motion.div
                  className="w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto xl:mx-0"
                  variants={itemVariants}
                />
              </motion.div>

              {/* Enhanced Delivery Features */}
              <motion.div
                className="w-full space-y-4 lg:space-y-6"
                variants={containerVariants}
              >
                {deliveryFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group relative overflow-hidden"
                    variants={cardVariants}
                    whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  >
                    <div className={`bg-gradient-to-r ${feature.bgColor} p-6 lg:p-8 rounded-2xl border border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-300 relative`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>

                      <div className="relative z-10 flex items-start gap-4 lg:gap-6">
                        {/* Icon Container */}
                        <div className={`w-14 h-14 lg:w-14 lg:h-14 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
                          <feature.icon className={`w-7 h-7 lg:w-7 lg:h-7 ${feature.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl lg:text-2xl xl:text-2xl font-semibold text-gray-800 mb-2 lg:mb-3 group-hover:text-gray-900 transition-colors duration-300">
                            {feature.title}
                          </h4>
                          <p className="text-base lg:text-lg xl:text-lg text-gray-600 leading-relaxed font-poppins">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
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
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold px-8 py-4 rounded-3xl text-base shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 group-hover:border-gray-600">
                      <Target className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Customize Your Thali
                    </Button>
                  </motion.div>
                </Link>

                <Link href={authToken ? '/user/thali' : '/login'}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto group"
                  >
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto bg-gradient-to-r from-amber-50 to-orange-50 hover:from-orange-50 hover:to-amber-100 text-amber-700 font-bold px-8 py-4 rounded-3xl text-base shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-300 group-hover:border-orange-400"
                    >
                      <Timer className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Order Predefined Thali
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center xl:justify-start space-y-4 sm:space-y-0 sm:space-x-6 text-sm text-gray-600"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Safe & Secure</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Section - Enhanced Map Display */}
            <motion.div
              className="flex flex-col items-center justify-center space-y-8 lg:space-y-12"
              variants={itemVariants}
            >
              <motion.div
                className="text-center"
                variants={itemVariants}
              >
                <motion.h2
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-poorStory font-bold text-gray-800 mb-4 lg:mb-6"
                  variants={itemVariants}
                >
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                    Delivery
                  </span>{" "}
                  Coverage
                </motion.h2>
                <motion.p
                  className="text-lg sm:text-xl lg:text-xl text-gray-600 font-poppins"
                  variants={itemVariants}
                >
                  We proudly serve Bhilwara and surrounding areas
                </motion.p>
              </motion.div>

              {/* Enhanced Map Container */}
              <motion.div
                className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-cyan-100/30 to-teal-100/50 rounded-3xl blur-3xl transform rotate-6"></div>

                {/* Main Container */}
                <div className="relative bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-blue-100">
                  {/* Map Image */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/deliveryArea.png"
                      alt="Delivery Coverage Area - Bhilwara, Rajasthan"
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      priority
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Map Info */}
                  <div className="mt-4 lg:mt-6 text-center">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">Bhilwara, Rajasthan</h3>
                    <p className="text-sm lg:text-base text-gray-600 font-poppins">Complete city coverage with nearby areas</p>
                  </div>
                </div>

                {/* Floating Location Pins */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-bounce delay-500"></div>
                <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
              </motion.div>

              {/* Coverage Stats */}
              <motion.div
                className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full max-w-sm sm:max-w-md lg:max-w-lg"
                variants={containerVariants}
              >
                {[
                  { number: "100%", label: "City Coverage" },
                  { number: "30+", label: "Areas Served" },
                  { number: "24/7", label: "Support" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="text-center bg-white/80 rounded-xl p-3 sm:p-4 lg:p-6 shadow-md hover:shadow-lg transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -3 }}
                  >
                    <div className="text-xl sm:text-2xl lg:text-2xl font-bold text-amber-600 mb-1">{stat.number}</div>
                    <div className="text-xs sm:text-sm lg:text-sm text-gray-600 font-poppins">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}