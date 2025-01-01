'use client'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Eye } from 'lucide-react'

const categories = [
  { id: "breads", name: "Breads" },
  { id: "appetizers", name: "Appetizers" },
  { id: "rice", name: "Rice" },
  { id: "sabzi", name: "Sabzi" },
  { id: "paneer", name: "Paneer & Subs" },
  { id: "dal", name: "Dal" },
  { id: "beverages", name: "Beverages" },
  { id: "add-ons", name: "Add-Ons" }
]

export function MenuBar() {
  return (
    <div className="bg-[#2C2C2C] text-white p-4 flex items-center justify-between overflow-x-auto">
      {/* For larger screens, display the categories in a row */}
      <div className="hidden md:flex space-x-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="text-white hover:text-white/70 hover:bg-background"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* For smaller screens, show a dropdown */}
      <div className="md:hidden">
        <select className="p-2 bg-black text-white rounded-lg">
          {categories.map((category) => (
            <option key={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* View Thali Button outside the dropdown */}
     
          <Button variant="outline" className="bg-black text-white hover:bg-black/90">
            <Eye className="mr-2 h-4 w-4" />
            View Thali
          </Button>
      
          
    </div>
  )
}
