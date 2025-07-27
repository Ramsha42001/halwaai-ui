'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
  {
    icon: "/images/thali.png",
    alt: "Thali icon",
    title: "Choose Your Base",
    text: "Choose an existing thali or create your own personalized selection",
    step: "01"
  },
  {
    icon: "/images/items.png",
    alt: "Menu icon",
    title: "Select Items",
    text: "Browse our menu categories and select your favorite dishes",
    step: "02"
  },
  {
    icon: "/images/address.png",
    alt: "Address icon",
    title: "Add Address",
    text: "Provide your delivery address for accurate location tracking",
    step: "03"
  },
  {
    icon: "/images/delivery.png",
    alt: "Checkout icon",
    title: "Review Order",
    text: "Review your selections and proceed to secure checkout",
    step: "04"
  },
  {
    icon: "/images/billing.png",
    alt: "Payment icon",
    title: "Payment",
    text: "Complete your order with our secure payment options",
    step: "05"
  },
  {
    icon: "/images/delivery.png",
    alt: "Delivery icon",
    title: "Enjoy",
    text: "Relax while we prepare and deliver your perfect thali",
    step: "06"
  },
];

export default function CustomizeThali() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden relative">

      <motion.div
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.section
          className="text-center mb-16 lg:mb-20"
          variants={itemVariants}
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-poorStory mb-4"
            variants={itemVariants}
          >
            Customize Your Thali
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-yellow-300 font-poppins italic"
            variants={itemVariants}
          >
            Craft Your Perfect Thali Experience
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent mx-auto mt-6"
            variants={itemVariants}
          />
        </motion.section>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* Left Section: Steps */}
          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            <motion.h3
              className="text-2xl lg:text-3xl font-semibold text-center xl:text-left mb-8 font-poorStory"
              variants={itemVariants}
            >
              How It Works
            </motion.h3>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 lg:gap-6"
              variants={containerVariants}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-white to-gray-50 text-[#8B4513] hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
                    <CardContent className="p-6 lg:p-8">
                      {/* Step Number */}
                      <div className="absolute top-4 right-4 text-4xl font-bold text-amber-200 group-hover:text-amber-300 transition-colors">
                        {step.step}
                      </div>

                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={step.icon}
                            alt={step.alt}
                            width={32}
                            height={32}
                            className="filter group-hover:brightness-110 transition-all duration-300"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg lg:text-xl font-semibold mb-2 text-[#8B4513] group-hover:text-[#A0522D] transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-sm lg:text-base text-gray-700 leading-relaxed font-poppins">
                            {step.text}
                          </p>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Section: Image and Call-to-Action */}
          <motion.div
            className="flex flex-col items-center space-y-8 lg:space-y-12"
            variants={itemVariants}
          >
            {/* Thali Image with Enhanced Styling */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-orange-200/10 to-red-200/20 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-500"></div>

              {/* Main Image Container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px] rounded-full border-4 border-amber-300/30 overflow-hidden shadow-2xl bg-gradient-to-br from-amber-50/10 to-orange-100/10">
                <Image
                  src="/images/thali1.png"
                  alt="Traditional Indian Thali with various dishes"
                  width={450}
                  height={450}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-orange-300 rounded-full opacity-60 animate-pulse delay-1000"></div>
            </motion.div>

            {/* Call to Action Section */}
            <motion.div
              className="text-center space-y-6 max-w-md"
              variants={itemVariants}
            >
              <motion.h3
                className="text-2xl lg:text-3xl font-semibold font-poorStory"
                variants={itemVariants}
              >
                Ready to Begin?
              </motion.h3>

              <motion.p
                className="text-gray-300 font-poppins leading-relaxed"
                variants={itemVariants}
              >
                Start your culinary journey with our easy-to-follow process and create memories one thali at a time.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={itemVariants}
              >
                <Link href={authToken ? '/user' : '/login'}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="bg-black hover:bg-black/90 text-white font-bold px-8 py-4 w-full sm:w-auto rounded-3xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      Customize Your Thali
                    </Button>
                  </motion.div>
                </Link>

                <Link href={authToken ? '/user/thali' : '/login'}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold px-8 py-4 w-full sm:w-auto rounded-3xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                      variant="secondary"
                      size="lg"
                    >
                      Order Predefined Thali
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          className="mt-20 text-center"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-yellow-300/50"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-yellow-300/50"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}