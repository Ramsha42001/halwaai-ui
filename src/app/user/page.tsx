'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronRight, Search, Filter, Utensils, Star, Clock, TrendingUp, User, ShoppingCart } from 'lucide-react'
import { MenuItemCard } from '@/components/menuItemCard/page'
import { Sidebar } from '@/components/sidebar/page'
import { MenuBar } from '@/components/MenuBar/page'
import menuItemService from '@/services/api/menuItemService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/services/store/menuItemsStore'
import categoryService from '@/services/api/categoryService'
import withAuth from '@/utils/withAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

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
  name: string,
  requiredThali: string
}

interface RequiredCategoryItems {
  _id: string,
  selectedForThali: boolean
}

function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { selectedItems, orderTotal, thaliProgress, loading, error, requiredCategories, subscribe, unsubscribe, addItem, removeItem } = useStore()
  const router = useRouter()
  const [category, setCategory] = useState<Category[]>([])

  const user = localStorage.getItem('authToken')

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true)
        const response = await menuItemService.getMenuItems()
        setMenuItems(response)
      } catch (error) {
        console.error('Failed to load menu items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuItems()
  }, [])

  useEffect(() => {
    if (user) {
      subscribe(user)
      return () => unsubscribe()
    }
  }, [user, subscribe, unsubscribe])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories()
        setCategory(response)
        const requiredCategory = response.filter((cat: Category) => cat && cat.requiredThali === 'yes')
        const initialRequiredCategories = requiredCategory.map((item: Category) => ({
          _id: item._id,
          selectedForThali: false
        }))
        useStore.getState().setRequiredCategories(initialRequiredCategories)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    loadCategories()
  }, [])

  // Filter menu items by category and search term
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category && item.category._id === selectedCategory : true
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category)
  }, [])

  const clearSearch = () => {
    setSearchTerm('')
  }

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Enhanced Menu Bar */}
      <MenuBar onCategorySelect={handleCategorySelect} />

      <div className="flex pt-[140px] min-h-screen">
        {/* Left Sidebar - Desktop Only */}



        <motion.div
          className="hidden lg:flex w-80 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg fixed left-0 top-[140px] bottom-0 overflow-y-auto"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
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

            <div className="relative mt-[100px]">
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
            <div className="space-y-4 ">

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

            {/* Search Bar */}


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
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          className="flex-1 lg:ml-80"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Menu Items Grid */}
          <div className="p-6 my-[20px] ">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[...Array(6)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                      variants={itemVariants}
                    >
                      <div className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : filteredMenuItems.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-20"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No dishes found</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    {searchTerm
                      ? `No dishes match "${searchTerm}". Try adjusting your search or browse different categories.`
                      : "No dishes available in this category. Please select a different category."
                    }
                  </p>
                  {searchTerm && (
                    <Button
                      onClick={clearSearch}
                      className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600"
                    >
                      Clear Search
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredMenuItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      custom={index}
                    >
                      <MenuItemCard
                        id={item._id}
                        name={item.name}
                        description={item.description}
                        image={item.imageUrl}
                        price={item.price}
                        category={selectedCategory}
                        isAdminPage={false}
                        onAdd={() => addItem(user, item)}
                        onRemove={() => removeItem(user, item)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Info */}
            {!isLoading && filteredMenuItems.length > 0 && (
              <motion.div
                className="mt-8 text-center"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-gray-600 font-poppins">
                  Showing {filteredMenuItems.length} of {menuItems.length} dishes
                  {searchTerm && (
                    <span> for "<span className="font-medium text-amber-600">{searchTerm}</span>"</span>
                  )}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>


    </div>
  )
}

export default withAuth(MenuPage)
