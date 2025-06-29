'use client'

import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect, useCallback } from 'react'
import CategoryService from '@/services/api/categoryService'
import { Sidebar } from "../sidebar/page"
import { useStore } from '@/services/store/menuItemsStore'

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

  const { selectedItems } = useStore();

  // Memoize the category selection handler
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    onCategorySelect(categoryId)
  }, [onCategorySelect])

  useEffect(() => {
    CategoryService.getCategories().then((response) => {
      setCategories(response)
      if (response.length > 0) {
        const firstCategoryId = response[0]._id
        setSelectedCategory(firstCategoryId)
        onCategorySelect(firstCategoryId)
      }
    })
  }, [onCategorySelect]) // Keep this dependency but the parent should memoize the callback

  return (
    <div className="bg-[#2C2C2C] text-white p-4 fixed w-[100%]">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category._id}
              variant="ghost"
              className={`text-white hover:text-white/70 hover:bg-background ${selectedCategory === category._id ? 'bg-background text-white' : ''
                }`}
              onClick={() => handleCategorySelect(category._id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <Link href="/user/thali">
          <Button variant="outline" className="bg-black text-white hover:bg-black/90">
            <Eye className="mr-2 h-4 w-4" />
            View Thali
          </Button>
        </Link>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center justify-between gap-2">
        {/* Category Dropdown */}
        <div className="w-[200px]">
          <select
            className="w-full p-2  bg-[black] text-white border-[1px] border-[white] font-semibold rounded-lg text-center focus:outline-none focus:border-gray-600"
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row gap-2">
          <div className="ml-[10px]">
            <Sidebar menuItems={selectedItems} />
          </div>
          <Link href="/user/thali">
            <Button variant="outline" className="bg-black text-white hover:bg-black/90 px-3">
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">View Thali</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}