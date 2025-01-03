'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

// Dummy selected menu items and their quantities
const selectedItems = [
  { id: 1, name: "Tandoori Roti", quantity: 2 },
  { id: 2, name: "Spring Rolls", quantity: 1 },
  { id: 3, name: "Masala Chai", quantity: 3 },
]

export function Sidebar() {
  // Simulate Thali progress percentage (you can calculate this based on your logic)
  const thaliProgress = 70 // Example: 70% progress

  return (
    <div className="w-64">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-black text-white hover:bg-black/90">
            <Menu className="mr-2 h-4 w-4" />
            View Thali Progress
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetHeader>
            {/* Title for screen readers */}
            <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
            <SheetDescription>
              {/* Here's the sidebar menu content */}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Thali Progress Section */}
            <h2 className="text-4xl font-semibold text-[white] font-poorStory">Thali Progress</h2>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[black] h-2.5 rounded-full" style={{ width: `${thaliProgress}%` }}></div>
            </div>
            <p className="text-md mt-1 text-[white]">{thaliProgress}% Completed</p>

            {/* Selected Items Section */}
            <p className="text-md text-[white] mt-4">Selected Items:</p>
            <ul className="space-y-2 mt-2">
              {selectedItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm text-[white]">
                  <span>{item.name}</span>
                  <span className="bg-gray-200 px-2 py-1 rounded-md text-gray-800">Quantity: {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
