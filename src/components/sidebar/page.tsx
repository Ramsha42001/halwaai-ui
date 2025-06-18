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
  requiredCategory: Category[];
}

export function Sidebar({ menuItems, requiredCategory }: SidebarProps) {
  const { selectedItems } = useStore();

  const thaliProgress = JSON.parse(localStorage.getItem('thaliProgress') || '0');
  console.log(thaliProgress)




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
            <ul className="space-y-4 mt-2">
              {Array.from(selectedItems.entries()).map(([id, quantity]) => {
                const item = menuItems.find(item => item._id === id);
                return (
                  <li key={id}>
                    {item ? `${item.name}: Quantity ${quantity}` : `Item ID: ${id}, Quantity: ${quantity}`}
                  </li>
                );
              })}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
