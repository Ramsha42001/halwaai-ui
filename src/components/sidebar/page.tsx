'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Star, ChefHat, ShoppingCart, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { storageService } from "@/utils/storage"
import { useEffect, useState } from "react"
import { useStore } from '@/services/store/menuItemsStore'
import menuItemService from '@/services/api/menuItemService'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"

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

interface Category {
  _id: string,
  selectedForThali: boolean
}

interface SidebarProps {
  menuItems: MenuItem[]
}

export function Sidebar({ menuItems }: SidebarProps) {
  const { thaliProgress } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const selectedItems = menuItems // Using menuItems as selectedItems
  const orderTotal = menuItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const clearSearch = () => {
    setSearchTerm("")
  }

  const getProgressColor = () => {
    if (thaliProgress < 30) return "from-red-500 to-orange-500"
    if (thaliProgress < 70) return "from-yellow-500 to-orange-500"
    return "from-green-500 to-emerald-500"
  }

  const getProgressText = () => {
    if (thaliProgress < 30) return "Just getting started! 🌱"
    if (thaliProgress < 70) return "Looking good! 👍"
    if (thaliProgress < 90) return "Almost there! 🔥"
    return "Perfect thali! ✨"
  }

  const totalItems = menuItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="bg-black hover:gray-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Menu className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Thali Progress</span>
              <span className="sm:hidden">{Math.round(thaliProgress)}%</span>

              {totalItems > 0 && (
                <Badge className="ml-2 bg-white/20 text-white">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </motion.div>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-full sm:w-[400px] bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-r-0 [&>button]:text-amber-600 [&>button]:hover:text-amber-800"
        >
          <SheetHeader className="pb-6">
            <SheetTitle className="sr-only">Thali Progress Sidebar</SheetTitle>
          </SheetHeader>

          <div className="p-6 w-full space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold font-poorStory bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Your Thali Journey
              </h2>
              <p className="text-gray-600 font-poppins mt-1 text-sm">
                {getProgressText()}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="space-y-4">
              <motion.div
                className="bg-black text-white p-4 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Progress</p>
                    <p className="text-2xl font-bold">{Math.round(thaliProgress)}%</p>
                  </div>
                  <Star className="w-8 h-8 opacity-80" />
                </div>
              </motion.div>

              {orderTotal > 0 && (
                <motion.div
                  className="bg-black text-white p-4 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Amount</p>
                      <p className="text-2xl font-bold">₹{orderTotal}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 opacity-80" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Thali Completion</span>
                <Badge className={`bg-gradient-to-r ${getProgressColor()} text-white`}>
                  {Math.round(thaliProgress)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full shadow-sm`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(thaliProgress, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Selected Items Preview */}
            {selectedItems.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  Selected Items ({selectedItems.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedItems.slice(0, 3).map((item) => (
                    <div key={item._id} className="flex items-center space-x-2 text-sm">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="flex-1 truncate">{item.name}</span>
                      <Badge variant="secondary">×{item.quantity}</Badge>
                    </div>
                  ))}
                  {selectedItems.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{selectedItems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link href="/user/thali" className="block">
              <Button className="w-full bg-black hover:bg-black/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Complete Thali
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}