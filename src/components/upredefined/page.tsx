'use client';

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { IceCreamBowlIcon as Bowl, CroissantIcon as Bread, IceCream2, UtensilsCrossed, Star, Sparkles, Heart, ChefHat } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from 'next/link';
import predefinedThaliService from '@/services/api/predefinedThaliService';
import { useState, useEffect } from 'react';
import type { PredefinedThali } from '@/types/predefinedThali';
import { menuItems } from "@/data/menu-items";
import { ThaliCard } from "../thaaliComponent/page";
import { menuItemService } from "@/services/api";
import { cartService } from "@/services/api/cartService";
import { storageService } from "@/utils/storage";
import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion";

export default function PredefinedThali() {
  const [predefinedThali, setPredefinedThali] = useState<PredefinedThali[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  const selectedThali = JSON.parse(storageService.getItem('selectedThali') || '{}');

  const thaliToCart = async () => {
    const payload = {
      thaaliTitle: selectedThali.title,
      menuItems: selectedThali.items.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      thaaliTotalPrice: selectedThali.price,
      thaliquantity: selectedThali.quantity
    }

    console.log(payload);
    await cartService.addToCart(payload);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch all menu items
        const allMenuItems = await menuItemService.getMenuItems();
        console.log(allMenuItems)
        // 2. Fetch all thalis
        const thalis = await predefinedThaliService.getPredefinedThali();

        // 3. Enrich thali menuItems with full menu item data
        const enrichedThalis = thalis.map((thali: PredefinedThali) => {
          const thaliMenuItemIds = thali.menuItems.map((item: any) =>
            String(item.menuItem || item._id)
          );

          const filteredMenuItems = allMenuItems
            .filter((menuItem: any) =>
              thaliMenuItemIds.includes(String(menuItem._id))
            )
            .map((menuItem: any) => {
              const thaliItem = thali.menuItems.find(
                (item: any) => String(item.menuItem || item._id) === String(menuItem._id)
              );
              return {
                ...menuItem,
                quantity: thaliItem ? thaliItem.quantity : 1
              };
            });

          return {
            ...thali,
            menuItems: filteredMenuItems
          };
        });

        // 4. Set state
        setPredefinedThali(enrichedThalis);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await menuItemService.getMenuItems();
        console.log('API Response:', response);
        const filteredItems = response.filter((menuItem: any) =>
          predefinedThali.some(thali =>
            thali.menuItems.some((item: any) => item._id === menuItem._id)
          )
        );

        setFilteredMenuItems(filteredItems);

      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch menu items'));
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [predefinedThali]);

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

  if (loading) {
    return (
      <div id="predefined" className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-orange-100/10 to-red-100/20" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Loading Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-amber-500 fill-current animate-pulse" />
              <span className="text-sm text-amber-600 font-medium tracking-wider uppercase">
                Premium Collection
              </span>
              <Star className="w-6 h-6 text-amber-500 fill-current animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poorStory mb-4 text-gray-800">
              Check out our <span className="text-amber-600">Special Thalis</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-poppins">
              Delicious and authentic meals, curated just for you.
            </p>

            {/* Decorative Line */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-6"></div>
          </motion.div>

          {/* Loading Carousel */}
          <div className="w-full flex justify-center items-center">
            <Carousel className="w-full max-w-6xl">
              <CarouselContent>
                {[1, 2, 3].map((_, idx) => (
                  <CarouselItem key={idx} className="flex justify-center md:basis-1/2 lg:basis-1/3 h-full">
                    <div className="w-[320px] h-[480px] bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                      {/* Image Skeleton */}
                      <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl mb-6 animate-pulse"></div>

                      {/* Title Skeleton */}
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3 animate-pulse"></div>

                      {/* Description Skeleton */}
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>

                      {/* Menu Items Skeleton */}
                      <div className="space-y-2 mb-6">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        ))}
                      </div>

                      {/* Price Skeleton */}
                      <div className="h-6 w-24 bg-gradient-to-r from-amber-200 to-orange-200 rounded mb-4 mx-auto animate-pulse"></div>

                      {/* Button Skeleton */}
                      <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex border-amber-200 bg-white/80 hover:bg-amber-50" />
              <CarouselNext className="hidden md:flex border-amber-200 bg-white/80 hover:bg-amber-50" />
            </Carousel>
          </div>

          {/* Loading Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              { icon: ChefHat, text: "Chef Curated" },
              { icon: Heart, text: "Made with Love" },
              { icon: Sparkles, text: "Premium Quality" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <item.icon className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-gray-600 font-medium">{item.text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center relative">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We're having trouble loading our delicious thalis.</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="predefined" className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden relative">
        {/* Enhanced Background Elements */}
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
          {/* Enhanced Header Section */}
          <motion.section
            className="text-center mb-16 lg:mb-20"
            variants={itemVariants}
          >
            {/* Premium Badge */}
            <motion.div
              className="flex items-center justify-center space-x-2 mb-6"
              variants={itemVariants}
            >
              {/* <Star className="w-6 h-6 text-amber-500 fill-current animate-pulse" />
              <span className="text-sm text-amber-600 font-medium tracking-wider uppercase font-poppins">
                Premium Collection
              </span>
              <Star className="w-6 h-6 text-amber-500 fill-current animate-pulse" /> */}
            </motion.div>

            {/* Main Title */}
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poorStory mb-6 text-gray-800"
              variants={itemVariants}
            >
              Check out our <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">Special Thalis</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-poppins max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Delicious and authentic meals, curated just for you by our expert chefs using traditional recipes and premium ingredients.
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-8"
              variants={itemVariants}
            />

            {/* Stats Section */}
            <motion.div
              className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-600"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-amber-600" />
                <span>Chef Curated</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span>Made with Love</span>
              </div>
            </motion.div>
          </motion.section>

          {/* Enhanced Carousel Section */}
          <motion.div
            className="w-full flex justify-center items-center"
            variants={itemVariants}
          >
            <Carousel
              className="w-full max-w-6xl"
              plugins={[
                Autoplay({
                  delay: 4000,
                  loop: true,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true
                }),
              ]}
            >
              <CarouselContent className="ml-2 md:ml-4">
                {predefinedThali.map((thali, index) => (
                  <CarouselItem key={thali._id} className="flex justify-center md:basis-1/2 lg:basis-1/3 pl-2 md:pl-4">
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      <ThaliCard
                        key={thali._id}
                        _id={thali._id}
                        title={thali.name}
                        description={thali.description}
                        items={thali.menuItems.map((item: any) => ({
                          _id: item._id,
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity,
                        }))}
                        image={thali.image}
                        price={thali.price}
                        showButton={false}
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Enhanced Navigation */}
              <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16 border-amber-200 bg-white/80 hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 shadow-lg" />
              <CarouselNext className="hidden md:flex -right-12 lg:-right-16 border-amber-200 bg-white/80 hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 shadow-lg" />
            </Carousel>
          </motion.div>

          {/* Enhanced Call-to-Action Section */}
          <motion.div
            className="text-center mt-16 lg:mt-20"
            variants={itemVariants}
          >
            <motion.div
              className="max-w-3xl mx-auto space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-2xl lg:text-3xl font-bold font-poorStory text-gray-800">
                Ready to Experience Authentic Flavors?
              </h3>
              <p className="text-base lg:text-lg text-gray-600 font-poppins leading-relaxed">
                Each thali is carefully crafted with traditional recipes and the finest ingredients.
                Add your favorites to cart and enjoy restaurant-quality meals at home.
              </p>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={localStorage.getItem('authToken') ? '/user/cart' : '/login'}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-500 group-hover:border-orange-500"
                      onClick={thaliToCart}
                    >
                      <UtensilsCrossed className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      View Your Cart
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/user">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/80 hover:bg-amber-50 text-amber-700 font-bold px-8 py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-300 group-hover:border-orange-400"
                    >
                      <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Customize Your Own
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Features Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 lg:mt-20 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: ChefHat, title: "Expert Chefs", desc: "Curated by culinary experts" },
              { icon: Heart, title: "Made with Love", desc: "Traditional family recipes" },
              { icon: Sparkles, title: "Premium Quality", desc: "Finest ingredients only" },
              { icon: Star, title: "Highly Rated", desc: "4.9/5 customer satisfaction" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="text-center group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <item.icon className="w-8 h-8 text-amber-600 group-hover:text-orange-600 transition-colors duration-300" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 font-poppins">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Decorative Element */}
          <motion.div
            className="mt-20 text-center"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-300/50"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-300/50"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}