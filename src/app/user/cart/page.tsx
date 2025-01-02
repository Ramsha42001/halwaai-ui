'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import FoodCard from "@/components/cartCard/page"
import { useState, useEffect } from "react"

const ThaliMenu = [
  {
    id: 'maharaja-thali',
    title: 'Maharaja Thali',
    items: [
      { name: 'Dal Makhani', price: 70 },
      { name: 'Paneer Tikka', price: 200 },
      { name: 'Jeera Rice', price: 150 },
      { name: 'Naan', price: 70 },
    ]
  },
  {
    id: 'punjai-thali',
    title: 'Punjabi Thali',
    items: [
      { name: 'Chole', price: 80 },
      { name: 'Paneer Butter Masala', price: 180 },
      { name: 'Pulao', price: 140 },
      { name: 'Roti', price: 50 },
    ]
  },
  // Add more thali options as needed
]

export default function Cart() {
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const total = ThaliMenu.reduce((acc, thali) => {
      return acc + thali.items.reduce((itemAcc, item) => itemAcc + item.price, 0)
    }, 0)
    setTotalPrice(total)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-[45%] sm:pb-[45%] lg:pb-[5%]">
        <div className="container mx-auto px-4 py-8">
          <Button variant="default" className="bg-black hover:bg-gray-800 text-white mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-black text-3xl md:text-4xl font-poorStory font-bold text-center mb-8">Your Cart</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
            {ThaliMenu.map((item) => (
              <FoodCard key={item.id} heading={item.title} items={item.items} />
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-[70px] sm:bottom-[70px] lg:bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="border-2 border-black rounded-md px-4 py-2 w-full sm:w-auto text-center sm:text-left">
            <span className="font-bold text-black">Order Total: ₹ {totalPrice}</span>
          </div>
          <Button 
            className="bg-black hover:bg-gray-800 text-white px-8 py-2 w-full sm:w-auto"
          >
            Proceed to checkout
          </Button>
        </div>
      </footer>
    </div>
  )
}
