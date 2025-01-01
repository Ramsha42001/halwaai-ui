'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import { MenuItemCard } from '@/components/menuItemCard/page'
import { Sidebar } from '@/components/sidebar/page'
import { MenuBar } from '@/components/MenuBar/page'


interface MenuItem {
  id: number
  name: string
  description: string
  image: string
  quantity: number
  hasButter: boolean
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Tandoori Roti",
      description: "Soft, fluffy roti, hand-tossed and baked in a hot tandoor.",
      image: "/images/roti.png",
      quantity: 0,
      hasButter: false,
    },
    {
      id: 2,
      name: "Naan",
      description: "Soft, fluffy naan, hand-tossed and baked in a hot tandoor.",
      image: "/images/roti.png",
      quantity: 0,
      hasButter: false,
    },
  ])

  const updateQuantity = (id: number, increment: boolean) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: increment
                ? item.quantity + 1
                : Math.max(0, item.quantity - 1),
            }
          : item
      )
    )
  }

  const toggleButter = (id: number) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, hasButter: !item.hasButter } : item
      )
    )
  }

  return (
    <div className="flex min-h-[100vh] h-auto bg-foreground flex-col text-[black] mt-[70px] pb-[20%] md:pb-[5%]">
      <MenuBar  />
      <div className="flex flex-1 md:flex-row flex-col mt-[20px] ml-[5px]"> {/* Add margin-top here */}
        <Sidebar />
        <div className="flex-1 p-4">
          {/* <div className="md:hidden mb-4 flex justify-between items-center">
            <select className="w-full max-w-[200px] p-2 rounded-lg border bg-white ml-2">
              <option>Select a menu item</option>
              {["Breads", "Appetizers", "Rice", "Sabzi", "Paneer ki Sabzi", "Dal", "Beverages"].map(
                (category) => (
                  <option key={category}>{category}</option>
                )
              )}
            </select>
          </div> */}

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold font-poorStory">Breads</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  {...item}
                  onQuantityChange={updateQuantity}
                  onButterToggle={toggleButter}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button className="bg-black text-white hover:bg-black/90">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


