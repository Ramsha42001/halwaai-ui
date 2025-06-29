'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { storageService } from "@/utils/storage"
import { useEffect, useState } from "react"
// import { MenuItem } from "@/types/menu"
import { useStore } from '@/services/store/menuItemsStore'
import menuItemService from '@/services/api/menuItemService'

interface MenuItem {
  _id: string; // Ensure this matches the ID used in selectedItems
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  hasButter?: boolean;
  quantity: number;
}

interface Category {
  _id: string,
  selectedForThali: boolean
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export function Sidebar({ menuItems }: SidebarProps) {

  const { thaliProgress } = useStore();
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-black text-white hover:bg-black/90">
            <Menu className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">View Thali Progress</span>
            <span className="sm:hidden">{Math.round(thaliProgress)}%</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <h2 className="text-4xl font-semibold text-[white] font-poorStory">Thali Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[black] h-2.5 rounded-full"
                style={{ width: `${Math.min(thaliProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-md mt-1 text-[white]">{Math.round(thaliProgress)}% Completed</p>

            <p className="text-md text-[white] mt-4">Selected Items:</p>
            <ul className="space-y-2 mt-2">
              {menuItems.map(item => (
                <li key={item._id} className="flex items-center bg-white/80 rounded-lg p-2 shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded mr-3 border border-gray-300"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-black">{item.name}</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 bg-gray-200 rounded px-2 py-1">x{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
