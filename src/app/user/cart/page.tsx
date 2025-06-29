'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import FoodCard from "@/components/cartCard/page"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useStore } from '@/services/store/menuItemsStore'
import withAuth from "@/utils/withAuth"

function Cart() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Get cart data and functions from store
  const { cart, orderTotal, subscribe, unsubscribe, updateCartItemQuantity, removeFromCart } = useStore();
  const user = localStorage.getItem('authToken')

  useEffect(() => {
    if (user) {
      subscribe(user);
      setLoading(false);
      return () => unsubscribe();
    } else {
      setLoading(false);
      setError('User not authenticated');
    }
  }, [user, subscribe, unsubscribe]);

  // Transform cart items to match the expected format for FoodCard
  const transformedCartItems = cart.items.map((item, index) => ({
    _id: `${item.type}-${index}-${(item.thali as any)._id || index}`,
    userId: user || '',
    thaaliTitle: item.thali.name || 'Custom Thali',
    menuItems: item.thali.menuItems,
    thaaliTotalPrice: item.thali.thaliPrice,
    thaliquantity: item.cartQuantity,
    cartIndex: index // Store index for updating quantity
  }));

  // Handle quantity update
  const handleQuantityUpdate = async (cartIndex: number, newQuantity: number) => {
    try {
      await updateCartItemQuantity(user, cartIndex, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
    }
  };

  // Handle item removal
  const handleRemoveItem = async (cartIndex: number) => {
    try {
      await removeFromCart(user, cartIndex);
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item');
    }
  };

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

          {loading && (
            <div className="text-center py-8">Loading cart items...</div>
          )}

          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}

          {!loading && !error && cart.items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Link href="/user">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}

          {!loading && !error && cart.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedCartItems.map((item) => (
                <div key={item._id} className="relative">
                  <FoodCard
                    id={item._id}
                    heading={item.thaaliTitle}
                    thaliquantity={item.thaliquantity}
                    items={item.menuItems.map(menuItem => ({
                      id: menuItem._id,
                      name: menuItem.name,
                      price: menuItem.price,
                      quantity: menuItem.quantity,
                    }))}
                  />



                  {/* Show thali type badge */}
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
          )}
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
              disabled={cart.items.length === 0}
            >
              Proceed to checkout
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default withAuth(Cart)