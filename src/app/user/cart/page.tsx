'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import FoodCard from "@/components/cartCard/page"
import { useState, useEffect } from "react"
import Link from "next/link"
import { cartService } from "@/services/api/cartService"
// import { useStore } from '@/services/store/menuItemsStore'

export default function Cart() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  // const { orderTotal } = useStore();

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

  interface CartItem {
    _id: string;
    userId: string;
    thaaliTitle: string;
    menuItems: MenuItem[];
    thaaliTotalPrice: number;
    thaliquantity: number;

  }

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await cartService.getCartItems();
        setCartItems(response[0].cartItems.cartItems.map((item: CartItem) => ({
          _id: item._id,
          userId: item.userId,
          thaaliTitle: item.thaaliTitle,
          menuItems: item.menuItems,
          thaaliTotalPrice: item.thaaliTotalPrice,
          thaliquantity: item.thaliquantity
        })));
        setOrderTotal(response[0].cartItems.totalPrice);
        console.log(cartItems)
        console.log('Cart items:', response[0].cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);




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

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(cartItems) && cartItems.map((item, index) => (
                <FoodCard
                  key={item._id || index}
                  id={item._id}
                  heading={item.thaaliTitle}
                  thaliquantity={item.thaliquantity}
                  items={Object.values(item.menuItems).map(menuItem => ({
                    id: menuItem._id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: menuItem.quantity,
                  }))}

                />
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
            >
              Proceed to checkout
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
