'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ShoppingCart, AlertCircle } from 'lucide-react'
import FoodCard from "@/components/cartCard/page"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useStore } from '@/services/store/menuItemsStore'
import withAuth from "@/utils/withAuth"
import { Skeleton } from "@/components/ui/skeleton"
import { storageService } from "@/utils/storage";

const CartCardSkeleton = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(storageService.getAuthToken())
  })
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Menu items skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex justify-between items-center py-2">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>

      {/* Footer skeleton */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-12 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  )
}

// Loading State Component
const CartLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button skeleton */}
      <Skeleton className="h-10 w-24 mb-6" />

      {/* Title skeleton */}
      <div className="flex justify-center mb-8">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Cart items grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <CartCardSkeleton key={item} />
        ))}
      </div>
    </div>
  )
}

// Error State Component
const CartError: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/user">
        <Button variant="default" className="bg-black hover:bg-gray-800 text-white mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </Link>

      <div className="max-w-md mx-auto text-center py-12">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error || 'Failed to load your cart items. Please try again.'}</p>
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            Try Again
          </Button>
          <Link href="/user">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Empty Cart Component
const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/user">
        <Button variant="default" className="bg-black hover:bg-gray-800 text-white mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </Link>

      <div className="max-w-md mx-auto text-center py-12">
        <div className="mb-6">
          <div className="relative inline-block">
            <ShoppingCart className="w-24 h-24 text-gray-300" />
            <div className="absolute -bottom-2 -right-2 bg-gray-200 rounded-full p-2">
              <span className="text-2xl">😴</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any delicious thalis yet!</p>
        <Link href="/user">
          <Button className="bg-black hover:bg-gray-800 text-white">
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Footer Skeleton Component
const FooterSkeleton = () => {
  return (
    <footer className="fixed bottom-[70px] sm:bottom-[70px] lg:bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-12 w-40 rounded-md" />
        <Skeleton className="h-12 w-48 rounded-md" />
      </div>
    </footer>
  )
}

function Cart() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Get cart data and functions from store
  const { cart, orderTotal, subscribe, unsubscribe, updateCartItemQuantity, removeFromCart, loading: storeLoading } = useStore();
  const user = localStorage.getItem('authToken')

  const loadCart = async () => {
    setLoading(true);
    setError("");

    try {
      if (user) {
        await subscribe(user);
      } else {
        throw new Error('User not authenticated');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load cart');
      } else {
        setError('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    return () => {
      if (user) unsubscribe();
    };
  }, [user]);

  // Transform cart items to match the expected format for FoodCard
  const transformedCartItems = cart?.items?.map((item, index) => ({
    _id: `${item.type}-${index}-${(item.thali as any)._id || index}`,
    userId: user || '',
    thaaliTitle: item.thali.name || 'Custom Thali',
    menuItems: item.thali.menuItems || [],
    thaaliTotalPrice: item.thali.thaliPrice,
    thaliquantity: item.cartQuantity,
    cartIndex: index
  })) || [];

  // Handle quantity update with loading state
  const handleQuantityUpdate = async (cartIndex: number, newQuantity: number) => {
    setIsUpdating(true);
    try {
      await updateCartItemQuantity(user, cartIndex, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity. Please try again.');
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle item removal with loading state
  const handleRemoveItem = async (cartIndex: number) => {
    setIsUpdating(true);
    try {
      await removeFromCart(user, cartIndex);
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading skeleton
  if (loading || storeLoading) {
    return (
      <div className="flex flex-col min-h-screen mt-[70px]">
        <main className="flex-grow pb-[45%] sm:pb-[45%] lg:pb-[5%]">
          <CartLoading />
        </main>
        <FooterSkeleton />
      </div>
    );
  }

  // Show error state
  if (error && !cart?.items) {
    return (
      <div className="flex flex-col min-h-screen mt-[70px]">
        <main className="flex-grow pb-[45%] sm:pb-[45%] lg:pb-[5%]">
          <CartError error={error} onRetry={loadCart} />
        </main>
      </div>
    );
  }

  // Show empty cart
  if (!loading && !error && (!cart?.items || cart.items.length === 0)) {
    return (
      <div className="flex flex-col min-h-screen mt-[70px]">
        <main className="flex-grow pb-[45%] sm:pb-[45%] lg:pb-[5%]">
          <EmptyCart />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mt-[70px]">
      <main className="flex-grow pb-[45%] sm:pb-[45%] lg:pb-[5%]">
        <div className="container mx-auto px-4 py-8">
          <Link href="/user">
            <Button variant="default" className="bg-black hover:bg-gray-800 text-white mb-6">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-black text-3xl md:text-4xl font-poorStory font-bold text-center mb-8">Your Cart</h1>

          {/* Error toast for update/remove operations */}
          {error && cart?.items && (
            <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedCartItems.map((item) => (
              <div key={item._id} className={`relative ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
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
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded ${cart.items[item.cartIndex].type === 'custom'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                    }`}>
                    {cart.items[item.cartIndex].type === 'custom' ? 'Custom' : 'Special'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-[70px] sm:bottom-[70px] lg:bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="border-2 border-black rounded-md px-4 py-2 w-full sm:w-auto text-center sm:text-left">
            <span className="font-bold text-black">Order Total: ₹ {orderTotal}</span>
          </div>
          <Link href="/user/address">
            <Button
              className="bg-black hover:bg-gray-800 text-white px-8 py-2 w-full sm:w-auto"
              disabled={cart?.items?.length === 0 || isUpdating}
            >
              {isUpdating ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                'Proceed to checkout'
              )}
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default withAuth(Cart)