'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ShoppingCart, AlertCircle, Star, Package, Clock } from 'lucide-react'
import FoodCard from "@/components/cartCard/page"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useStore } from '@/services/store/menuItemsStore'
import withAuth from "@/utils/withAuth"
import { Skeleton } from "@/components/ui/skeleton"
import { storageService } from "@/utils/storage"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from 'framer-motion'

const CartCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-red-50 border border-amber-200/50 rounded-xl p-4 sm:p-6 space-y-4 shadow-lg">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 bg-amber-200/50" />
        <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 rounded-full bg-amber-200/50" />
      </div>

      {/* Menu items skeleton */}
      <div className="space-y-2 sm:space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex justify-between items-center py-2">
            <div className="flex-1">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-1 bg-amber-200/50" />
              <Skeleton className="h-2 sm:h-3 w-12 sm:w-16 bg-amber-200/50" />
            </div>
            <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 bg-amber-200/50" />
          </div>
        ))}
      </div>

      {/* Footer skeleton */}
      <div className="pt-3 sm:pt-4 border-t border-amber-200 space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 bg-amber-200/50" />
          <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 bg-amber-200/50" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 sm:h-8 w-7 sm:w-8 rounded bg-amber-200/50" />
          <Skeleton className="h-7 sm:h-8 w-10 sm:w-12 rounded bg-amber-200/50" />
          <Skeleton className="h-7 sm:h-8 w-7 sm:w-8 rounded bg-amber-200/50" />
        </div>
      </div>
    </div>
  )
}

