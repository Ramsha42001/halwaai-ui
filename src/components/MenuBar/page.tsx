'use client'

import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'
import Link from "next/link"
interface MenuBarProps {
  onCategorySelect: (categoryId: string) => void
}

const categories = [
  { id: "breads", name: "Breads" },
  { id: "appetizers", name: "Appetizers" },
  { id: "rice", name: "Rice" },
  { id: "sabzi", name: "Sabzi" },
  { id: "paneer", name: "Paneer & Subs" },
  { id: "dal", name: "Dal" },
  { id: "beverages", name: "Beverages" },
  { id: "add-ons", name: "Add-Ons" }
];

export function MenuBar({ onCategorySelect }: MenuBarProps) {
  return (
    <div className="bg-[#2C2C2C] text-white p-4 flex items-center justify-between overflow-x-auto">
      {/* Categories for larger screens */}
      <div className="hidden md:flex space-x-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="text-white hover:text-white/70 hover:bg-background"
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Dropdown for smaller screens */}
      <div className="md:hidden">
        <select
          className="p-2 bg-black text-white rounded-lg"
          onChange={(e) => onCategorySelect(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
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
