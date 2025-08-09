'use client'

import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart, Star, Clock } from 'lucide-react';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { menuItemService } from '@/services/api/menuItemService';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/services/store/menuItemsStore'
import { CustomPopup } from "@/components/popup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import withAuth from "@/utils/withAuth";
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuItemCardSkeleton } from '@/components/menuItemCard/page';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { CartPopup } from "@/components/cartPopup/page";
import { storageService } from "@/utils/storage";
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  _id: string
  name: string
  description: string
  imageUrl: string
  price: number
  category: {
    _id: string
    name: string
  }
  hasButter?: boolean
  quantity: number
}

function Thali() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedItemIds = searchParams.get('items')?.split(',') || [];
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dialog, setdialog] = useState(false);
  const [thaliName, setThaliName] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null)

  const { selectedItems, subscribe, unsubscribe, orderTotal, addCustomThaliToCart, clearSelectedItems } = useStore();

  useEffect(() => {
    setAuthToken(storageService.getAuthToken());
  }, []);

  console.log(authToken)
  const user = authToken;

  useEffect(() => {
    if (user) {
      subscribe(user);
      return () => unsubscribe();
    }
  }, [user, subscribe, unsubscribe]);

  const handleOpenThaliNameDialog = async () => {
    setdialog(!dialog);
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    menuItemService.getMenuItems()
      .then((response) => {
        setMenuItems(response);
      })
      .catch(() => {
        setError('Failed to fetch menu items');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  const handleAddToCart = async () => {
    if (!thaliName.trim()) {
      alert('Please enter a name for your thali');
      return;
    }

    setIsAddingToCart(true);
    try {
      const userId = user;
      const userRef = ref(database, `inventories/${userId}/menuItems`);
      const snapshot = await get(userRef);
      const items = snapshot.val() ? Object.values(snapshot.val()) as MenuItem[] : [];
      await addCustomThaliToCart(userId, thaliName, items);
      await clearSelectedItems(userId);
      setdialog(false);
      alert('Thali added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add thali to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }

  // Filter selected menu items based on store state
  const filteredSelectedMenuItems = selectedItems.map(item => ({
    ...item,
    butter: item.hasButter,
  }));

  const storeLoading = useStore((state) => state.loading);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <div className="flex flex-col min-h-screen mt-[70px] bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pb-[120px] sm:pb-[100px] lg:pb-[80px]">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between py-3 sm:py-4 lg:py-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <Link href="/user">
            <Button
              variant="outline"
              size="sm"
              className="bg-black text-white hover:bg-gray-800 hover:text-white shadow-md px-3 sm:px-4"
            >
              <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Menu</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          {/* Title - Responsive */}
          <div className="text-center flex-1 mx-2 sm:mx-4 ">
            <h1 className="font-poorStory font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl bg-background bg-clip-text text-transparent mt-[20px]">
              Your Custom Thali
            </h1>
            <p className="text-black font-poppins text-xs sm:text-sm mt-1 hidden sm:block">
              Review your selected items
            </p>
          </div>

          {/* Spacer for balance */}
          <div className="w-16 sm:w-20" />
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 pb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Thali Image - Mobile Optimized */}
          <motion.div
            className="w-full lg:w-[40%] flex justify-center items-start"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-amber-200/50">
                <div className="aspect-square relative rounded-lg sm:rounded-xl overflow-hidden">
                  <img
                    src="/images/thali1.png"
                    alt="Traditional Thali"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-3 sm:mt-4 text-center">
                  <h3 className="font-semibold text-amber-800 font-poorStory text-sm sm:text-base">Traditional Thali</h3>
                  <p className="text-amber-600 text-xs sm:text-sm font-poppins">Authentic Indian Experience</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Menu Items - Mobile Optimized */}
          <motion.div
            className="w-full lg:w-[60%] mb-[90px]"
            variants={itemVariants}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-amber-200/50 ">
              <div className="flex items-center justify-between mb-4 sm:mb-6 ">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <h2 className="font-semibold text-black text-sm sm:text-base lg:text-lg">Selected Items</h2>
                </div>
                <Badge className="bg-black text-white text-xs sm:text-sm px-2 sm:px-3 py-1">
                  {filteredSelectedMenuItems.length} items
                </Badge>
              </div>

              {(loading || storeLoading) ? (
                <div className="space-y-3 sm:space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-amber-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-pulse">
                      <div className="h-3 sm:h-4 bg-amber-200 rounded mb-2"></div>
                      <div className="h-2 sm:h-3 bg-amber-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 sm:h-3 bg-amber-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-red-600 bg-red-50 rounded-lg sm:rounded-xl p-4 sm:p-6 inline-block">
                    <p className="font-medium text-sm sm:text-base">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[350px] lg:max-h-[410px] overflow-y-auto">
                  {filteredSelectedMenuItems.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                      </div>
                      <h3 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">No items selected</h3>
                      <p className="text-amber-600 text-xs sm:text-sm px-4">Start building your perfect thali from the menu</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {filteredSelectedMenuItems.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-white to-amber-50/50 border border-amber-200/50 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          {/* Item Header - Mobile Responsive */}
                          <div className="flex justify-between items-start mb-2 sm:mb-3">
                            <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg font-poorStory flex-1 pr-2">
                              {item.name}
                            </h4>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-black text-sm sm:text-base">₹{item.price}</p>
                              <p className="text-xs text-amber-600">per item</p>
                            </div>
                          </div>

                          {/* Description - Mobile Responsive */}
                          <p className="text-black text-xs sm:text-sm font-poppins leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
                            {item.description}
                          </p>

                          {/* Bottom Section - Mobile Responsive */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex items-center flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs px-2 py-1">
                                Qty: {item.quantity}
                              </Badge>
                              {item.butter && (
                                <Badge variant="outline" className="border-amber-300 text-amber-700 text-xs px-2 py-1">
                                  With Butter
                                </Badge>
                              )}
                            </div>
                            <div className="text-right sm:flex-shrink-0">
                              <p className="font-bold text-amber-800 text-sm sm:text-base">
                                ₹{item.price * item.quantity}
                              </p>
                              <p className="text-xs text-amber-600">total</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Order Total and Action Buttons - Mobile Optimized */}
      <AnimatePresence>
        {selectedItems.length !== 0 && (
          <motion.div
            className="fixed bottom-[70px] sm:bottom-[70px] lg:bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-lg z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                {/* Order Total - Mobile Responsive */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">
                  <div className="text-center sm:text-left">
                    <p className="text-amber-700 text-xs sm:text-sm font-medium">Order Total</p>
                    <p className="font-bold text-amber-800 text-lg sm:text-xl">₹{orderTotal}</p>
                  </div>
                </div>

                {/* Add to Cart Button - Mobile Responsive */}
                <Button
                  className="bg-black hover:bg-gray-800 hover:text-white text-white px-6 sm:px-8 py-3 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                  onClick={handleOpenThaliNameDialog}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                      <span className="hidden sm:inline">Adding to Cart...</span>
                      <span className="sm:hidden">Adding...</span>
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thali Name Dialog - Mobile Responsive */}
      <CustomPopup
        isOpen={dialog}
        onClose={() => setdialog(false)}
        title="Name Your Custom Thali"
        className="mx-3 sm:mx-0 sm:max-w-[500px] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-black"
        footer={
          <div className="flex justify-end flex-row">
            <Button
              className="bg-black hover:bg-gray-800 text-white shadow-lg w-full sm:w-auto text-sm sm:text-base px-6 py-2"
              onClick={handleAddToCart}
              disabled={isAddingToCart || !thaliName.trim()}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                  Adding...
                </span>
              ) : (
                'Add to Cart'
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="thaliName" className="text-black font-medium text-sm sm:text-base">
              Give your thali a special name
            </Label>
            <p className="text-black text-xs sm:text-sm mt-1 mb-2 sm:mb-3">
              This will help you identify your custom creation
            </p>
          </div>
          <Input
            id="thaliName"
            placeholder="e.g., My Special Feast, Family Thali..."
            value={thaliName}
            onChange={(e) => setThaliName(e.target.value)}
            className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base"
          />
        </div>
      </CustomPopup>

      <CartPopup />
    </div>
  );
}

export default withAuth(Thali)