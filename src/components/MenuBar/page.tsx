'use client'

import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'
import Link from "next/link"
interface MenuBarProps {
  onCategorySelect: (categoryId: string) => void
}
import { useState, useEffect } from 'react'
import CategoryService from '@/services/api/categoryService'


interface Category {
  _id: string
  name: string
}

export function MenuBar({ onCategorySelect }: MenuBarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
      CategoryService.getCategories().then((response) => {
        setCategories(response)
        if (response.length > 0) {
          setSelectedCategory(response[0]._id)
          onCategorySelect(response[0]._id)
        }
      })
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    onCategorySelect(categoryId)
  }

  return (
    <div className="bg-[#2C2C2C] text-white p-4 flex items-center justify-between overflow-x-auto">
      {/* Categories for larger screens */}
      <div className="hidden md:flex space-x-4">
        {categories.map((category) => (
          <Button
            key={category._id}
            variant="ghost"
            className={`text-white hover:text-white/70 hover:bg-background ${
              selectedCategory === category._id ? 'bg-background text-white' : ''
            }`}
            onClick={() => handleCategorySelect(category._id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Dropdown for smaller screens */}
      <div className="md:hidden">
        <select
          className="p-2 bg-black text-white rounded-lg"
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

      {/* View Thali Button */}
      <Link href="/user/thali">
      <Button variant="outline" className="bg-black text-white hover:bg-black/90">
        <Eye className="mr-2 h-4 w-4" />
        View Thali
      </Button>
      </Link>
    </div>
  )
}
