'use client'

import { Button } from "@/components/ui/button"
import { Eye, ChefHat, Sparkles } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect, useCallback } from 'react'
import CategoryService from '@/services/api/categoryService'
import { Sidebar } from "../sidebar/page"
import { useStore } from '@/services/store/menuItemsStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface MenuBarProps {
  onCategorySelect: (categoryId: string) => void
}

interface Category {
  _id: string
  name: string
}

export function MenuBar({ onCategorySelect }: MenuBarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const { selectedItems } = useStore()

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    onCategorySelect(categoryId)
  }, [onCategorySelect])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        const response = await CategoryService.getCategories()
        setCategories(response)
        if (response.length > 0) {
          const firstCategoryId = response[0]._id
          setSelectedCategory(firstCategoryId)
          onCategorySelect(firstCategoryId)
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [onCategorySelect])

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)

  const categoryVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const buttonVariants = {
    inactive: {
      backgroundColor: "transparent",
      color: "rgb(156 163 175)",
      scale: 1
    },
    active: {
      backgroundColor: "hsl(var(--background))",
      color: "white",
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg fixed top-[70px] w-full z-40 mt-[20px]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 mr-6">
              <ChefHat className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-gray-800 font-poppins">Categories</span>
            </div>

            <AnimatePresence>
              {isLoading ? (
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.div
                  className="flex space-x-2"
                  variants={categoryVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {categories.map((category, index) => (
                    <motion.div
                      key={category._id}
                      variants={buttonVariants}
                      initial="inactive"
                      animate={selectedCategory === category._id ? "active" : "inactive"}
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${selectedCategory === category._id
                          ? 'bg-background text-white shadow-lg'
                          : 'text-gray-600 hover:text-white hover:bg-background/80'
                          }`}
                        onClick={() => handleCategorySelect(category._id)}
                      >
                        {category.name}
                        {selectedCategory === category._id && (
                          <motion.div
                            className="absolute inset-0 bg-background/20"
                            layoutId="activeCategory"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/user/thali">
              <Button
                variant="outline"
                className="bg-black hover:bg-black/90 hover:text-white px-6 py-2"
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View Thali</span>
                {totalItems > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between py-3 gap-3">
          {/* Category Dropdown */}
          <div className="flex-1 max-w-[200px]">
            <div className="relative">
              <select
                className="w-full p-3 bg-white border border-gray-200 text-gray-800 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer shadow-sm"
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Sidebar */}
            <Sidebar menuItems={selectedItems} />

            {/* View Thali Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/user/thali">
                <Button
                  variant="outline"
                  className="bg-black hover:bg-gray-800 text-white border-0 shadow-lg px-3 py-2 relative"
                >
                  <Eye className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">View Thali</span>
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}