// Loading State Component
const CartLoading = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Back button skeleton */}
        <Skeleton className="h-9 sm:h-10 w-20 sm:w-24 mb-4 sm:mb-6 bg-amber-200/50" />

        {/* Title skeleton */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="text-center">
            <Skeleton className="h-8 sm:h-10 w-32 sm:w-48 mb-2 bg-amber-200/50" />
            <Skeleton className="h-4 w-24 sm:w-36 bg-amber-200/50" />
          </div>
        </div>

        {/* Cart items grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <CartCardSkeleton key={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Error State Component
const CartError: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Link href="/user">
          <Button
            variant="outline"
            className="bg-black hover:bg-gray-800 border-amber-200 text-white hover:text-white shadow-md mb-4 sm:mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Menu
          </Button>
        </Link>

        <div className="max-w-md mx-auto text-center py-8 sm:py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-200/50">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4 font-poorStory">Oops! Something went wrong</h2>
            <p className="text-amber-700 mb-6 text-sm sm:text-base font-poppins">{error || 'Failed to load your cart items. Please try again.'}</p>
            <div className="space-y-3">
              <Button
                onClick={onRetry}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg"
              >
                Try Again
              </Button>
              <Link href="/user">
                <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Empty Cart Component
const EmptyCart = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Link href="/user">
          <Button
            variant="outline"
            className="bg-black hover:bg-gray-800 border-amber-200 text-white hover:text-white shadow-md mb-4 sm:mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Menu
          </Button>
        </Link>

        <div className="max-w-md mx-auto text-center py-8 sm:py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-200/50">
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-200 rounded-full p-2">
                  <span className="text-lg sm:text-2xl">😴</span>
                </div>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4 font-poorStory">Your cart is empty</h2>
            <p className="text-amber-700 mb-6 text-sm sm:text-base font-poppins">Looks like you haven't added any delicious thalis yet!</p>
            <Link href="/user">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg w-full">
                <Star className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Footer Skeleton Component
const FooterSkeleton = () => {
  return (
    <footer className="fixed bottom-[70px] sm:bottom-[70px] lg:bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-lg p-3 sm:p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <Skeleton className="h-10 sm:h-12 w-32 sm:w-40 rounded-xl bg-amber-200/50" />
        <Skeleton className="h-10 sm:h-12 w-40 sm:w-48 rounded-xl bg-amber-200/50" />
      </div>
    </footer>
  )
}

function Cart() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // Get cart data and functions from store
  const { cart, orderTotal, subscribe, unsubscribe, updateCartItemQuantity, removeFromCart, loading: storeLoading } = useStore()

  useEffect(() => {
    setAuthToken(storageService.getAuthToken())
  }, [])

  const user = authToken

  const loadCart = async () => {
    setLoading(true)
    setError("")

    try {
      if (user) {
        await subscribe(user)
      } else {
        throw new Error('User not authenticated')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load cart')
      } else {
        setError('Failed to load cart')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadCart()
      return () => {
        unsubscribe()
      }
    }
  }, [user])

  // Transform cart items to match the expected format for FoodCard
  const transformedCartItems = cart?.items?.map((item, index) => ({
    _id: `${item.type}-${index}-${(item.thali as any)._id || index}`,
    userId: user || '',
    thaaliTitle: item.thali.name || 'Custom Thali',
    menuItems: item.thali.menuItems || [],
    thaaliTotalPrice: item.thali.thaliPrice,
    thaliquantity: item.cartQuantity,
    cartIndex: index
  })) || []

  // Handle quantity update with loading state
  const handleQuantityUpdate = async (cartIndex: number, newQuantity: number) => {
    setIsUpdating(true)
    try {
      await updateCartItemQuantity(user, cartIndex, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
      setError('Failed to update quantity. Please try again.')
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle item removal with loading state
  const handleRemoveItem = async (cartIndex: number) => {
    setIsUpdating(true)
    try {
      await removeFromCart(user, cartIndex)
    } catch (error) {
      console.error('Error removing item:', error)
      setError('Failed to remove item. Please try again.')
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

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

  // Show loading skeleton
  if (loading || storeLoading) {
    return (
      <div className="flex flex-col min-h-screen mt-[70px]">
        <main className="flex-grow pb-[120px] sm:pb-[100px] lg:pb-[80px]">
          <CartLoading />
        </main>
        <FooterSkeleton />
      </div>
    )
  }

  // Show error state
  if (error && !cart?.items) {
    return (
      <div className="flex flex-col min-h-screen mt-[70px]">
        <main className="flex-grow pb-[120px] sm:pb-[100px] lg:pb-[80px]">
          <CartError error={error} onRetry={loadCart} />
        </main>
      </div>
    )
  }

  // Show empty cart
  if (!loading && !error && (!cart?.items || cart.items.length === 0)) {
    return (
      <div className="flex flex-col min-h-screen mt-[70px]">
        <main className="flex-grow pb-[120px] sm:pb-[100px] lg:pb-[80px]">
          <EmptyCart />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen mt-[70px] bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <main className="flex-grow pb-[120px] sm:pb-[100px] lg:pb-[80px]">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-6 sm:mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/user">
              <Button
                variant="outline"
                size="sm"
                className="bg-black text-white  text-white hover:text-white shadow-md px-3 sm:px-4"
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Menu</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            <div className="text-center flex-1 mx-2 sm:mx-4">
              <h1 className="font-poorStory font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-background bg-clip-text text-transparent">
                Your Cart
              </h1>
              <p className="text-background font-poppins text-xs sm:text-sm mt-1">
                {transformedCartItems.length} {transformedCartItems.length === 1 ? 'item' : 'items'} ready for checkout
              </p>
            </div>

            <div className="w-16 sm:w-20" />
          </motion.div>

          {/* Error toast for update/remove operations */}
          <AnimatePresence>
            {error && cart?.items && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg z-50"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Summary Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-amber-200/50 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-black text-sm sm:text-base">Order Summary</h3>
                  <p className="text-black text-xs sm:text-sm">{transformedCartItems.length} thali{transformedCartItems.length !== 1 ? 's' : ''} in cart</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-800 text-lg sm:text-xl">₹{orderTotal}</p>
                <p className="text-amber-600 text-xs sm:text-sm">Total Amount</p>
              </div>
            </div>
          </motion.div>

          {/* Cart Items Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {transformedCartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  layout
                  className={`relative ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <FoodCard
                    id={item._id}
                    heading={item.thaaliTitle}
                    thaliquantity={item.thaliquantity}
                    items={(item.menuItems || []).map(menuItem => ({
                      id: menuItem._id,
                      name: menuItem.name,
                      price: menuItem.price,
                      quantity: menuItem.quantity,
                    }))}
                    updateCartQuantity={handleQuantityUpdate}
                    removeFromCart={handleRemoveItem}
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <Badge
                      className={`text-xs px-2 py-1 ${cart.items[item.cartIndex].type === 'custom'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        }`}
                    >
                      {cart.items[item.cartIndex].type === 'custom' ? 'Custom' : 'Special'}
                    </Badge>
                  </div>
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <AnimatePresence>
        {cart?.items && cart.items.length > 0 && (
          <motion.footer
            className="fixed bottom-[70px] sm:bottom-[70px] lg:bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-lg p-3 sm:p-4 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-xl px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">
                <div className="text-center sm:text-left">
                  <p className="text-amber-700 text-xs sm:text-sm font-medium">Order Total</p>
                  <p className="font-bold text-amber-800 text-lg sm:text-xl">₹{orderTotal}</p>
                </div>
              </div>
              <Link href="/user/address" className="w-full sm:w-auto">
                <Button
                  className="bg-black hover:bg-gray-800 hover:text-white text-white px-6 sm:px-8 py-3 w-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold text-sm sm:text-base"
                  disabled={cart?.items?.length === 0 || isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Wait...</span>
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Proceed to Checkout</span>
                      <span className="sm:hidden">Checkout</span>
                    </>
                  )}
                </Button>
              </Link>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}

export default withAuth(Cart)