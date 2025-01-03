'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import { MenuItemCard } from '@/components/menuItemCard/page'
import { Sidebar } from '@/components/sidebar/page'
import { MenuBar } from '@/components/MenuBar/page'
import Link from 'next/link'
interface MenuItem {
  id: number
  name: string
  description: string
  image: string
  quantity: number
  hasButter: boolean
}

const menuData: Record<string, MenuItem[]> = {
  breads: [
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
  ],
  appetizers: [
    {
      id: 3,
      name: "Spring Rolls",
      description: "Crispy spring rolls filled with fresh vegetables.",
      image: "/images/roti.png",
      quantity: 0,
      hasButter: false,
    },
    {
      id: 4,
      name: "Samosa",
      description: "Golden fried samosas with spicy potato filling.",
      image: "/images/roti.png",
      quantity: 0,
      hasButter: false,
    },
  ],
  beverages: [
    {
      id: 5,
      name: "Masala Chai",
      description: "Aromatic Indian tea with spices.",
      image: "/images/roti.png",
      quantity: 0,
      hasButter: false,
    },
    {
      id: 6,
      name: "Lassi",
      description: "Refreshing yogurt-based drink.",
      image: "/images/roti.png",
      quantity: 0,
      hasButter: false,
    },
  ],
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("breads")
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuData["breads"] || [])

  const handleCategoryChange = (category: string) => {
    if (menuData[category]) {
      setSelectedCategory(category)
      setMenuItems(menuData[category])
    } else {
      console.warn(`Category "${category}" does not exist in menuData.`)
      setMenuItems([]) // Clear items if category is invalid
    }
  }

  const updateQuantity = (id: number, increment: boolean) => {
    setMenuItems((items) =>
      items.map((item) =>
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
    setMenuItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, hasButter: !item.hasButter } : item
      )
    )
  }

  return (
    <div className="flex min-h-[100vh] h-auto bg-foreground flex-col text-[black] mt-[70px] pb-[20%] md:pb-[5%]">
      <MenuBar onCategorySelect={handleCategoryChange} />
      <div className="flex flex-1 md:flex-row flex-col mt-[20px] ml-[5px]">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold font-poorStory capitalize">{selectedCategory}</h1>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    {...item}
                    onQuantityChange={updateQuantity}
                    onButterToggle={toggleButter}
                  />
                ))
              ) : (
                <p className="text-gray-500">No items available for this category.</p>
              )}
            </div>
            <div className="flex justify-end">
              <Link href="/user/thali">
              <Button className="bg-black text-white hover:bg-black/90">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
